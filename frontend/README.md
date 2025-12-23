This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Configure environment variables in `.env.local`:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   
   # Runtime Mode
   # Set to "true" to use mock data instead of real API calls
   NEXT_PUBLIC_USE_MOCK=true
   ```

### Running the Application

**Development Mode:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Production Build:**
```bash
npm run build
npm start
```

## Development Modes

### Mock Mode (Default)

When `NEXT_PUBLIC_USE_MOCK=true`:
- All API calls return mock data
- No backend connection required
- Useful for UI development and testing
- Fast iteration without backend dependencies

### Real API Mode

When `NEXT_PUBLIC_USE_MOCK=false`:
- All API calls hit the real backend
- Requires backend server running at `NEXT_PUBLIC_API_BASE_URL`
- Full integration testing

**To switch modes:**
1. Update `NEXT_PUBLIC_USE_MOCK` in `.env.local`
2. Restart the dev server

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI components (to be reorganized)
├── features/         # Feature-based modules
│   ├── auth/        # Authentication
│   ├── courses/      # Course management
│   ├── instructor/   # Instructor features
│   └── ...
├── services/         # API services
│   └── core/        # Core API client (axios)
├── hooks/           # Custom React hooks
├── store/           # Global state (Zustand)
├── config/          # Configuration
└── lib/             # Utilities
```

## Backend Integration

### Connecting to Backend

1. Ensure backend is running (default: `http://localhost:8080`)
2. Set `NEXT_PUBLIC_USE_MOCK=false` in `.env.local`
3. Restart the frontend dev server

### API Client Features

- **Automatic token management**: Access tokens stored in localStorage
- **Token refresh**: Automatic refresh on 401 errors
- **Error handling**: Standardized error classes
- **Request interceptors**: Automatic Authorization header injection
- **Response interceptors**: Token refresh and error normalization

### Refresh Token Endpoint

The refresh endpoint is configured in `src/services/core/auth-refresh.ts`:
- Default: `/api/v1/auth/refresh-token`
- To change: Update `REFRESH_ENDPOINT` constant

## Key Features

- ✅ Axios-based API client with interceptors
- ✅ Automatic token refresh on 401
- ✅ Mock/Real API toggle via environment variable
- ✅ Feature-based service organization
- ✅ Type-safe API calls
- ✅ Clean separation of types and mocks

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
