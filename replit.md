# Code Vista AI - Website Builder Platform

## Overview

Code Vista AI is a comprehensive website builder platform designed as "The Canva for Websites." The application enables users to create professional websites through an intuitive drag-and-drop interface powered by AI-generated content. The platform features a three-panel design with template selection, visual editing, and property customization capabilities.

The system aims to transform business ideas into fully functional websites within minutes, targeting both WordPress and React-based website creation. The platform emphasizes user-friendly design with AI-powered content generation, template libraries, and real-time preview functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and developer experience
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for predictable state management across components
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent design
- **Styling**: PostCSS with Tailwind for utility-first CSS architecture
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Server Framework**: Express.js with TypeScript for RESTful API development
- **Development Tool**: tsx for TypeScript execution in development
- **Middleware**: Custom logging and error handling middleware
- **API Design**: RESTful endpoints for templates, projects, AI content generation, and export functionality

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless for scalable cloud database hosting
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Connection**: WebSocket-enabled connection pooling for optimal performance

### AI Integration
- **Content Generation**: OpenAI GPT-5 API for generating headlines, descriptions, services, and call-to-action content
- **Image Generation**: Stable Diffusion integration for custom visual content
- **Color Schemes**: AI-powered color palette generation based on business context
- **SEO Optimization**: Automated meta tag and keyword suggestion generation

### Component Architecture
- **Builder Interface**: Three-panel layout (Template Library, Central Canvas, Property Panel)
- **Real-time Preview**: Live website preview with device responsiveness simulation
- **Drag-and-Drop**: Interactive section management with overlay controls
- **Template System**: Categorized template library with search and filtering capabilities

### Storage Strategy
- **In-Memory Storage**: Development-focused memory storage implementation
- **Database Schema**: Structured tables for users, templates, projects, AI content, and components
- **File Management**: Export functionality for downloadable website packages

### Authentication & Authorization
- **Session Management**: Express session handling with PostgreSQL session store
- **User System**: User profiles with project ownership and access control
- **Mock Authentication**: Development-ready mock user system for testing

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting for production database needs
- **OpenAI API**: GPT-5 integration for AI-powered content generation
- **Vercel/AWS**: Potential deployment platforms for global edge distribution

### Development Tools
- **Replit Integration**: Development environment optimization with cartographer and runtime error handling
- **Font APIs**: Google Fonts integration for typography options
- **Image Services**: Unsplash API integration for stock photography

### UI Libraries
- **Radix UI**: Comprehensive component primitives for accessible interface elements
- **Lucide Icons**: Modern icon system for consistent visual elements
- **React Hook Form**: Form handling with validation and user experience optimization
- **TanStack Query**: Server state management and caching for API interactions

### Build & Development
- **ESBuild**: Fast bundling for production server builds
- **TypeScript**: Static typing across the entire application stack
- **Tailwind CSS**: Utility-first styling with design system integration
- **PostCSS**: CSS processing and optimization pipeline