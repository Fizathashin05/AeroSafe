# Quick Setup for Teammates

## 🚀 Fast Setup (5 minutes)

### 1. Database Setup
```bash
# Run this in MySQL
mysql -u root -p < backend/AeroSafeBackend/Database/aerosafe_schema.sql
```

### 2. Backend Setup
```bash
cd backend/AeroSafeBackend

# Restore packages
dotnet restore

# Set your MySQL password (replace YOUR_PASSWORD)
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=aerosafe;User=root;Password=YOUR_PASSWORD;Port=3306;"
dotnet user-secrets set "Jwt:Key" "YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong!"

# Run backend
dotnet run
```

### 3. Frontend Setup
```bash
cd frontend/aerosafe-frontend

# Install packages
npm install

# Run frontend
npm run dev
```

### 4. Test
- Open: http://localhost:5173
- Signup as Admin or Pilot
- Login and verify it works!

---

## ⚠️ Important Notes

1. **MySQL Password**: Replace `YOUR_PASSWORD` with your actual MySQL root password
2. **JWT Key**: Use a strong random key (at least 32 characters)
3. **Ports**: Backend (5121), Frontend (5173), MySQL (3306)

---

## 🔧 Alternative: Use appsettings.json

If you prefer not to use user secrets, edit `backend/AeroSafeBackend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=aerosafe;User=root;Password=YOUR_PASSWORD;Port=3306;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong!"
  }
}
```

**⚠️ Don't commit this file with real passwords!**

---

## 📚 Full Guide

See `SETUP_GUIDE.md` for detailed instructions and troubleshooting.

