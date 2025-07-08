# Photo Gallery Application

A modern, responsive photo gallery application built with React and Node.js that allows users to view, search, and store their images with a beautiful UI.

## Features

### Frontend
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Dark/Light Mode**: Toggle between themes
- **Image Search**: Search through images by title, description, or tags
- **Infinite Scroll**: Load more images as you scroll
- **Image Upload**: Drag & drop or click to upload multiple images
- **Image Modal**: Full-screen image viewer with zoom and rotation
- **Grid/List View**: Switch between different viewing modes

### Backend
- **RESTful API**: Clean API endpoints for image management
- **Image Processing**: Automatic thumbnail generation and optimization
- **Database Support**: MongoDB with in-memory fallback
- **File Upload**: Secure file upload with validation
- **Search & Pagination**: Efficient image search and pagination
- **Rate Limiting**: Protection against abuse

## Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- Radix UI
- React Query (TanStack Query)
- React Router DOM
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Multer (File uploads)
- Sharp (Image processing)
- Helmet (Security)
- CORS

## Project Structure

```
photo-gallery/
├── src/                          # Frontend source
│   ├── components/              # React components
│   │   ├── ui/                 # UI components
│   │   ├── ImageGrid.jsx       # Image grid component
│   │   ├── ImageUpload.jsx     # Upload component
│   │   ├── ImageModal.jsx      # Modal component
│   │   └── Layout.jsx          # Layout component
│   ├── pages/                  # Page components
│   │   └── Gallery.jsx         # Main gallery page
│   ├── lib/                    # Utility functions
│   │   └── utils.js           # Helper functions
│   ├── App.js                  # Main app component
│   └── main.jsx               # Entry point
├── backend/                     # Backend API
│   ├── config/                 # Configuration
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── uploads/                # Uploaded images
│   └── server.js              # Express server
├── public/                     # Static assets
└── package.json               # Dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (optional - falls back to in-memory storage)

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup
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

4. Configure your `.env` file:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/photo-gallery
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:3001`

## API Endpoints

### Images
- `GET /api/images` - Get all images with pagination and search
- `GET /api/images/:id` - Get single image by ID
- `POST /api/images/upload` - Upload new image
- `PUT /api/images/:id` - Update image metadata
- `DELETE /api/images/:id` - Delete image

### Health Check
- `GET /api/health` - Server health check

## Usage

1. **Upload Images**: Click the "Upload" button to add new images
2. **Search**: Use the search bar to find images by title, description, or tags
3. **View Modes**: Toggle between grid and list view
4. **Image Details**: Click on any image to view it in full screen
5. **Download/Share**: Use the action buttons to download or share images

## Features in Detail

### Image Upload
- Drag & drop support
- Multiple file selection
- Image preview before upload
- Title and description editing
- Progress tracking
- File size and type validation

### Search & Filter
- Real-time search as you type
- Search by title, description, and tags
- Debounced search for performance
- Search result highlighting

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

### Performance
- Lazy loading for images
- Thumbnail generation
- Infinite scroll pagination
- Image optimization
- Efficient caching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

### Frontend
The frontend can be deployed to any static hosting service like Vercel, Netlify, or AWS S3.

### Backend
The backend can be deployed to services like Railway, Heroku, or AWS EC2.

### Environment Variables
Make sure to set appropriate environment variables for production:
- `NODE_ENV=production`
- `MONGODB_URI` - Your production MongoDB connection string
- `FRONTEND_URL` - Your production frontend URL

## Support

For support, please open an issue in the GitHub repository.
