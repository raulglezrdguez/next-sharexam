# Modern Full-Stack Next.js Application: next-sharexam

A robust, type-safe web application built with Next.js 16, featuring authentication, real-time data visualization, and a sophisticated state management system.

## Deployed at

[https://next-sharexam.vercel.app/](https://next-sharexam.vercel.app/)

## Features

- 🔐 **Secure Authentication** - JWT-based auth with Google OAuth integration and MongoDB session storage
- 🎨 **Modern UI** - Radix UI primitives + Tailwind CSS v4 with custom component system
- 📊 **Advanced State Management** - XState for complex state logic and TanStack Query for server state
- 🗄️ **Database** - MongoDB with Mongoose ODM for flexible data modeling
- 📈 **Interactive Visualizations** - React Flow for node-based diagrams and flowcharts
- 🧮 **Mathematical Processing** - Math.js for advanced calculations
- 🎯 **Type Safety** - Full TypeScript implementation with Zod schema validation
- 📱 **Responsive Design** - Mobile-first approach with resizable panels
- 🔧 **Developer Experience** - ESLint, React Query DevTools, and Hot Module Replacement

## Prerequisites

- Node.js 20.x or later
- MongoDB 6.x (local or Atlas)
- npm, yarn, or pnpm package manager

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/raulglezrdguez/next-sharexam.git
cd next-sharexam
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Setup environment variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/your-database-name
# or for MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/<database-name>

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-key-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: JWT configuration
JWT_SECRET=your-jwt-secret-key

```

## Running the application

Development mode

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

Production build

```bash
npm run build
npm start
```

### Key technologies

| Category          | Technology                  |
| ----------------- | --------------------------- |
| **Framework**     | Next.js 16 (React 19)       |
| **Language**      | TypeScript 5                |
| **Database**      | MongoDB 6.x + Mongoose 8.x  |
| **Auth**          | NextAuth.js 5 (Auth.js)     |
| **Styling**       | Tailwind CSS v4 + Radix UI  |
| **State Mgmt**    | XState 5 + TanStack Query 5 |
| **Validation**    | Zod 4                       |
| **Visualization** | React Flow 12               |
| **Theming**       | next-themes                 |

### Available scripts

- npm run dev - Start development server
- npm run build - Create production build
- npm start - Start production server
- npm run lint - Run ESLint
- npm run lint:fix - Fix ESLint issues

### Environment variables

| Variable               | Required | Description                |
| ---------------------- | -------- | -------------------------- |
| `MONGODB_URI`          | ✅       | MongoDB connection string  |
| `NEXTAUTH_URL`         | ✅       | Application URL            |
| `NEXTAUTH_SECRET`      | ✅       | Auth encryption secret     |
| `GOOGLE_CLIENT_ID`     | ✅       | Google OAuth client ID     |
| `GOOGLE_CLIENT_SECRET` | ✅       | Google OAuth client secret |
| `JWT_SECRET`           | ❌       | Optional custom JWT secret |

### Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

### License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the LICENSE file for details.

Built with ❤️ using modern web technologies
