# 🌌 Aurora Hotel Management System

> A comprehensive, enterprise-grade hotel management & booking system built with **Spring Boot 3.5.5**, **React 19**, and **PostgreSQL 16** with **pgvector**.  
> This project was developed as part of the *Lập Trình WWW* course at **Industrial University of Ho Chi Minh City (IUH)**.

---

## 👥 Team Members

| Name | Role | GitHub |
|------|------|--------|
| **Nguyễn Trần Gia Sĩ** | Team Lead & Backend Developer | [@giasinguyen](https://github.com/giasinguyen) |
| **Nguyễn Văn Minh** | Frontend Developer | [@nvminh162](https://github.com/nvminh162) |
| **Nguyễn Trung Nguyên** | Backend Developer | [@NguyenNguyen0](https://github.com/NguyenNguyen0) |
| **Nguyễn Duy Khải** | Frontend Developer | [@NguyenDuyKhai2](https://github.com/NguyenDuyKhai2) |

---

## 🚀 Tech Stack

### 🎨 Frontend
- ⚛️ **React 19** - Latest React with Compiler
- 🚀 **Vite 7.1.2** - Next generation frontend tooling
- 🎨 **TailwindCSS 4.1.13** - Utility-first CSS framework
- 📝 **TypeScript 5.8.3** - Type-safe JavaScript
- � **Redux Toolkit** - State management
- 🌐 **React Router v7** - Client-side routing
- 🎭 **Framer Motion** - Animation library
- �🛠️ **ESLint** - Code quality
- 🌍 **i18next** - Internationalization (Vietnamese/English)

### ⚙️ Backend
- ☕ **Java 21** - Latest LTS version with modern features
- 🍃 **Spring Boot 3.5.5** - Production-ready framework
- 🔐 **Spring Security** - Authentication & Authorization
- 🎫 **JWT (Nimbus JOSE)** - Token-based authentication
- 🗄️ **Spring Data JPA** - Data persistence with Hibernate
- ✅ **Spring Validation** - Input validation
- 🛠️ **Lombok 1.18.36** - Reduce boilerplate code
- 🔄 **MapStruct 1.6.3** - High-performance object mapping
- 🔍 **AOP (Aspect-Oriented Programming)** - Cross-cutting concerns
- 📊 **Slf4j + Logback** - Logging framework

### 🗄️ Database
- � **PostgreSQL 16** - Advanced open-source database
- 🔢 **pgvector** - Vector similarity search support
- 🐳 **Docker Compose** - Container orchestration
- 🔧 **pgAdmin 4** - Database management tool
- 📦 **HikariCP** - High-performance connection pool

### 🛠️ DevOps & Tools
- 🔄 **Git & GitHub** - Version control
- 📦 **Maven** - Dependency management & build tool
- � **Docker** - Containerization
- 📮 **Postman** - API testing & documentation
- 🔐 **dotenv-java** - Environment variable management

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ JWT-based authentication with refresh tokens
- ✅ Role-Based Access Control (RBAC) with 5 user roles
- ✅ Permission-based authorization with 70+ granular permissions
- ✅ AOP-based permission checking with AND/OR logic
- ✅ Token introspection & invalidation on logout
- ✅ Secure password hashing with BCrypt
- ✅ OAuth2 resource server integration

### 👥 User Management
- ✅ User registration & profile management
- ✅ Multi-role support (Admin, Manager, Staff, Customer, Guest)
- ✅ Branch assignment for staff and managers
- ✅ User search & pagination
- ✅ Soft delete functionality
- ✅ Audit trails (created/updated timestamps)

### 🏢 Multi-Branch System
- ✅ Multiple hotel branches support
- ✅ Branch-specific configurations (check-in/out times, operating hours)
- ✅ Branch manager assignment
- ✅ Geographic coordinates for map integration
- ✅ Branch status management (Active, Inactive, Maintenance)
- ✅ Branch-level statistics & reporting

### 🏨 Room Management
- ✅ Room types with flexible pricing (base, weekend, holiday)
- ✅ Room status tracking (Available, Occupied, Cleaning, Maintenance, etc.)
- ✅ Capacity management (adults, children, max occupancy)
- ✅ Bed type configurations
- ✅ Room amenities management
- ✅ Price override per room
- ✅ Room images & descriptions
- ✅ Multi-branch room management

### 📅 Booking System
- ✅ Multi-room booking support
- ✅ Booking status workflow (Pending → Confirmed → Checked-in → Completed)
- ✅ Auto-generated unique booking codes
- ✅ Deposit tracking
- ✅ Special requests handling
- ✅ Check-in/out time tracking
- ✅ Cancellation with reason tracking
- ✅ Email & SMS notification flags
- ✅ No-show handling

### 💳 Payment Integration
- ✅ Multiple payment methods (Cash, Card, Bank Transfer, VNPay, MoMo, ZaloPay)
- ✅ Payment status tracking
- ✅ Refund management (full & partial)
- ✅ Payment gateway integration ready
- ✅ Currency support
- ✅ Transaction history

### 🎟️ Promotions & Discounts
- ✅ Percentage & fixed amount discounts
- ✅ Date-based promotion validity
- ✅ Minimum booking amount conditions
- ✅ Usage limit tracking
- ✅ Room type specific promotions
- ✅ Branch-specific or global promotions
- ✅ Priority-based promotion stacking

### 🛎️ Additional Services
- ✅ Add-on services (Spa, Massage, Airport Transfer, etc.)
- ✅ Service booking with time slot management
- ✅ Service capacity & availability tracking
- ✅ Service pricing & duration management
- ✅ Service status workflow
- ✅ Special instructions support

### 🏊 Facilities Management
- ✅ Hotel facilities (Pool, Gym, Restaurant, Conference Rooms, etc.)
- ✅ Operating hours & policies
- ✅ Reservation requirements
- ✅ Capacity management
- ✅ Free vs. paid facilities
- ✅ Facility images & descriptions

### 🎯 Amenities
- ✅ Room amenities (TV, WiFi, Minibar, etc.)
- ✅ Categorized amenities (Room, Bathroom, Entertainment, Technology, etc.)
- ✅ Icon support for UI display
- ✅ Active/Inactive status
- ✅ Display order configuration

### 📊 Reporting & Analytics
- 🚧 Dashboard with key metrics (In Progress)
- 🚧 Booking analytics & trends (Planned)
- 🚧 Revenue reports (Planned)
- 🚧 Occupancy rate tracking (Planned)
- 🚧 Export to PDF/Excel (Planned)  

---

### 🔑 Key Features
- **15 Entities** with comprehensive relationships
- **Enum-based status management** for type safety
- **Soft delete** support across all entities
- **Audit trails** (createdAt, updatedAt) on all tables
- **Optimized indexes** for query performance
- **UUID primary keys** for security
- **RBAC** with 5 roles and 70+ granular permissions

---

## �🛠️ Setup & Installation

### Prerequisites
- ☕ **Java 21** (OpenJDK or Oracle JDK)
- 📦 **Maven 3.8+** (or use included wrapper)
- 🐘 **PostgreSQL 16** (or use Docker)
- 📱 **Node.js 18+** and **npm 9+**
- 🐳 **Docker** (optional, for database)
- 🔧 **Git**

---

### 🐘 Database Setup (Option 1: Docker - Recommended)

```bash
# Navigate to backend directory
cd aurora-backend

# Start PostgreSQL + pgAdmin containers
docker-compose up -d

# Check container status
docker ps

# Containers will be available:
# - PostgreSQL: localhost:5432
# - pgAdmin: http://localhost:5050
#   - Email: admin@gmail.com
#   - Password: admin
```

**Database Credentials (Docker):**
- Host: `localhost`
- Port: `5432`
- Database: `aurora_hotel`
- Username: `admin`
- Password: `admin`

---

### 🐘 Database Setup (Option 2: Manual PostgreSQL)

```bash
# Install PostgreSQL 16
# For Ubuntu/Debian:
sudo apt update
sudo apt install postgresql-16 postgresql-contrib-16

# For macOS (using Homebrew):
brew install postgresql@16

# For Windows: Download installer from postgresql.org

# Start PostgreSQL service
sudo systemctl start postgresql

# Create database
sudo -u postgres psql
postgres=# CREATE DATABASE aurora_hotel;
postgres=# CREATE USER aurora_user WITH PASSWORD 'your_secure_password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE aurora_hotel TO aurora_user;
postgres=# \q
```

---

### ⚙️ Backend Setup (Spring Boot)

```bash
# Navigate to backend directory
cd aurora-backend

# Create .env file (copy from .env.example if exists)
touch .env

# Add environment variables to .env:
DB_URL=jdbc:postgresql://localhost:5432/aurora_hotel
DB_USERNAME=admin
DB_PASSWORD=admin
JWT_SIGNER_KEY=your_secret_key_min_32_characters_long_for_hs512_algorithm
JWT_VALID_DURATION=3600
JWT_REFRESHABLE_DURATION=86400
```

**Generate secure JWT key:**
```bash
# Generate a secure 64-character key
openssl rand -hex 32
```

**Install dependencies and run:**
```bash
# Clean install (skip tests for faster build)
./mvnw clean install -DskipTests

# Run the application
./mvnw spring-boot:run

# Or with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Backend will be available at:** `http://localhost:8080`

**Swagger UI (if configured):** `http://localhost:8080/swagger-ui.html`

---

### 🎨 Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd aurora-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# The frontend will start with hot-reload
```

**Frontend will be available at:** `http://localhost:5173`

---

## 🚀 Development Commands

### 🔙 Backend Commands

```bash
# Development mode with auto-reload
./mvnw spring-boot:run

# Run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Build for production
./mvnw clean package -DskipTests

# Run tests
./mvnw test

# Run tests with coverage
./mvnw test jacoco:report

# Clean build
./mvnw clean

# Format code
./mvnw spotless:apply
```

### 🎨 Frontend Commands

```bash
# Start development server (hot-reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check

# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 🐳 Docker Commands

```bash
# Start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Remove containers and volumes
docker-compose down -v

# Access PostgreSQL container
docker exec -it rag_postgres psql -U admin -d aurora_hotel

# Backup database
docker exec rag_postgres pg_dump -U admin aurora_hotel > backup.sql

# Restore database
docker exec -i rag_postgres psql -U admin aurora_hotel < backup.sql
```

---

## 🔧 Configuration Details

### Backend Configuration Files

**`application.yml`** (Common config)
```yaml
server:
  port: 8080

spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/aurora_hotel}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        jdbc.batch_size: 20

jwt:
  signerKey: ${JWT_SIGNER_KEY}
  valid-duration: ${JWT_VALID_DURATION:3600}
  refreshable-duration: ${JWT_REFRESHABLE_DURATION:86400}
```

**`application-dev.yml`** (Development)
```yaml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
logging:
  level:
    com.aurora.backend: DEBUG
```

**`application-prod.yml`** (Production)
```yaml
spring:
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate
logging:
  level:
    com.aurora.backend: INFO
```

### Frontend Configuration

**`vite.config.ts`**
- Proxy API requests to backend
- Build optimization
- Path aliases configuration

**`tailwind.config.js`**
- Custom theme colors
- Responsive breakpoints
- Custom utilities

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/token` | Login & get JWT token | ❌ |
| POST | `/api/v1/auth/refresh` | Refresh access token | ❌ |
| POST | `/api/v1/auth/introspect` | Validate token | ❌ |
| POST | `/api/v1/auth/logout` | Logout & invalidate token | ❌ |
| POST | `/api/v1/users/register` | Register new customer | ❌ |

### User Management

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/api/v1/users` | Get all users | `USER_CREATE` / `STAFF_VIEW` |
| GET | `/api/v1/users/paginated` | Get users with pagination | `USER_CREATE` / `STAFF_VIEW` |
| GET | `/api/v1/users/{id}` | Get user by ID | `PROFILE_VIEW` |
| POST | `/api/v1/users` | Create new user | `USER_CREATE` |
| PUT | `/api/v1/users/{id}` | Update user | `PROFILE_UPDATE` |
| DELETE | `/api/v1/users/{id}` | Delete user | `USER_DELETE` |

### Branch Management

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/api/v1/branches` | Get all branches | `BRANCH_VIEW` |
| GET | `/api/v1/branches/{id}` | Get branch by ID | `BRANCH_VIEW` |
| POST | `/api/v1/branches` | Create branch | `BRANCH_CREATE` |
| PUT | `/api/v1/branches/{id}` | Update branch | `BRANCH_UPDATE` |
| DELETE | `/api/v1/branches/{id}` | Delete branch | `BRANCH_DELETE` |

### Booking System

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/api/v1/bookings` | Get all bookings | `BOOKING_VIEW_ALL` |
| GET | `/api/v1/bookings/{id}` | Get booking by ID | `BOOKING_VIEW_OWN` |
| POST | `/api/v1/bookings` | Create booking | `BOOKING_CREATE` |
| PUT | `/api/v1/bookings/{id}` | Update booking | `BOOKING_UPDATE_OWN` |
| DELETE | `/api/v1/bookings/{id}` | Cancel booking | `BOOKING_CANCEL_OWN` |

**📮 Full API Collection:** Import `Aurora_Hotel_Complete_APIs.postman_collection.json` into Postman

---

## 🔐 RBAC System

### 5 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| 👑 **ADMIN** | System Administrator | Full system access (17 permissions) |
| 👨‍💼 **MANAGER** | Branch Manager | Branch operations, reports (13 permissions) |
| 👔 **STAFF** | Front Desk Staff | Daily operations (10 permissions) |
| 👤 **CUSTOMER** | Registered User | Booking & profile (9 permissions) |
| 🌐 **GUEST** | Anonymous User | View public info (5 permissions) |

### Permission Structure

**70+ Granular Permissions** organized by domain:

```
Guest Permissions (5):
├─ BRANCH_VIEW
├─ ROOM_VIEW
├─ ROOM_SEARCH
├─ PROMOTION_VIEW
└─ SERVICE_VIEW

Customer Permissions (9):
├─ BOOKING_CREATE/VIEW/UPDATE/CANCEL_OWN
├─ PAYMENT_CREATE/VIEW_OWN
├─ PROFILE_VIEW/UPDATE
└─ SERVICE_REGISTER

Staff Permissions (10):
├─ BOOKING_VIEW_ALL
├─ BOOKING_CREATE_MANUAL
├─ BOOKING_UPDATE_ALL
├─ BOOKING_CANCEL_ALL
├─ ROOM_STATUS_UPDATE
├─ CHECKIN_PROCESS
├─ CHECKOUT_PROCESS
├─ CUSTOMER_VIEW
├─ PAYMENT_VIEW_ALL
└─ SERVICE_MANAGE

Manager Permissions (13):
├─ All Staff Permissions
├─ ROOM_CRUD
├─ PROMOTION_CRUD
├─ PRICE_UPDATE
├─ REPORT_VIEW/EXPORT
├─ STAFF_VIEW
└─ BRANCH_VIEW_STATS

Admin Permissions (17):
├─ USER_CRUD
├─ ROLE_CRUD
├─ BRANCH_CRUD
├─ PERMISSION_MANAGE
├─ SYSTEM_CONFIG
├─ BACKUP_MANAGE
└─ LOG_VIEW
```

---

## 🎯 Design Patterns & Best Practices

### Applied Design Patterns
- ✅ **Repository Pattern** - Data access abstraction
- ✅ **Service Layer Pattern** - Business logic separation
- ✅ **DTO Pattern** - Request/Response data transfer
- ✅ **Builder Pattern** - Entity construction (Lombok)
- ✅ **Aspect-Oriented Programming** - Cross-cutting concerns
- ✅ **Dependency Injection** - Loose coupling
- ✅ **Factory Pattern** - Object creation

### Code Quality Measures
- ✅ **SOLID Principles** - Clean code architecture
- ✅ **DRY (Don't Repeat Yourself)** - Code reusability
- ✅ **Separation of Concerns** - Layered architecture
- ✅ **Type Safety** - Enums for status fields
- ✅ **Null Safety** - @NonNull annotations
- ✅ **Transaction Management** - @Transactional
- ✅ **Exception Handling** - Centralized error handling
- ✅ **Logging** - Comprehensive logging with Slf4j
- ✅ **Validation** - Input validation with Bean Validation
- ✅ **Security** - JWT, BCrypt, RBAC

### Database Best Practices
- ✅ **Indexes** - Query optimization
- ✅ **Lazy Loading** - Performance optimization
- ✅ **Batch Operations** - Bulk insert/update
- ✅ **Connection Pooling** - HikariCP
- ✅ **Soft Delete** - Data preservation
- ✅ **Audit Trail** - Created/Updated timestamps
- ✅ **UUID Keys** - Security & distributed systems

---

## 🚀 Deployment

### Production Checklist

#### Backend
- [ ] Change `ddl-auto` to `validate` in production
- [ ] Set `show-sql` to `false`
- [ ] Use strong JWT secret key (64+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up database backup schedule
- [ ] Configure log rotation
- [ ] Set up monitoring & alerting
- [ ] Enable rate limiting
- [ ] Configure firewall rules

#### Frontend
- [ ] Run production build: `npm run build`
- [ ] Configure environment variables
- [ ] Set up CDN for static assets
- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Minify JavaScript/CSS
- [ ] Optimize images
- [ ] Set up error tracking (e.g., Sentry)

### Deployment Options

**Backend:**
- AWS EC2 / Azure VM
- AWS Elastic Beanstalk
- Heroku / Railway
- Docker containers on any cloud

**Frontend:**
- Vercel (Recommended for Vite)
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages

**Database:**
- AWS RDS PostgreSQL
- Azure Database for PostgreSQL
- Supabase
- Railway
- Self-hosted PostgreSQL

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check Java version
java -version  # Should be 21+

# Check PostgreSQL connection
psql -h localhost -U admin -d aurora_hotel

# Check environment variables
cat .env

# Clean build
./mvnw clean install -U
```

**Database connection errors:**
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check credentials in `.env` file
- Ensure database `aurora_hotel` exists
- Check firewall rules for port 5432

**Frontend build errors:**
```bash
# Clear node_modules
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Check Node.js version
node -v  # Should be 18+
```

**CORS errors:**
- Check `SecurityConfig.java` for allowed origins
- Ensure frontend URL is in allowed origins list
- Clear browser cache

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/giasinguyen/aurora-hotel-system.git
   cd aurora-hotel-system
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Follow existing code style
   - Write meaningful commit messages
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'feat: Add some AmazingFeature'
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Provide clear description
   - Reference related issues
   - Wait for code review

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Code Style

**Backend (Java):**
- Follow Java naming conventions
- Use Lombok annotations appropriately
- Add Javadoc for public methods
- Keep methods small and focused

**Frontend (TypeScript):**
- Follow ESLint rules
- Use TypeScript types strictly
- Component-based architecture
- Meaningful variable names

---

## 📊 Project Status

### ✅ Completed Features
- [x] User authentication & authorization (JWT + RBAC)
- [x] Multi-branch management system
- [x] Room & room type management with pricing
- [x] Booking system with status workflow
- [x] Payment integration framework
- [x] Promotion system
- [x] Additional services management
- [x] Facilities & amenities
- [x] Database schema with 15 entities
- [x] RESTful API with 60+ endpoints
- [x] Comprehensive error handling
- [x] Audit trails & soft delete

### 🚧 In Progress
- [ ] Frontend UI implementation
- [ ] Payment gateway integration (VNPay, MoMo)
- [ ] Email/SMS notifications
- [ ] Admin dashboard & reporting
- [ ] Search & filter optimization
- [ ] File upload (images)

### 📋 Planned Features
- [ ] Real-time availability checking
- [ ] Booking calendar view
- [ ] Customer reviews & ratings
- [ ] Loyalty program
- [ ] Multi-language support (full)
- [ ] Mobile responsive design
- [ ] Export reports (PDF/Excel)
- [ ] Automated backup system
- [ ] Analytics dashboard
- [ ] AI-powered recommendations

---

## 📚 Learning Resources

### Spring Boot
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Baeldung Spring Tutorials](https://www.baeldung.com/spring-boot)

### React & TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

### Database
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JPA & Hibernate Guide](https://hibernate.org/orm/documentation/)

---

## 📜 License

This project is developed for **educational purposes** as part of the **Lập Trình WWW (Web Programming)** course at **Industrial University of Ho Chi Minh City (IUH)**.

**© 2024-2025 Aurora Development Team. All Rights Reserved.**

---

## 📞 Contact & Support

### Development Team
- 👨‍💻 **Team Lead**: Nguyễn Trần Gia Sĩ - [@giasinguyen](https://github.com/giasinguyen)
- 📧 **Email**: [Contact via GitHub Issues](https://github.com/giasinguyen/aurora-hotel-system/issues)

### Repository
- 🔗 **GitHub**: [aurora-hotel-system](https://github.com/giasinguyen/aurora-hotel-system)
- 📝 **Issue Tracker**: [Report bugs or request features](https://github.com/giasinguyen/aurora-hotel-system/issues)
- 💬 **Discussions**: [Join community discussions](https://github.com/giasinguyen/aurora-hotel-system/discussions)

### Academic Information
- 🏫 **Institution**: Industrial University of Ho Chi Minh City (IUH)
- 📚 **Course**: Lập Trình WWW (Web Programming)
- 📅 **Academic Year**: 2025

---

## 🙏 Acknowledgments

- Spring Boot & Spring Framework teams
- React & TypeScript communities
- PostgreSQL development team
- All open-source contributors
- IUH Faculty of Information Technology
- Our course instructor and mentors

---

<div align="center">

### ⭐ Star this repository if you find it helpful! ⭐

**Made with ❤️ by Aurora Development Team**

**🌌 Building the future of hotel management, one commit at a time 🌌**

</div>


