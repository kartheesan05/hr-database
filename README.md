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
  - Jose for JWT authentication
  - Zod for schema validation

- **Development Tools:**
  - TypeScript
  - PostCSS
  - Various development utilities

## 🛠️ Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL database
- npm package manager

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kartheesan05/hr-database
   cd hr-database
   ```

2. Install dependencies:
   ```bash
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


## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
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

