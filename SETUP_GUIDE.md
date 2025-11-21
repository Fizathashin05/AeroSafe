# AeroSafe Setup Guide

This guide will help you set up the AeroSafe project on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **.NET 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
2. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
3. **MySQL Server** - [Download here](https://dev.mysql.com/downloads/mysql/)
4. **Git** - [Download here](https://git-scm.com/downloads)

---

## Step 1: Clone the Repository

If you haven't already cloned the repository:

```bash
git clone <repository-url>
cd AeroSafe
```

If you already have it cloned, pull the latest changes:

```bash
git pull origin main
```

---

## Step 2: Database Setup

### 2.1 Install and Start MySQL

1. Install MySQL Server if you haven't already
2. Start MySQL service
3. Note down your MySQL root password (or create a new user)

### 2.2 Create the Database

1. Open MySQL Command Line Client or MySQL Workbench
2. Run the SQL script to create the database and tables:

```bash
# Option 1: Using MySQL Command Line
mysql -u root -p < backend/AeroSafeBackend/Database/aerosafe_schema.sql

# Option 2: Using MySQL Workbench
# Open MySQL Workbench → File → Open SQL Script
# Select: backend/AeroSafeBackend/Database/aerosafe_schema.sql
# Click "Execute"
```

Or manually run:

```sql
CREATE DATABASE IF NOT EXISTS aerosafe;
USE aerosafe;

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    admin_uid VARCHAR(60) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_uid (admin_uid),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pilots Table
CREATE TABLE IF NOT EXISTS pilots (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    pilot_uid VARCHAR(60) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,
    fatigue_flag TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pilot_uid (pilot_uid),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.3 Verify Database Creation

```sql
USE aerosafe;
SHOW TABLES;
```

You should see `admins` and `pilots` tables.

---

## Step 3: Backend Setup

### 3.1 Navigate to Backend Directory

```bash
cd backend/AeroSafeBackend
```

### 3.2 Restore Dependencies

```bash
dotnet restore
```

### 3.3 Configure Database Connection

You have two options:

#### Option A: Using User Secrets (Recommended for Development)

```bash
# Initialize user secrets
dotnet user-secrets init

# Set your MySQL connection string
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=aerosafe;User=root;Password=YOUR_PASSWORD;Port=3306;"

# Set JWT secret key (use a strong random key)
dotnet user-secrets set "Jwt:Key" "YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong!"
```

**Replace `YOUR_PASSWORD` with your actual MySQL root password.**

#### Option B: Using appsettings.json (Quick Setup)

1. Open `appsettings.json`
2. Update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=aerosafe;User=root;Password=YOUR_PASSWORD;Port=3306;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong!",
    "Issuer": "AeroSafe",
    "Audience": "AeroSafe",
    "ExpiryMinutes": "1440"
  }
}
```

**⚠️ Warning:** Don't commit `appsettings.json` with real passwords to Git!

### 3.4 Build and Run Backend

```bash
# Build the project
dotnet build

# Run the backend
dotnet run
```

The backend should start on `http://localhost:5121`

You can verify it's working by visiting:
- `http://localhost:5121/swagger/index.html` - Swagger UI
- `http://localhost:5121/` - Should redirect to Swagger

---

## Step 4: Frontend Setup

### 4.1 Navigate to Frontend Directory

Open a new terminal window:

```bash
cd frontend/aerosafe-frontend
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Verify API Configuration

Check that `src/services/api.js` has the correct backend URL:

```javascript
const API_BASE_URL = 'http://localhost:5121/api';
```

If your backend runs on a different port, update this.

### 4.4 Run Frontend

```bash
npm run dev
```

The frontend should start on `http://localhost:5173`

---

## Step 5: Test the Application

1. **Open Browser**: Go to `http://localhost:5173`

2. **Test Admin Signup**:
   - Click "Create Admin Account"
   - Fill in the form:
     - Name: `John Admin` (letters only)
     - Email: `admin@aerosafe.com`
     - Admin ID: `AS-ADM-001` (letters, numbers, dashes)
     - Password: `Admin123!` (must include uppercase, lowercase, number, special char, 8+ chars)
   - Click "Signup"
   - You should be redirected to verification page

3. **Test Login**:
   - Click "Login" on landing page
   - Select "Admin Login"
   - Enter your credentials
   - Click "Login"

4. **Verify in Database**:
   ```sql
   USE aerosafe;
   SELECT * FROM admins;
   SELECT * FROM pilots;
   ```

---

## Troubleshooting

### Backend Issues

**Error: "JWT Key not configured"**
- Make sure you've set the JWT key in user secrets or appsettings.json

**Error: "Connection string error"**
- Verify MySQL is running
- Check your MySQL password is correct
- Ensure database `aerosafe` exists
- Check port 3306 is correct (default MySQL port)

**Error: "Cannot connect to MySQL"**
- Start MySQL service
- Check firewall settings
- Verify MySQL is listening on port 3306

### Frontend Issues

**Error: "Failed to fetch" or "Network error"**
- Ensure backend is running on `http://localhost:5121`
- Check CORS settings in backend `Program.cs`
- Verify API_BASE_URL in `src/services/api.js`

**Error: "404 on API calls"**
- Check backend is running
- Verify backend port matches frontend API URL
- Check browser console for exact error

### Database Issues

**Error: "Table doesn't exist"**
- Run the SQL schema script again
- Verify you're using the correct database: `USE aerosafe;`

**Error: "Access denied for user"**
- Check MySQL username and password
- Verify user has permissions to access `aerosafe` database

---

## Common Configuration Values

### MySQL Connection String Format

```
Server=localhost;Database=aerosafe;User=root;Password=YOUR_PASSWORD;Port=3306;
```

### JWT Configuration

- **Key**: Must be at least 32 characters long
- **Issuer**: "AeroSafe"
- **Audience**: "AeroSafe"
- **ExpiryMinutes**: 1440 (24 hours)

### Ports

- **Backend**: `http://localhost:5121`
- **Frontend**: `http://localhost:5173`
- **MySQL**: `3306` (default)

---

## Quick Start Checklist

- [ ] MySQL installed and running
- [ ] Database `aerosafe` created
- [ ] Tables `admins` and `pilots` created
- [ ] Backend dependencies restored (`dotnet restore`)
- [ ] Database connection configured (user secrets or appsettings.json)
- [ ] JWT key configured
- [ ] Backend running on port 5121
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend running on port 5173
- [ ] Tested signup and login

---

## Next Steps

Once setup is complete:
1. Test authentication flow
2. Create test accounts (Admin and Pilot)
3. Verify JWT tokens are working
4. Check database records are being created

For detailed authentication testing, see `AUTHENTICATION_TESTING_GUIDE.md`

---

## Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check backend and frontend console logs
4. Verify database connection
5. Contact the team lead

