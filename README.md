# Social App - React TypeScript Application

A modern, scalable React application built with TypeScript, featuring posts management, comment moderation, and user authentication.

## 🚀 Features

- **Authentication System**: Secure login/logout with protected routes
- **Posts Management**: Create, read, update, and delete posts
- **Comment Moderation**: Approve, reject, or manage comments
- **Infinite Scroll**: Efficient data loading with intersection observer
- **Search Functionality**: Real-time search with debouncing
- **Responsive Design**: Mobile-first approach with Ant Design
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance Optimized**: Code splitting, lazy loading, and memoization

## 🛠️ Tech Stack

- **React 19** - Latest React features
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **React Router v7** - Modern routing solution
- **Ant Design** - Professional UI component library
- **Axios** - HTTP client with interceptors
- **Context API** - State management

## 📁 Project Structure

```
src/
├── components/         # Reusable components
│   ├── common/         # UI components (Button, Card, etc.)
│   └── models/         # Modal components
├── APIs/               # API services
├── pages/              # Pages components
├── hooks/              # Custom React hooks
├── context/            # Context providers
├── config/             # App Configs and Routes
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd social
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Login Credentials

```
Email: testuser@logicwind.com
Password: Test123!
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Architecture Highlights

### 1. Scalable Folder Structure
Organized by feature and responsibility for easy maintenance and scalability.

### 2. Custom Hooks
- `useComments` - use for commets implementation
- `usePosts` - use for posts implementation

### 3. Service Layer
Centralized API calls with interceptors for authentication and error handling.

### 4. Reusable Components
- Common UI components (LoadingSpinner)
- Layout components with navigation and logo

### 5. Performance Optimizations
- Lazy loading of routes
- Code splitting
- Memoization with useMemo and useCallback
- Debounced search
- Infinite scroll for efficient data loading

### 6. Error Handling
- Error Boundary component
- API interceptors for global error handling
- User-friendly error messages

## 🎨 UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Loading States**: Clear feedback during operations
- **Empty States**: Meaningful messages when no data
- **Toast Notifications**: User feedback for actions

## 🔐 Security

- Protected routes with authentication
- Token-based authentication
- Automatic token injection in API calls
- Automatic logout on 401 responses and if token not found

## 📊 State Management

### Authentication Context
- User information
- Login/logout functionality
- Token management

### Posts Context
- Posts CRUD operations
- Comments management
- Search and pagination
- Loading states

## 🎯 Key Pages

1. **Posts** - Manage posts with infinite scroll , Search and CRUD operations
2. **Comments** - Moderate comments with approval and rejection
2. **Login** - Authentication page

## 🔄 API Integration

Uses JSONPlaceholder API for demo purposes:
- Posts: `/posts`
- Comments: `/comments`

## 🚀 Deployment

Build the application:
```bash
npm run build
```

---

Built using React, TypeScript and Ant Design