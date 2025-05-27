# Authentication System Design - AfroBiz Connect

## Overview
This document outlines the comprehensive authentication system design for AfroBiz Connect, including user types, authentication flows, security measures, and implementation strategy.

## User Types & Roles

### 1. Customer Users
- **Role**: `customer`
- **Permissions**: 
  - Browse businesses and services
  - Make bookings and payments
  - Leave reviews and ratings
  - Manage personal profile and preferences
  - View booking history and favorites

### 2. Business Owners
- **Role**: `business_owner`
- **Permissions**:
  - All customer permissions
  - Manage business profile and services
  - View and manage bookings
  - Respond to reviews
  - Access business analytics
  - Manage business hours and availability

### 3. Admin Users
- **Role**: `admin`
- **Permissions**:
  - All business owner permissions
  - Manage all users and businesses
  - Access platform analytics
  - Moderate content and reviews
  - Manage platform settings

## Authentication Methods

### 1. Email/Password Authentication
- **Primary Method**: Traditional email and password
- **Features**:
  - Email verification required
  - Password strength requirements
  - Password reset functionality
  - Account lockout after failed attempts

### 2. Social Authentication
- **Google OAuth 2.0**: Quick signup/login with Google
- **Facebook Login**: Alternative social login option
- **Benefits**: Reduced friction, verified email addresses

### 3. Mobile Phone Authentication (Future)
- **SMS OTP**: For Namibian mobile numbers
- **WhatsApp OTP**: Popular in Namibia
- **Mobile Money Integration**: Link with MTC/TN Mobile accounts

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for social auth only
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role user_role DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  profile_image_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  preferred_language VARCHAR(10) DEFAULT 'en',
  marketing_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  suspension_reason TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE TYPE user_role AS ENUM ('customer', 'business_owner', 'admin');
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  refresh_token VARCHAR(255) UNIQUE,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);
```

### Social Auth Providers Table
```sql
CREATE TABLE social_auth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google', 'facebook'
  provider_user_id VARCHAR(255) NOT NULL,
  provider_email VARCHAR(255),
  provider_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);
```

### Password Reset Tokens Table
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Email Verification Tokens Table
```sql
CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Authentication Flow

### 1. Registration Flow
```
1. User submits registration form
2. Validate input data (email format, password strength)
3. Check if email already exists
4. Hash password using bcrypt (cost factor 12)
5. Create user record with email_verified = false
6. Generate email verification token
7. Send verification email
8. Return success message (don't auto-login)
9. User clicks verification link
10. Verify token and mark email as verified
11. Redirect to login page
```

### 2. Login Flow
```
1. User submits email/password
2. Find user by email
3. Check if account is active and not suspended
4. Verify password hash
5. Check if email is verified
6. Generate JWT access token (15 min expiry)
7. Generate refresh token (30 days expiry)
8. Create session record
9. Return tokens and user data
10. Set secure HTTP-only cookies
```

### 3. Social Auth Flow
```
1. User clicks social login button
2. Redirect to OAuth provider
3. User authorizes application
4. Receive authorization code
5. Exchange code for access token
6. Fetch user profile from provider
7. Check if user exists by email
8. If new user: create account with verified email
9. If existing user: link social provider
10. Generate JWT tokens and create session
11. Return tokens and user data
```

### 4. Token Refresh Flow
```
1. Access token expires (15 min)
2. Client sends refresh token
3. Validate refresh token
4. Check if session is still active
5. Generate new access token
6. Optionally rotate refresh token
7. Update session last_accessed_at
8. Return new tokens
```

## Security Measures

### 1. Password Security
- **Minimum Requirements**: 8 characters, 1 uppercase, 1 lowercase, 1 number
- **Hashing**: bcrypt with cost factor 12
- **Password History**: Prevent reuse of last 5 passwords
- **Breach Detection**: Check against known breached passwords

