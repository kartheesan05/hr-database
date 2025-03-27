# HRDB - FORESE

HRDB is designed for the purposes of uploading collected contacts individually or with CSV. It is made for the FORESE members and the Core Team, providing a robust platform for managing HR calling details with a beautiful and user-friendly interface. With charts and graphs, it provides a better way to track the progress of the HR calling.

## 🚀 Tech Stack

- **Frontend:**
  - Next.js 15.1.0 (React 19)
  - TailwindCSS for styling
  - Radix UI components for accessible UI elements
  - Recharts for data visualization
  - Sonner for toast notifications

- **Backend:**
  - Next.js API routes
  - PostgreSQL database
  - Drizzle ORM for database operations
  - Jose for JWT authentication
  - Zod for schema validation

- **Development Tools:**
  - TypeScript
  - PostCSS
  - Drizzle Kit for database migrations
  - Various development utilities

## 🛠️ Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL database
- Yarn or npm package manager

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kartheesan05/hr-database
   cd hrdb
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Fill in the required environment variables in the `.env` file:
   - Database connection details
   - JWT secret
   - Other configuration variables

4. Set up the database:
   ```bash
   # Run database migrations
   yarn drizzle-kit push:pg
   # or
   npx drizzle-kit push:pg
   ```

## 🚀 Running the Application

### Development Mode
```bash
yarn dev
# or
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Mode
```bash
# Build the application
yarn build
# or
npm run build

# Start the production server
yarn start
# or
npm start
```
The application will be available at `http://localhost:5004`

## 🔑 Features

- Modern, responsive UI
- Secure authentication and authorization
- Employee data management
- Data visualization and reporting
- File upload capabilities
- Real-time updates and notifications
- Accessible UI components
- Database migration and management tools

## 📝 Scripts

- `yarn dev` - Start development server with Turbo
- `yarn build` - Build the application for production
- `yarn start` - Start production server
- `yarn lint` - Run linting checks


