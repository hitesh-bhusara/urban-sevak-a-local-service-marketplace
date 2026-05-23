np# UrbanSevak - Local Service Marketplace

## Project Overview
UrbanSevak is a full-stack Node.js web application that connects customers with local service providers. It's a location-based service marketplace where users can book services like plumbers, electricians, doctors, tutors, and more. The platform includes a SuperAdmin panel for provider approval management.

**Tech Stack:** Node.js, Express.js, MongoDB (Mongoose), EJS Templates, JWT Authentication, Multer (file uploads), Nodemailer (emails)

---

## Project Structure

```
urbansevak-2/
├── app.js                    # Main application file (all routes & server logic)
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables (MongoDB URI, JWT secret, email credentials)
├── seed-superadmin.js        # Script to create initial SuperAdmin account
├── config/
│   ├── database.js           # MongoDB connection configuration
│   ├── multer.js             # File upload configuration (Aadhaar & profile images)
│   └── serviceCategories.js  # Service-to-category mapping & category definitions
├── models/
│   ├── user.js               # User model (customers who book services)
│   ├── serviceprovider.js    # ServiceProvider model (providers with location, services, approval status)
│   ├── booking.js            # Booking model (booking requests with OTP verification)
│   └── superadmin.js         # SuperAdmin model (admin credentials)
├── views/
│   ├── index.ejs             # Landing page with service categories
│   ├── home.ejs              # User home page (after login)
│   ├── signup.ejs            # User registration page
│   ├── login.ejs             # User login page
│   ├── signupas.ejs          # Choose signup type (user/provider)
│   ├── sprovidersignup.ejs   # Service provider registration form
│   ├── providerlogin.ejs     # Provider login page
│   ├── provideradmin.ejs     # Provider dashboard (booking management)
│   ├── providers.ejs         # List of providers by category (with distance sorting)
│   ├── track-booking.ejs     # User booking tracking page
│   ├── superadmin-login.ejs  # SuperAdmin login page
│   └── ...                   # (Other EJS templates)
├── public/
│   └── assets/               # Static assets (videos, images)
├── uploads/                  # Uploaded files (Aadhaar images, profile photos)
└── node_modules/             # Dependencies
```

---

## Database Models

### User Model (models/user.js)
```javascript
{
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  location: {
    type: "Point",
    coordinates: [Number] // [longitude, latitude]
  }
}
```
- Indexed with 2dsphere for geospatial queries
- Used for customers who book services

### ServiceProvider Model (models/serviceprovider.js)
```javascript
{
  name, email, password, phone, address,
  location: { type: "Point", coordinates: [Number] },
  services: [String],           // Array of services offered
  experience: Number,           // Years of experience
  category: String,             // Auto-assigned from services
  priceRange: { min, max, unit },
  aadhaarNumber: String,
  aadhaarImage: String,         // File path
  profileImage: String,         // File path
  isVerified: Boolean,
  status: {                     // SuperAdmin approval
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: String,
  rating: Number,
  totalReviews: Number
}
```
- Indexed with 2dsphere for location-based queries
- Requires SuperAdmin approval before login
- Auto-assigned category based on services

### Booking Model (models/booking.js)
```javascript
{
  customerName, customerPhone, customerAddress, customerEmail,
  customer: { type: ObjectId, ref: "User" },  // Optional link to User
  workDescription: String,
  provider: { type: ObjectId, ref: "Provider", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending"
  },
  otp: String,                  // 6-digit OTP for verification
  otpExpires: Date,             // OTP expiry (10 minutes)
  completedAt: Date
}
```
- OTP-based work verification system
- Status flow: pending → accepted/rejected → completed

### SuperAdmin Model (models/superadmin.js)
```javascript
{
  username: { type: String, unique: true },
  password: String
}
```
- Simple admin account for provider approval management

---

## Key Features & Workflows

### 1. User Authentication
- **Signup:** Users register with name, email, password, phone, address, and location (lat/lng)
- **Login:** JWT token stored in HTTP-only cookie (7-day expiry)
- **Middleware:** `authenticateUser` - Checks token, verifies role is "user"

### 2. Service Provider Authentication
- **Signup:** Providers register with personal details, services, experience, price range, Aadhaar & profile images
- **Approval Workflow:** New providers start with `status: "pending"` → SuperAdmin approves/rejects
- **Login:** Only approved providers can login (`status: "approved"`)
- **Middleware:** `authenticateToken` - Checks token, verifies role is "provider"

### 3. Service Categories
Defined in `config/serviceCategories.js`:
- **10 Categories:** Home & Maintenance, On-demand Workers, Digital Services, Pet Services, Health & Wellness, Automobile Services, Education & Learning, Events, Professional Services, Utility & Technology
- **Auto-categorization:** When a provider selects services, category is automatically assigned
- Categories displayed on landing page (`/`) and user home (`/home`)

### 4. Provider Discovery (Geospatial)
- **Route:** `GET /providers?category=X&lat=Y&lng=Z`
- Uses MongoDB `$geoNear` aggregation to find providers within **50km**
- Sorted by distance from user's location
- Filters by category