### 2. Session Security
- **JWT Tokens**: Short-lived access tokens (15 min)
- **Refresh Tokens**: Longer-lived (30 days) with rotation
- **Secure Cookies**: HTTP-only, Secure, SameSite=Strict
- **Session Invalidation**: On password change, logout, suspicious activity

### 3. Rate Limiting
- **Login Attempts**: 5 attempts per 15 minutes per IP
- **Registration**: 3 attempts per hour per IP
- **Password Reset**: 3 attempts per hour per email
- **API Calls**: 100 requests per minute per user

### 4. Account Security
- **Account Lockout**: After 5 failed login attempts
- **Suspicious Activity**: Monitor for unusual login patterns
- **Device Tracking**: Track login devices and locations
- **Email Notifications**: Alert on new device logins

## Implementation Strategy

### Phase 1: Core Authentication (Week 1)
- [ ] Set up database schema
- [ ] Implement email/password registration
- [ ] Implement login/logout functionality
- [ ] Add email verification
- [ ] Create password reset flow
- [ ] Implement JWT token management

### Phase 2: Enhanced Security (Week 2)
- [ ] Add rate limiting
- [ ] Implement account lockout
- [ ] Add session management
- [ ] Create admin user management
- [ ] Add audit logging

### Phase 3: Social Authentication (Week 3)
- [ ] Implement Google OAuth
- [ ] Add Facebook login
- [ ] Create account linking
- [ ] Handle social auth edge cases

### Phase 4: Advanced Features (Week 4)
- [ ] Add two-factor authentication
- [ ] Implement device management
- [ ] Create security notifications
- [ ] Add privacy controls

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
POST /api/auth/resend-verification
```

### Social Auth Endpoints
```
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/facebook
GET  /api/auth/facebook/callback
POST /api/auth/social/link
POST /api/auth/social/unlink
```

### User Management Endpoints
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/change-password
GET    /api/users/sessions
DELETE /api/users/sessions/:id
POST   /api/users/deactivate
```

## Frontend Integration

### 1. Auth Context
```typescript
interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

### 2. Protected Routes
```typescript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

### 3. HTTP Interceptors
```typescript
// Automatically add auth headers
axios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken();
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

## Security Considerations

### 1. Data Protection
- **GDPR Compliance**: Right to deletion, data portability
- **Data Encryption**: Encrypt sensitive data at rest
- **PII Handling**: Minimize collection, secure storage
- **Audit Trails**: Log all authentication events

### 2. Namibian Compliance
- **Data Localization**: Consider local data storage requirements
- **Privacy Laws**: Comply with Namibian privacy regulations
- **Financial Regulations**: For payment processing integration

### 3. Monitoring & Alerting
- **Failed Login Attempts**: Alert on suspicious patterns
- **Account Takeovers**: Monitor for unusual activity
- **Data Breaches**: Incident response procedures
- **Performance Monitoring**: Track auth system performance

## Testing Strategy

### 1. Unit Tests
- Password hashing and verification
- Token generation and validation
- Input validation and sanitization
- Rate limiting logic

### 2. Integration Tests
- Complete authentication flows
- Social auth integration
- Database operations
- Email delivery

### 3. Security Tests
- SQL injection attempts
- XSS prevention
- CSRF protection
- Session hijacking prevention

### 4. Load Tests
- High concurrent login attempts
- Token refresh under load
- Database performance
- Rate limiting effectiveness

## Deployment Considerations

### 1. Environment Variables
```
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<different-strong-secret>
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=900
REFRESH_TOKEN_TIMEOUT=2592000
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
FACEBOOK_APP_ID=<facebook-app-id>
FACEBOOK_APP_SECRET=<facebook-app-secret>
EMAIL_SERVICE_API_KEY=<email-service-key>
```

### 2. Database Security
- Use connection pooling
- Enable SSL connections
- Regular security updates
- Backup encryption

### 3. Infrastructure Security
- HTTPS everywhere
- Security headers
- WAF protection
- DDoS mitigation

This authentication system provides enterprise-grade security while maintaining excellent user experience for the Namibian market. 