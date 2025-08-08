# NightRider - NSW Bus Tracker

## Overview

NightRider is a real-time bus tracking application specifically designed for NSW night shift workers operating between 1-4 AM. The app provides live bus locations, arrival times, and route information for night services across New South Wales. Built with a modern full-stack architecture, it features a React frontend with interactive maps, a Node.js/Express backend, and PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with React and TypeScript, utilizing a component-based architecture with the following key design decisions:

- **React with Vite**: Chosen for fast development builds and hot module replacement
- **Wouter Router**: Lightweight routing solution instead of React Router for minimal bundle size
- **TanStack Query**: Handles server state management, caching, and real-time data synchronization
- **Shadcn/ui Components**: Provides a consistent design system with Tailwind CSS styling
- **Leaflet Maps**: Interactive mapping for real-time vehicle tracking and stop locations
- **Dark Theme Design**: Night-optimized UI with NSW transport branding colors

### Backend Architecture
The server follows a RESTful API pattern with Express.js:

- **Express.js Framework**: Handles HTTP requests and API routing
- **TypeScript**: Provides type safety across the entire backend
- **Middleware Pattern**: Request logging, error handling, and JSON parsing
- **Storage Abstraction**: Interface-based storage layer for database operations
- **Development Integration**: Vite middleware for seamless development experience

### Data Layer
Database architecture using PostgreSQL with Drizzle ORM:

- **PostgreSQL Database**: Stores bus stops, routes, vehicle positions, trip updates, and user data
- **Drizzle ORM**: Type-safe database operations with schema validation
- **Schema Design**: Normalized tables for stops, routes, vehicles, trips, alerts, and user preferences
- **Real-time Updates**: Optimized for frequent vehicle position and trip update insertions
- **Geospatial Support**: Latitude/longitude coordinates for proximity searches

### State Management
- **Client State**: React hooks and local component state for UI interactions
- **Server State**: TanStack Query for API data caching and synchronization
- **Real-time Updates**: Polling-based updates every 30 seconds for live vehicle positions
- **Background Refresh**: Automatic data refresh when app becomes visible

### User Experience Features
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Bottom Navigation**: Tab-based navigation for easy thumb access
- **Location Services**: GPS integration for nearby stop discovery
- **Favorites System**: User can save frequently used stops and routes
- **Search Functionality**: Real-time search across stops, routes, and destinations
- **Night Mode Focus**: Filters to show only night services during 1-4 AM hours
- **Real-time ETA Display**: Live arrival times for bus stops with expandable list views
- **Delay Indicators**: Visual alerts for delayed services with delay duration

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migrations and schema management

### Frontend Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Leaflet**: Open-source mapping library for interactive maps
- **React Hook Form**: Form validation and management
- **Date-fns**: Date manipulation and formatting utilities
- **Tailwind CSS**: Utility-first CSS framework for styling

### Development Tools
- **Vite**: Build tool with fast HMR and optimized production builds
- **ESBuild**: Fast JavaScript bundler for server-side code
- **TypeScript**: Static type checking across the entire codebase
- **Replit Integration**: Development environment with runtime error handling

### Transport Data Integration
- **NSW Transport API**: Real-time GTFS data feeds for vehicle positions and trip updates
- **GTFS Static Data**: Bus stop locations, route information, and schedule data
- **Real-time Feeds**: Vehicle positions, trip updates, and service alerts

### Third-Party Services
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Inter font family for consistent typography
- **CDN Resources**: External CSS and JavaScript libraries for maps and icons