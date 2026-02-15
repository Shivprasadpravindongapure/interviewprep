# EcoSense Interview Preparation Platform

A comprehensive interview preparation platform for students targeting dream companies.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Google OAuth credentials (optional for MVP)

### Installation

1. **Clone and setup**
```bash
cd interview-prep-platform
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
Create `.env` file in `backend/`:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/ecosense?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
ADMIN_EMAIL=admin@ecosense.com
ADMIN_PASSWORD=admin123
```

4. **Seed Database**
```bash
node seed.js
```

5. **Start Backend**
```bash
npm start
```

6. **Frontend Setup**
```bash
cd ../frontend
npm install
```

7. **Configure Frontend Environment**
Create `.env` file in `frontend/`:
```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

8. **Start Frontend**
```bash
npm start
```

## 📁 Project Structure

```
interview-prep-platform/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── config/          # Configuration files
│   ├── seed.js          # Database seeder
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript types
│   └── public/
└── README.md
```

## 🎯 Features

### Student Features
- **Authentication**: Google OAuth login
- **Dashboard**: Progress overview and daily tasks
- **Practice**: MCQs, Coding challenges, AI interviews
- **Progress Tracking**: Detailed analytics and weak areas
- **Resume Builder**: Auto-fill with verified skills
- **Profile Management**: Personal information and goals

### Admin Features
- **Admin Dashboard**: User statistics and platform metrics
- **Content Management**: Create and manage assessments
- **User Management**: View and manage student accounts
- **Reports**: Platform usage and performance analytics

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Google OAuth** for student login

### Frontend
- **React** + **TypeScript**
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

### Database
- **MongoDB** with 3 main collections:
  - `users`: User profiles and progress
  - `assessments`: Questions and tests
  - `submissions`: User answers and scores

## 📊 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/admin` - Admin login
- `GET /api/auth/me` - Get current user

### Assessments
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/:id` - Get specific assessment
- `POST /api/assessments/submit` - Submit assessment
- `GET /api/assessments/submissions/my` - Get user submissions

### Users
- `PUT /api/users/profile` - Update profile
- `GET /api/users/progress` - Get progress
- `PUT /api/users/goals` - Update goals

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/assessments` - Get all assessments
- `POST /api/admin/assessments` - Create assessment
- `GET /api/admin/reports` - Get reports

## 🎨 UI/UX Pages

### Student Pages
- Landing Page
- Login/Signup
- Dashboard
- MCQ Quiz Interface
- Coding Editor
- AI Interview
- Progress Analytics
- Profile & Settings
- Resume Builder

### Admin Pages
- Admin Login
- Admin Dashboard
- User Management
- Content Management
- Analytics & Reports

## 🔧 Development

### Running Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Building for Production
```bash
# Frontend
cd frontend && npm run build

# Backend (already optimized)
cd backend && npm start
```

## 📝 MVP Features (Week 1)

✅ **Core Features**
- Student login (Google OAuth)
- Dashboard with progress
- MCQ practice
- Basic progress tracking
- Admin panel

🚧 **Next Phase Features**
- Coding editor with Monaco
- Recording functionality
- AI interview system
- Resume builder
- Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.
