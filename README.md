# Symptra Health Frontend

## Overview

This is the frontend application for the Symptra Health Admin Panel, built with React, TypeScript, and Tailwind CSS. It provides a user-friendly interface for managing health-related products and content.

## Features

- User Authentication (Register/Login)
- Product Management Dashboard
- Article/Blog Management Interface
- Approval Workflow for Content
- Admin Dashboard with Request Handling
- Role-Based Access Control

## Tech Stack

- React 18
- TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- shadcn/ui (UI Components)
- React Router (Navigation)
- Supabase (Database/Authentication)
- TanStack Query (Data Fetching)

## Prerequisites

- Node.js (v18 or higher)
- npm or bun

## Setup Instructions

1. Clone the repository
2. Navigate to the frontend folder
3. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```
4. Copy `.env.example` to `.env` and update the environment variables
5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## Environment Variables

You'll need to set up the following environment variables in your `.env` file:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_API_BASE_URL` - Base URL for the backend API

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── assets/         # Static assets (images, icons)
```

## API Integration

The frontend communicates with the Symptra Health Backend API for all data operations. Make sure the backend server is running before using the frontend application.

## Deployment

This application can be deployed to platforms like Vercel, Netlify, or any hosting service that supports static site deployment.