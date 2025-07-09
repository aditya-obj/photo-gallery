# Photo Gallery Application

A modern, responsive photo gallery application built with React frontend and Node.js backend.

![Photo Gallery Demo](https://photo-gallery-one.vercel.app)

## 🌐 Live Demo

- **Frontend**: https://photo-gallery-one.vercel.app
- **Backend API**: https://photo-gallery-o7kd.onrender.com

## ✨ Features

- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark/Light Mode** - Theme toggle
- 🔍 **Search Functionality** - Search images by title, filename
- ♾️ **Infinite Scroll** - Automatic pagination
- 🖼️ **Image Modal** - Full-screen image viewer with zoom
- 📤 **File System Storage** - No database required
- 🚀 **Modern UI** - Built with Tailwind CSS and Radix UI

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Radix UI
- TanStack Query
- React Router DOM
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- Sharp (Image processing)
- Multer (File uploads)
- File system storage

## 📁 Project Structure

```
photo-gallery/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility functions
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Node.js backend API
│   ├── routes/             # API routes
│   ├── uploads/            # Image storage
│   ├── package.json
│   └── server.js
└── README.md
```

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables:**
```env
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3002
```

5. **Start the backend server:**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Backend will be available at: `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file (optional):**
```bash
# For local development, API will use localhost:3001
# For production, set VITE_API_URL=https://your-backend-url.com/api
```

4. **Start the frontend development server:**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3002`

## 🌐 Production Deployment

### Backend Deployment (Render)

1. **Connect your GitHub repository to Render**

2. **Configure build settings:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

3. **Set environment variables:**
```env
NODE_ENV=production
BASE_URL=https://your-app-name.onrender.com
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=3001
```

4. **Deploy and get your backend URL**

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository to Vercel**

2. **Configure build settings:**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: `frontend`

3. **Set environment variables:**
```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

4. **Deploy and get your frontend URL**

## 🔧 API Endpoints

### Images
- `GET /api/images` - Get all images with pagination and search
  - Query parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 20)
    - `search`: Search term

- `GET /api/images/:id` - Get single image by ID
- `POST /api/images/upload` - Upload new image
- `DELETE /api/images/:id` - Delete image

### Health Check
- `GET /api/health` - Server health check

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure backend CORS is configured with your frontend URL
   - Check environment variables are set correctly

2. **Images not loading:**
   - Verify backend is running and accessible
   - Check API_BASE_URL in frontend configuration
   - Ensure backend has images in `/uploads` folder

3. **Backend not responding:**
   - Check Render logs for errors
   - Verify environment variables are set
   - Free tier services may sleep after inactivity

4. **Build failures:**
   - Ensure all dependencies are in package.json
   - Check Node.js version compatibility
   - Clear node_modules and reinstall if needed

### Testing the API

Test backend health:
```bash
curl https://your-backend-url.onrender.com/api/health
```

Test images endpoint:
```bash
curl https://your-backend-url.onrender.com/api/images
```

## 📝 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

### Backend
```bash
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production server
npm test            # Run tests (if configured)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Live Demo](https://photo-gallery-one.vercel.app)
- [Backend API](https://photo-gallery-o7kd.onrender.com)
- [GitHub Repository](https://github.com/your-username/photo-gallery)

## 📞 Support

For support or questions, please open an issue on GitHub.
