# MERN Blog Platform Frontend

A modern, responsive TypeScript React frontend for a MERN blog platform with role-based authentication and comprehensive blog management features.

## Features

### 🔐 Authentication
- JWT-based authentication with role-based routing
- Login/Signup with form validation
- Automatic redirection based on user role (admin/user)
- Secure token storage and management

### 📝 Blog Management
- **User Features:**
  - Browse paginated blog feed with search functionality
  - Like and comment on blogs
  - Share blogs via URL copying
  - Responsive blog cards with media support
  
- **Admin Features:**
  - Create, edit, and delete blogs
  - Manage all users (view, change roles, delete)
  - Upload media via Cloudinary integration
  - Complete CRUD operations for blog management

### 🎨 UI/UX
- Modern, clean design with Tailwind CSS
- Responsive layout for mobile, tablet, and desktop
- Smooth animations and hover effects
- Loading states and error handling
- Intuitive navigation and user feedback

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Build Tool:** Vite

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend documentation)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd mern-blog-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BlogItem.tsx    # Individual blog post component
│   ├── BlogList.tsx    # List of blog posts
│   ├── Navbar.tsx      # Navigation component
│   ├── Pagination.tsx  # Pagination controls
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   └── SearchBar.tsx   # Search functionality
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── AdminDashboard.tsx # Admin management interface
│   ├── Home.tsx        # User blog feed
│   ├── Login.tsx       # Login page
│   └── Signup.tsx      # Registration page
├── api/                # API service layer
│   └── index.ts        # API calls and axios configuration
├── types/              # TypeScript type definitions
│   └── index.ts        # Interface definitions
├── utils/              # Utility functions and constants
│   └── constants.ts    # App constants
└── App.tsx             # Main application component
```

## API Integration

The frontend integrates with the following backend endpoints:

- **Authentication:** `/api/auth/login`, `/api/user/signup`
- **Blogs:** `/api/blog` (CRUD operations)
- **Interactions:** `/api/blog/:id/like`, `/api/blog/:id/comment`
- **Media:** `/api/cloudinary` (file uploads)
- **Admin:** `/api/admin/users` (user management)

## User Roles

### Regular User
- View and search blog posts
- Like and comment on blogs
- Share blog posts
- Access to personal blog feed

### Administrator
- All user permissions
- Create, edit, and delete any blog post
- Manage users (view, change roles, delete)
- Upload and manage media content
- Access to admin dashboard

## Features in Detail

### Authentication Flow
1. Users land on login/signup page if not authenticated
2. After successful authentication, users are redirected based on role
3. JWT tokens are stored securely and used for API requests
4. Automatic logout on token expiration

### Blog Management
- **Search & Filter:** Real-time search with pagination
- **Media Support:** Images, GIFs, and videos via Cloudinary
- **Social Features:** Likes, comments, and sharing
- **Content Management:** Rich text support and media embedding

### Admin Dashboard
- **User Management:** View all users, change roles, delete accounts
- **Content Moderation:** Edit or remove any blog post
- **Analytics:** User and content statistics
- **Media Management:** Upload and organize media files

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.