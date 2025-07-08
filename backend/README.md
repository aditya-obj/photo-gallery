# Photo Gallery Backend

A simple Node.js/Express backend API for the photo gallery application that uses file system storage.

## Features

- File system-based image storage (no database required)
- Image upload with automatic thumbnail generation
- Real-time directory scanning for images
- Search functionality
- Pagination
- Rate limiting
- Image compression and optimization
- RESTful API endpoints

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## How It Works

The backend scans the `uploads/` folder in real-time to serve images:

1. **Image Storage**: All images are stored in `backend/uploads/`
2. **Thumbnails**: Auto-generated as `thumb_filename.jpg` (300x300px)
3. **Metadata**: Extracted from files using Sharp (dimensions, file size, etc.)
4. **No Database**: Everything is file-system based for simplicity

## API Endpoints

### Images

- `GET /api/images` - Get all images with pagination and search
  - Query parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 20)
    - `search`: Search term for filename or title

- `GET /api/images/:id` - Get single image by ID

- `POST /api/images/upload` - Upload new image
  - Form data:
    - `image`: Image file (required)
    - `title`: Image title (optional)
    - `description`: Image description (optional)
    - `tags`: Comma-separated tags (optional)

- `DELETE /api/images/:id` - Delete image

### Health Check

- `GET /api/health` - Server health check

## File Structure

```
backend/
├── routes/
│   └── images.js        # Image routes & file scanning logic
├── uploads/             # Where all images are stored
│   ├── image1.jpg      # Original images
│   ├── thumb_image1.jpg # Auto-generated thumbnails
│   └── ...
├── server.js           # Main server file
├── package.json
└── README.md
```

## Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `BASE_URL`: Base URL for image URLs (default: http://localhost:3001)
- `FRONTEND_URL`: Frontend URL for CORS

## Adding Images

Simply copy your images to the `backend/uploads/` folder and they'll automatically appear in the gallery! The server will:

1. Scan the folder on each API request
2. Generate thumbnails if they don't exist
3. Extract metadata (dimensions, file size, etc.)
4. Serve them through the API

## Security Features

- Helmet for security headers
- Rate limiting for API endpoints
- File type validation
- File size limits (10MB)
- CORS configuration

## Image Processing

- Automatic thumbnail generation using Sharp
- Image compression and optimization
- Metadata extraction
- Support for JPEG, PNG, GIF, and WebP formats
