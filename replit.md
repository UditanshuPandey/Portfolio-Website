# Uditanshu Pandey Portfolio Website

## Overview

This is a personal portfolio website for Uditanshu Pandey, a PhD Scholar at IIT Kanpur specializing in AI/ML, NLP, and Generative AI. The application is built as a full-stack web application with a React frontend and Express backend, featuring a modern design with responsive layout and interactive components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI components with shadcn/ui styling system
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Style**: REST API with JSON responses
- **Request Handling**: Express middleware for JSON parsing and logging
- **Error Handling**: Centralized error handling middleware

## Key Components

### Frontend Components
- **Navigation**: Responsive navigation with smooth scrolling and active section highlighting
- **Hero Section**: Eye-catching landing area with personal branding
- **About Section**: Personal introduction with skills and achievements
- **Experience Section**: Timeline-based work experience display
- **Projects Section**: Showcase of featured projects with technology badges
- **Skills Section**: Interactive skill categories with progress indicators
- **Education Section**: Academic background and certifications
- **Contact Section**: Contact form with validation and submission handling
- **Theme System**: Light/dark mode toggle with persistent preferences

### Backend Components
- **Contact API**: Handles form submissions with Zod validation
- **Logging Middleware**: Request/response logging for API endpoints
- **Development Server**: Vite integration for hot module replacement
- **Static File Serving**: Production-ready static asset serving

## Data Flow

1. **Client-Side Rendering**: React components render the portfolio sections
2. **Form Submission**: Contact form data is validated client-side with Zod
3. **API Request**: Validated data is sent to `/api/contact` endpoint
4. **Server Processing**: Express server validates and logs the contact form data
5. **Response Handling**: Success/error responses are displayed to the user via toast notifications

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form, React Query
- **UI Framework**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Backend**: Express.js, Node.js built-in modules
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full TypeScript support across frontend and backend
- **Database Setup**: Drizzle ORM configured for PostgreSQL (currently using in-memory storage)
- **Development Tools**: TSX for TypeScript execution, various Vite plugins

### Database Integration
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: User schema defined in shared directory
- **Current State**: In-memory storage implementation for user data
- **Migration**: Drizzle Kit for database migrations

## Deployment Strategy

### Development
- **Dev Server**: Vite development server with HMR
- **Backend**: TSX for running TypeScript directly
- **Database**: In-memory storage for development
- **Environment**: NODE_ENV=development

### Production
- **Build Process**: 
  1. Frontend: Vite builds React app to `dist/public`
  2. Backend: esbuild bundles server code to `dist/index.js`
- **Serving**: Express serves static files from build directory
- **Database**: PostgreSQL with Neon Database serverless connection
- **Environment**: NODE_ENV=production

### File Structure
- `client/`: React frontend application
- `server/`: Express backend application
- `shared/`: Shared TypeScript definitions and schemas
- `migrations/`: Database migration files
- `dist/`: Production build output

The application is designed to be scalable and maintainable, with clear separation of concerns between frontend and backend, type safety throughout, and a modern development experience.