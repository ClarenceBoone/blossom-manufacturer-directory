# Blossom - Manufacturer Directory

A modern web application that connects brand owners with manufacturers through AI-powered matching and seamless communication.

## Features

- **User Authentication**: Secure Firebase authentication with role-based access
- **Product Library**: Upload and manage products with cloud storage
- **Manufacturer Directory**: Browse and filter manufacturers with advanced search
- **AI-Powered Matching**: Intelligent manufacturer recommendations
- **Messaging System**: Real-time communication with manufacturers
- **Responsive Design**: Clean, modern UI built with Shadcn/UI components

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI Components**: Shadcn/UI with Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Automation**: n8n workflows (to be integrated)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd blossom
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain-here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket-here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id-here
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── login/          # Authentication pages
│   ├── signup/         
│   ├── manufacturers/  # Manufacturer directory
│   ├── products/       # Product library
│   ├── messages/       # Messaging system
│   └── pricing/        # Pricing page
├── components/         # Reusable UI components
│   └── ui/            # Shadcn/UI components
├── contexts/          # React contexts
├── lib/               # Utilities and configurations
└── types/             # TypeScript type definitions
```

## Key Components

### Authentication System
- Firebase Authentication with email/password
- Role-based access control (Brand Owner/Manufacturer)
- Protected routes and user context

### Product Library
- File upload to Firebase Storage
- Product categorization and metadata
- Grid layout with search and filtering

### Manufacturer Directory
- Advanced filtering (specialty, MOQ, location, lead time)
- Detailed manufacturer profiles
- Direct messaging integration

### Messaging System
- Real-time messaging interface
- File attachments support
- Thread-based conversations

## Next Steps

1. **Firebase Setup**: Configure your Firebase project with proper security rules
2. **n8n Integration**: Set up n8n workflows for AI features
3. **AI Features**: Implement semantic search and recommendation engine
4. **Testing**: Add comprehensive test coverage
5. **Deployment**: Deploy to Vercel or your preferred platform

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
