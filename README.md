# Banking Application

A modern online banking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (login, signup, password recovery)
- Account management
- Transaction processing
- Admin dashboard
- Onboarding flow for new users
- Responsive design
- PWA support

## Recent Updates

### Routing Changes (2025-05-06)
- Root route ('/') now redirects to '/onboarding'
- Middleware handles authentication and redirects
- Simplified routing logic in AppRoot component
- Maintained all existing security checks

## Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Routing**: Next.js App Router
- **Build Tools**: Vite, PostCSS

## Project Structure

```
app/
  ├── onboarding/      # Onboarding flow
  ├── admin/           # Admin dashboard
  ├── login/           # Authentication
  ├── signup/          # User registration
  ├── home/            # Main banking interface
  └── ...              # Other feature modules

components/
  ├── ui/              # UI components
  ├── context/         # State management
  ├── layout/          # App layout
  └── preloaders/      # Data loading

lib/
  ├── config/          # Configuration
  ├── data/            # Mock data
  ├── hooks/           # Custom hooks
  └── utils/           # Utility functions
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Development Notes

- Uses Next.js middleware for authentication
- Implements PWA capabilities
- Includes extensive preloading system
- Follows component-based architecture
- Uses Tailwind for responsive styling

## Routing Behavior

- Unauthenticated users: Redirected to onboarding
- Authenticated users: Redirected to appropriate dashboard
- Admin users: Access to admin interface
- New users: Guided through onboarding flow