### 5. Booking System with OTP Verification
**Flow:**
1. User books a provider → Booking created with `status: "pending"`
2. Provider accepts booking → OTP generated (6-digit), sent via email to customer & provider
3. OTP valid for 10 minutes
4. User marks booking as completed → `status: "completed"`
5. Completion email sent to provider

**Email Notifications:**
- OTP email to customer (with booking details)
- OTP email to provider (with customer contact info)
- Completion notification to provider

### 6. SuperAdmin Dashboard
- **Login:** `/superadmin` (default credentials: admin/admin123 - seeded via `seed-superadmin.js`)
- **Dashboard:** `/superadmin/dashboard` - Lists pending, approved, and rejected providers
- **Actions:**
  - Approve provider → Status changed to "approved" + approval email sent
  - Reject provider → Status changed to "rejected" + rejection email with reason sent

---

## API Routes Summary

### Authentication Routes
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/signup` | User registration |
| POST | `/login` | User login |
| POST | `/providerlogin` | Provider login |
| POST | `/providersignup` | Provider registration (with file uploads) |
| GET | `/logout` | Clear token cookie |

### Provider & Service Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Landing page with categories |
| GET | `/home` | User home (requires auth) |
| GET | `/providers` | List providers by category & location |
| GET | `/provideradmin` | Provider dashboard (requires provider auth) |

### Booking Routes
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/bookings` | Create new booking |
| GET | `/api/user/bookings` | Get user's bookings |
| GET | `/api/bookings/:providerId` | Get provider's bookings |
| POST | `/api/bookings/:id/accept` | Accept booking + generate OTP |
| POST | `/api/bookings/:id/reject` | Reject booking |
| POST | `/api/bookings/:id/complete` | Mark booking as completed |
| GET | `/api/bookings-by-phone/:phone` | Get bookings by phone number |
| GET | `/track-booking` | Booking tracking page |

### SuperAdmin Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/superadmin` | SuperAdmin login page |
| POST | `/superadmin/login` | SuperAdmin login |
| GET | `/superadmin/dashboard` | Admin dashboard (pending/approved/rejected providers) |
| POST | `/superadmin/approve/:id` | Approve a provider |
| POST | `/superadmin/reject/:id` | Reject a provider |

---

## Environment Variables (.env)

```env
MONGO_URI=mongodb://localhost:27017/urbansevak
JWT_SECRET=mysecretkey123
EMAIL_USER=hitechbhusara@gmail.com
EMAIL_PASS=ybmk knwf gcki cowa
```

**Note:** For production, use a strong JWT secret and secure email credentials (app-specific password for Gmail).

---

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Update `.env` with your MongoDB URI, JWT secret, and email credentials
   - For Gmail, use an App Password for `EMAIL_PASS`

3. **Start MongoDB:**
   ```bash
   mongod
   ```

4. **Seed SuperAdmin (Optional):**
   ```bash
   node seed-superadmin.js
   ```
   Creates admin account: username=`admin`, password=`admin123`

5. **Run the Application:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT authentication |
| `cors` | CORS middleware |
| `cookie-parser` | Parse cookies |
| `dotenv` | Load environment variables |
| `ejs` | Template engine |
| `multer` | File uploads (Aadhaar/profile images) |
| `nodemailer` | Send emails (OTP, approvals) |

---

## Important Implementation Details

### Authentication
- JWT tokens stored in HTTP-only cookies (secure against XSS)
- Token payload: `{ id, role }` where role is "user", "provider", or "superadmin"
- Middleware functions: `authenticateUser` and `authenticateToken`

### Location-Based Services
- Uses MongoDB's geospatial indexing (`2dsphere`)
- Coordinates stored as `[longitude, latitude]`
- `$geoNear` aggregation for finding nearby providers within 10km

### File Uploads
- Configured via `config/multer.js`
- Stores Aadhaar images and profile photos in `/uploads` directory
- Filename format: `timestamp-originalname`

### Email Templates
- Styled HTML emails with dark theme (matching app design)
- Used for: OTP delivery, booking notifications, provider approval/rejection

### Provider Approval System
- New providers cannot login until approved by SuperAdmin
- Email notifications sent on approval/rejection
- Rejection includes reason (provided by admin)

---

## Current Limitations & TODOs

1. **No input validation/sanitization** - Consider adding express-validator
2. **No rate limiting** - Add rate limiting for auth routes
3. **No password reset** - Forgot password functionality not implemented
4. **Provider price range** - In signup form but not fully utilized in provider listing
5. **Reviews & ratings** - Schema exists but not implemented in UI
6. **No SuperAdmin auth middleware** - Dashboard route uses inline token check
7. **BASE_URL not set** - Email links may not work in production
8. **Error handling** - Some routes lack proper error handling/user feedback

---

## Git Ignore
Currently ignoring: `node_modules`, `.env`

**Recommend adding:** `uploads/`, `.claude/`

---

## License
ISC

## Author
UrbanSevak Project Team
