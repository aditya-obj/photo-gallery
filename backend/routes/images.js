const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
    }
  }
});

// Helper function to get image metadata from file
const getImageMetadata = async (filePath, filename) => {
  try {
    const stats = fs.statSync(filePath);
    const metadata = await sharp(filePath).metadata();
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    
    return {
      id: filename.split('.')[0], // Use filename without extension as ID
      filename,
      title: filename.split('.')[0].replace(/[-_]/g, ' '), // Convert filename to title
      description: '',
      url: `${baseUrl}/uploads/${filename}`,
      thumbnail: `${baseUrl}/uploads/thumb_${filename}`,
      size: stats.size,
      dimensions: `${metadata.width}x${metadata.height}`,
      mimeType: `image/${metadata.format}`,
      tags: [],
      createdAt: stats.birthtime,
      updatedAt: stats.mtime
    };
  } catch (error) {
    console.error('Error getting metadata for', filename, error);
    return null;
  }
};

// Helper function to scan uploads directory
const scanImagesDirectory = async () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    return [];
  }

  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) && !file.startsWith('thumb_');
  });

  const images = [];
  for (const file of imageFiles) {
    const filePath = path.join(uploadsDir, file);
    const metadata = await getImageMetadata(filePath, file);
    if (metadata) {
      images.push(metadata);
    }
  }

  return images;
};

// Helper function to ensure thumbnail exists
const ensureThumbnail = async (originalPath, thumbnailPath) => {
  if (!fs.existsSync(thumbnailPath)) {
    try {
      await sharp(originalPath)
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
    } catch (error) {
      console.error('Error creating thumbnail:', error);
    }
  }
};

// GET /api/images - Get all images with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Scan directory for images
    let images = await scanImagesDirectory();
    
    // Create thumbnails for existing images if they don't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    for (const image of images) {
      const originalPath = path.join(uploadsDir, image.filename);
      const thumbnailPath = path.join(uploadsDir, `thumb_${image.filename}`);
      await ensureThumbnail(originalPath, thumbnailPath);
    }

    // Filter images based on search
    if (search) {
      images = images.filter(image => 
        image.title.toLowerCase().includes(search.toLowerCase()) ||
        image.description.toLowerCase().includes(search.toLowerCase()) ||
        image.filename.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const total = images.length;
    const paginatedImages = images.slice(skip, skip + limit);

    res.json({
      images: paginatedImages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + paginatedImages.length < total
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// GET /api/images/:id - Get single image
router.get('/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    const images = await scanImagesDirectory();
    const image = images.find(img => img.id === imageId);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// POST /api/images/upload - Upload new image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { title, description, tags } = req.body;
    const filePath = req.file.path;
    const filename = req.file.filename;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Get image metadata using sharp
    const metadata = await sharp(filePath).metadata();
    const dimensions = `${metadata.width}x${metadata.height}`;

    // Create thumbnail
    const thumbnailPath = path.join(path.dirname(filePath), `thumb_${filename}`);
    await sharp(filePath)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    const imageData = {
      id: filename.split('.')[0],
      filename,
      originalName: req.file.originalname,
      title: title || req.file.originalname,
      description: description || '',
      url: `${baseUrl}/uploads/${filename}`,
      thumbnail: `${baseUrl}/uploads/thumb_${filename}`,
      size: req.file.size,
      dimensions,
      mimeType: req.file.mimetype,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json(imageData);
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// DELETE /api/images/:id - Delete image
router.delete('/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    const images = await scanImagesDirectory();
    const image = images.find(img => img.id === imageId);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete physical files
    const uploadsDir = path.join(__dirname, '../uploads');
    const imagePath = path.join(uploadsDir, image.filename);
    const thumbnailPath = path.join(uploadsDir, `thumb_${image.filename}`);
    
    // Delete files
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;
