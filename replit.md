# Hive Witness Directory

## Overview

This is a full-stack web application for viewing and interacting with Hive blockchain witnesses. The application provides a comprehensive witness directory, network statistics, and direct integration with Hive Keychain for voting functionality. It's built with a modern React frontend, Express.js backend, and uses Hive blockchain APIs for real-time data.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components for a professional design system
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Context**: React Context API for theme, language, and Keychain authentication

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (configured but using in-memory storage currently)
- **API Integration**: Direct integration with Hive blockchain APIs
- **Session Management**: PostgreSQL session store configured (connect-pg-simple)

### Database Schema
- **Users Table**: Basic user authentication schema with username/password fields
- **Schema Location**: `shared/schema.ts` using Drizzle ORM
- **Current Implementation**: In-memory storage for development (MemStorage class)

## Key Components

### Witness Management
- Real-time witness data fetching from Hive blockchain
- Witness ranking, voting power, and performance metrics
- Individual witness profiles with detailed information
- Current block producer tracking with live updates

### Authentication System
- Hive Keychain integration for secure blockchain authentication
- Development mode fallback for testing without Keychain
- Persistent user sessions with localStorage backup
- Context-based authentication state management

### User Interface
- Responsive design optimized for mobile and desktop
- Dark/light theme support with system preference detection
- Bilingual support (English/Spanish) with browser language detection
- Professional shadcn/ui component library with custom theming

### Network Monitoring
- Live Hive blockchain statistics (block height, transactions, witnesses)
- Node health monitoring and API endpoint selection
- Real-time block producer updates

## Data Flow

1. **Initial Load**: Application fetches witness data and network stats from Hive APIs
2. **Authentication**: Users authenticate via Hive Keychain browser extension
3. **Data Updates**: Real-time polling for current block producer and network stats
4. **Vote Transactions**: Keychain integration for secure witness voting
5. **State Management**: TanStack Query handles caching and background updates

## External Dependencies

### Blockchain Integration
- **Hive APIs**: Multiple endpoints for redundancy (api.hive.blog, beacon.peakd.com)
- **Hive Keychain**: Browser extension for authentication and transaction signing
- **Neon Database**: PostgreSQL provider for production database

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **Material Symbols**: Google's icon font for additional icons

### Development Tools
- **Vite**: Build tool with HMR and development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Type safety and enhanced developer experience

## Deployment Strategy

### Development Environment
- **Runtime**: Replit with Node.js 20
- **Database**: PostgreSQL 16 with automatic provisioning
- **Hot Reload**: Vite development server with automatic restarts
- **Environment**: Development mode with additional debugging tools

### Production Build
- **Frontend**: Static assets built to `dist/public`
- **Backend**: Bundled Node.js application in `dist`
- **Deployment**: Autoscale deployment target on Replit
- **Static Serving**: Express serves built frontend assets

### Configuration
- **Environment Variables**: DATABASE_URL for PostgreSQL connection
- **Build Process**: `npm run build` creates production artifacts
- **Start Command**: `npm run start` for production deployment

## Changelog

- June 18, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.