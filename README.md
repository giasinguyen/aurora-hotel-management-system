<p align="center">
  <img src="aurora-frontend/src/assets/images/commons/aurora-logo.png" alt="Aurora Hotel Logo" width="200"/>
</p>

<h1 align="center">🌌 Aurora Hotel Management System</h1>

<p align="center">
  <strong>Hệ thống quản lý khách sạn toàn diện, hiện đại với AI Chatbot thông minh</strong>
</p>

<p align="center">
  <a href="#-tính-năng">Tính năng</a> •
  <a href="#-công-nghệ">Công nghệ</a> •
  <a href="#-cài-đặt--chạy">Cài đặt</a> •
  <a href="#-api-documentation">API</a> •
  <a href="#-team">Team</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5.5-6db33f?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169e1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-7.1.7-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Redis-7.2-dc382d?style=flat-square&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ed?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=flat-square&logo=railway&logoColor=white" alt="Railway"/>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/giasinguyen/DHKTPM18B_Nhom09_AuroraHotelSystem?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/github/stars/giasinguyen/DHKTPM18B_Nhom09_AuroraHotelSystem?style=flat-square" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/giasinguyen/DHKTPM18B_Nhom09_AuroraHotelSystem?style=flat-square" alt="Forks"/>
</p>

---

## 📋 Mục lục

- [🎯 Giới thiệu](#-giới-thiệu)
- [✨ Tính năng](#-tính-năng)
- [🛠 Công nghệ](#-công-nghệ)
- [📐 Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [🚀 Cài đặt & Chạy](#-cài-đặt--chạy)
- [📚 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#️-database-schema)
- [👥 Team](#-team)
- [📄 License](#-license)

---

## 🎯 Giới thiệu

**Aurora Hotel Management System** là một hệ thống quản lý khách sạn enterprise-grade, được phát triển như đồ án môn học **Lập trình WWW** tại **Trường Đại học Công nghiệp TP.HCM (IUH)**.

Hệ thống cung cấp giải pháp toàn diện cho việc quản lý khách sạn đa chi nhánh với các tính năng hiện đại như:
- 🤖 **AI Chatbot** sử dụng RAG (Retrieval-Augmented Generation) với Google Gemini
- 🔐 **Phân quyền RBAC** chi tiết với 70+ permissions
- 💳 **Tích hợp thanh toán** VNPay
- 📊 **Dashboard & Báo cáo** trực quan
- 🌐 **Đa ngôn ngữ** (Tiếng Việt / English)

---

## ✨ Tính năng

### 🏨 Quản lý Khách sạn

<table>
<tr>
<td width="50%">

#### 🏢 Đa chi nhánh
- Quản lý nhiều chi nhánh khách sạn
- Cấu hình riêng cho từng chi nhánh
- Phân quyền theo chi nhánh
- Thống kê riêng biệt

#### 🛏️ Quản lý Phòng
- Phân loại phòng theo category
- Nhiều loại phòng với giá linh hoạt
- Trạng thái phòng real-time
- Quản lý tiện nghi phòng

</td>
<td width="50%">

#### 📅 Đặt phòng
- Booking workflow hoàn chỉnh
- Kiểm tra phòng trống tự động
- Đặt nhiều phòng cùng lúc
- Xử lý yêu cầu đặc biệt

#### 💰 Thanh toán
- Tích hợp VNPay
- Nhiều phương thức thanh toán
- Quản lý hoàn tiền
- Lịch sử giao dịch

</td>
</tr>
</table>

### 👥 Quản lý Nhân sự

<table>
<tr>
<td width="50%">

#### 🔐 Phân quyền RBAC
- **5 vai trò**: Admin, Manager, Staff, Customer, Guest
- **70+ permissions** chi tiết
- Kiểm tra quyền bằng AOP
- Hỗ trợ logic AND/OR

#### 👔 Ca làm việc
- Tạo & quản lý ca làm
- Phân công nhân viên
- Check-in/Check-out
- Thống kê giờ làm

</td>
<td width="50%">

#### 📊 Dashboard
- Thống kê doanh thu
- Biểu đồ công suất phòng
- Báo cáo theo thời gian
- Export PDF/Excel

#### 📰 Quản lý Nội dung
- Tin tức & sự kiện
- Khuyến mãi & ưu đãi
- Quản lý tài liệu
- Gallery ảnh

</td>
</tr>
</table>

### 🤖 AI-Powered Features

```
┌─────────────────────────────────────────────────────────────┐
│                    🧠 RAG Chatbot System                    │
├─────────────────────────────────────────────────────────────┤
│  📄 Documents  →  🔤 Text Extraction  →  📊 Embeddings     │
│       ↓                    ↓                    ↓          │
│  Apache Tika      Langchain4j Parser     Google Gemini     │
│       ↓                    ↓                    ↓          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              🗄️ pgvector Database                  │   │
│  │         Vector Similarity Search (cosine)          │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  User Query  →  Semantic Search  →  Context + LLM  →  💬   │
└─────────────────────────────────────────────────────────────┘
```

**Tính năng AI:**
- ✅ Chatbot hỏi đáp thông minh
- ✅ Tìm kiếm ngữ nghĩa tài liệu
- ✅ Streaming response real-time
- ✅ Đa ngôn ngữ (VI/EN)
- ✅ Context-aware responses

---

## 🛠 Công nghệ

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk) | 21 LTS | Core Language |
| ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-6db33f?logo=springboot) | 3.5.5 | Framework |
| ![Spring Security](https://img.shields.io/badge/Spring%20Security-6.x-6db33f?logo=springsecurity) | 6.x | Authentication & Authorization |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql) | 16 | Primary Database |
| ![pgvector](https://img.shields.io/badge/pgvector-0.1.6-4169e1) | 0.1.6 | Vector Search |
| ![Redis](https://img.shields.io/badge/Redis-7.2-dc382d?logo=redis) | 7.2 | Caching & Session |
| ![Langchain4j](https://img.shields.io/badge/Langchain4j-1.7.1-00b4a9) | 1.7.1 | AI/LLM Framework |
| ![JWT](https://img.shields.io/badge/JWT-9.40-000000?logo=jsonwebtokens) | 9.40 | Token Authentication |
| ![MapStruct](https://img.shields.io/badge/MapStruct-1.6.3-orange) | 1.6.3 | Object Mapping |
| ![Lombok](https://img.shields.io/badge/Lombok-1.18.36-red) | 1.18.36 | Code Generation |

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react) | 19.1.1 | UI Framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?logo=typescript) | 5.9.3 | Type Safety |
| ![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite) | 7.1.7 | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.14-06b6d4?logo=tailwindcss) | 4.1.14 | Styling |
| ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.9.0-764abc?logo=redux) | 2.9.0 | State Management |
| ![React Router](https://img.shields.io/badge/React%20Router-7.9.4-ca4245?logo=reactrouter) | 7.9.4 | Routing |
| ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.x-0055ff) | 12.x | Animations |
| ![Recharts](https://img.shields.io/badge/Recharts-3.5.1-22b5bf) | 3.5.1 | Charts |
| ![i18next](https://img.shields.io/badge/i18next-25.6.0-26a69a) | 25.6.0 | Internationalization |

### DevOps & Tools

| Tool | Purpose |
|------|---------|
| ![Docker](https://img.shields.io/badge/Docker-Containerization-2496ed?logo=docker) | Containerization |
| ![Railway](https://img.shields.io/badge/Railway-Deployment-0B0D0E?logo=railway) | Backend Hosting |
| ![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448c5) | Media Storage |
| ![Postman](https://img.shields.io/badge/Postman-API%20Testing-ff6c37?logo=postman) | API Testing |

---

## 📐 Kiến trúc hệ thống

### System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                               │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Browser    │  │   Mobile     │  │   Postman    │                  │
│  │   (React)    │  │   (Future)   │  │   (Testing)  │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
└─────────┼─────────────────┼─────────────────┼──────────────────────────┘
          │                 │                 │
          └────────────────┬┴─────────────────┘
                           │ HTTPS/REST API
┌──────────────────────────┼─────────────────────────────────────────────┐
│                          ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    🛡️ SECURITY LAYER                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │ JWT Filter  │→ │ CORS Config │→ │ Permission AOP Checker  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    🎯 CONTROLLER LAYER (31 Controllers)         │   │
│  │  Auth │ User │ Branch │ Room │ Booking │ Payment │ RAG │ ...    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    ⚙️ SERVICE LAYER                             │   │
│  │  Business Logic │ Validation │ Transaction Management           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    🗄️ REPOSITORY LAYER                          │   │
│  │  JPA Repositories │ Custom Queries │ Specifications             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                          SPRING BOOT APPLICATION                        │
└────────────────────────────────────────────────────────────────────────┘
          │                           │                        │
          ▼                           ▼                        ▼
┌──────────────────┐  ┌───────────────────────┐  ┌─────────────────────┐
│   PostgreSQL     │  │       Redis           │  │    Cloudinary       │
│   + pgvector     │  │   (Cache/Session)     │  │   (Media Storage)   │
└──────────────────┘  └───────────────────────┘  └─────────────────────┘
```

### Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CORE ENTITIES (29)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  👤 USER MANAGEMENT          🏨 HOTEL MANAGEMENT        📅 BOOKING      │
│  ├── User                    ├── Branch                 ├── Booking     │
│  ├── Role                    ├── Room                   ├── BookingRoom │
│  ├── Permission              ├── RoomType               ├── Payment     │
│  └── SessionMeta             ├── RoomCategory           └── Promotion   │
│                              ├── Amenity                                │
│  🔐 SECURITY                 └── Facility               🛎️ SERVICES    │
│  ├── InvalidatedToken                                   ├── Service     │
│  ├── EmailVerificationToken  📰 CONTENT                 ├── ServiceCat  │
│  └── PasswordResetToken      ├── News                   └── ServiceBook │
│                              ├── Document                               │
│  👔 STAFF MANAGEMENT         ├── ImageAsset             📊 ANALYTICS    │
│  ├── WorkShift               └── Gallery                ├── RoomEvent   │
│  ├── StaffShiftAssignment                               └── PriceAdj    │
│  └── ShiftCheckIn                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Cài đặt & Chạy

### 📋 Yêu cầu hệ thống

| Requirement | Version |
|-------------|---------|
| Java JDK | 21+ |
| Node.js | 20+ |
| PostgreSQL | 16+ |
| Redis | 7+ |
| Docker | Latest (Optional) |
| Maven | 3.9+ (Included) |

### 🐳 Cài đặt với Docker (Khuyến nghị)

```bash
# 1. Clone repository
git clone https://github.com/giasinguyen/DHKTPM18B_Nhom09_AuroraHotelSystem.git
cd DHKTPM18B_Nhom09_AuroraHotelSystem

# 2. Khởi động database services
cd aurora-backend
docker-compose up -d

# 3. Kiểm tra containers
docker-compose ps
# PostgreSQL: localhost:5432
# Redis: localhost:6379
# pgAdmin: http://localhost:5050
```

### ⚙️ Cấu hình Backend

```bash
# 1. Di chuyển vào thư mục backend
cd aurora-backend

# 2. Tạo file .env từ template
cp .env.example .env

# 3. Cấu hình các biến môi trường
```

**File `.env` cần cấu hình:**

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/aurora_hotel
DB_USERNAME=admin
DB_PASSWORD=admin

# JWT Configuration
JWT_SIGNER_KEY=your-secret-key-min-64-characters-for-hs512-algorithm
JWT_VALID_DURATION=3600
JWT_REFRESHABLE_DURATION=86400

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=admin

# Google Gemini AI (for RAG Chatbot)
GEMINI_API_KEY=your-gemini-api-key

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# VNPay (Payment Gateway)
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
```

```bash
# 4. Chạy Backend
./mvnw spring-boot:run

# Backend sẽ chạy tại: http://localhost:8080
```

### 🎨 Cấu hình Frontend

```bash
# 1. Di chuyển vào thư mục frontend
cd aurora-frontend

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env.local
cp .env.example .env.local

# 4. Cấu hình
```

**File `.env.local`:**

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
```

```bash
# 5. Chạy Development Server
npm run dev

# Frontend sẽ chạy tại: http://localhost:3000
```

### 📦 Build Production

```bash
# Backend
cd aurora-backend
./mvnw clean package -DskipTests
java -jar target/*.jar

# Frontend
cd aurora-frontend
npm run build
npm run preview
```

---

## 📚 API Documentation

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/token` | Đăng nhập, lấy JWT |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `POST` | `/api/v1/auth/logout` | Đăng xuất |
| `POST` | `/api/v1/auth/introspect` | Kiểm tra token |
| `GET` | `/api/v1/auth/me` | Lấy thông tin user hiện tại |

### 👥 User Management
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| `GET` | `/api/v1/users` | Danh sách users | `USER_VIEW` |
| `GET` | `/api/v1/users/{id}` | Chi tiết user | `USER_VIEW` |
| `POST` | `/api/v1/users` | Tạo user mới | `USER_CREATE` |
| `PUT` | `/api/v1/users/{id}` | Cập nhật user | `USER_UPDATE` |
| `DELETE` | `/api/v1/users/{id}` | Xóa user | `USER_DELETE` |

### 🏨 Hotel Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/branches` | Danh sách chi nhánh |
| `GET` | `/api/v1/rooms` | Danh sách phòng |
| `GET` | `/api/v1/room-types` | Loại phòng |
| `GET` | `/api/v1/room-categories` | Danh mục phòng |
| `GET` | `/api/v1/amenities` | Tiện nghi |
| `GET` | `/api/v1/facilities` | Cơ sở vật chất |

### 📅 Booking & Payment

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/bookings` | Tạo booking |
| `GET` | `/api/v1/bookings/{id}` | Chi tiết booking |
| `PUT` | `/api/v1/bookings/{id}/confirm` | Xác nhận booking |
| `PUT` | `/api/v1/bookings/{id}/check-in` | Check-in |
| `PUT` | `/api/v1/bookings/{id}/check-out` | Check-out |
| `POST` | `/api/v1/payments/vnpay/create` | Tạo thanh toán VNPay |

### 🤖 AI Chatbot

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/rag/chat` | Chat với AI |
| `POST` | `/api/v1/rag/chat-stream` | Chat streaming |
| `POST` | `/api/v1/rag/documents` | Upload tài liệu |
| `GET` | `/api/v1/rag/documents` | Danh sách tài liệu |

### 📮 Postman Collection

Import các collection để test API:
- `postman/Aurora Hotel Management System.postman_collection.json`
- `postman/Aurora_Hotel_Authentication_Tests.postman_collection.json`

---

## 🗄️ Database Schema

### Core Tables

| Table | Description | Records |
|-------|-------------|---------|
| `users` | Thông tin người dùng | - |
| `roles` | Vai trò (Admin, Manager, Staff, Customer, Guest) | 5 |
| `permissions` | Quyền hạn chi tiết | 70+ |
| `branches` | Chi nhánh khách sạn | - |
| `rooms` | Phòng | - |
| `room_types` | Loại phòng | - |
| `bookings` | Đặt phòng | - |
| `payments` | Thanh toán | - |

### Vector Search Table

```sql
CREATE TABLE document_embeddings (
    id UUID PRIMARY KEY,
    content TEXT,
    embedding vector(768),  -- Google Gemini embedding dimension
    metadata JSONB,
    created_at TIMESTAMP
);

-- Create HNSW index for fast similarity search
CREATE INDEX ON document_embeddings 
USING hnsw (embedding vector_cosine_ops);
```

---

## 📁 Cấu trúc thư mục

```
DHKTPM18B_Nhom09_AuroraHotelSystem/
├── 📁 aurora-backend/              # Spring Boot Backend
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/com/aurora/backend/
│   │   │   │   ├── 📁 config/          # Configurations
│   │   │   │   ├── 📁 controller/      # REST Controllers (31)
│   │   │   │   ├── 📁 dto/             # Data Transfer Objects
│   │   │   │   ├── 📁 entity/          # JPA Entities (29)
│   │   │   │   ├── 📁 enums/           # Enumerations
│   │   │   │   ├── 📁 exception/       # Exception Handling
│   │   │   │   ├── 📁 mapper/          # MapStruct Mappers
│   │   │   │   ├── 📁 repository/      # JPA Repositories
│   │   │   │   ├── 📁 security/        # Security & JWT
│   │   │   │   ├── 📁 service/         # Business Logic
│   │   │   │   └── 📁 util/            # Utilities
│   │   │   └── 📁 resources/
│   │   │       ├── 📄 application.yml
│   │   │       ├── 📄 application-dev.yml
│   │   │       └── 📄 application-prod.yml
│   │   └── 📁 test/                    # Unit Tests
│   ├── 📁 postman/                     # API Collections
│   ├── 📄 docker-compose.yml
│   ├── 📄 Dockerfile
│   └── 📄 pom.xml
│
├── 📁 aurora-frontend/             # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 assets/                  # Images, Fonts, Videos
│   │   ├── 📁 components/              # Reusable Components
│   │   │   ├── 📁 ui/                  # shadcn/ui Components
│   │   │   ├── 📁 booking/             # Booking Components
│   │   │   └── 📁 custom/              # Custom Components
│   │   ├── 📁 config/                  # Axios, i18n Config
│   │   ├── 📁 features/                # Redux Slices
│   │   ├── 📁 hooks/                   # Custom Hooks
│   │   ├── 📁 layouts/                 # Page Layouts
│   │   ├── 📁 locales/                 # i18n Translations
│   │   ├── 📁 pages/                   # Page Components (17 modules)
│   │   ├── 📁 router/                  # React Router Config
│   │   ├── 📁 services/                # API Services
│   │   ├── 📁 types/                   # TypeScript Types
│   │   └── 📁 utils/                   # Utilities
│   ├── 📄 index.html
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   └── 📄 vite.config.ts
│
├── 📁 docs/                        # Documentation
│   ├── 📄 class-diagram.puml
│   ├── 📄 database-diagram.puml
│   ├── 📄 database-schema.sql
│   └── 📄 README.md
│
└── 📄 README.md                    # This file
```

---

## 🔧 Scripts & Commands

### Backend

```bash
# Development
./mvnw spring-boot:run                    # Run with default profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev  # Dev profile

# Build
./mvnw clean package -DskipTests         # Build JAR
./mvnw clean install                      # Install to local repo

# Testing
./mvnw test                               # Run all tests
./mvnw test -Dtest=UserServiceTest        # Run specific test

# Docker
docker build -t aurora-backend .          # Build image
docker-compose up -d                      # Start services
docker-compose logs -f                    # View logs
```

### Frontend

```bash
# Development
npm run dev                               # Start dev server
npm run build                             # Production build
npm run preview                           # Preview build
npm run lint                              # ESLint check

# Docker
docker build -t aurora-frontend .         # Build image
```

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/giasinguyen">
        <img src="https://github.com/giasinguyen.png" width="100px;" alt="Gia Sĩ"/><br />
        <sub><b>Nguyễn Trần Gia Sĩ</b></sub>
      </a><br />
      <sub>Team Lead & Backend Dev</sub>
    </td>
    <td align="center">
      <a href="https://github.com/nvminh162">
        <img src="https://github.com/nvminh162.png" width="100px;" alt="Văn Minh"/><br />
        <sub><b>Nguyễn Văn Minh</b></sub>
      </a><br />
      <sub>Frontend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/NguyenNguyen0">
        <img src="https://github.com/NguyenNguyen0.png" width="100px;" alt="Trung Nguyên"/><br />
        <sub><b>Nguyễn Trung Nguyên</b></sub>
      </a><br />
      <sub>Backend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/NguyenDuyKhai2">
        <img src="https://github.com/NguyenDuyKhai2.png" width="100px;" alt="Duy Khải"/><br />
        <sub><b>Nguyễn Duy Khải</b></sub>
      </a><br />
      <sub>Frontend Developer</sub>
    </td>
  </tr>
</table>

---

## 📖 Documentation

Xem thêm tài liệu chi tiết:

- **[📱 Frontend Documentation](./aurora-frontend/README.md)** - React, TypeScript, Vite setup
- **[⚙️ Backend Documentation](./aurora-backend/README.md)** - Spring Boot, Java, API reference
- **[📐 System Diagrams](./docs/README.md)** - Class diagrams, database schemas

---

## 📄 License

Dự án này được phát triển cho mục đích **học tập** trong môn **Lập trình WWW** tại **Trường Đại học Công nghiệp TP.HCM (IUH)**.

**© 2024-2025 Aurora Development Team. All Rights Reserved.**

---

## 🙏 Acknowledgments

- **Industrial University of Ho Chi Minh City (IUH)** - Khoa Công nghệ Thông tin
- **Giảng viên hướng dẫn** - Môn Lập trình WWW
- **Spring Framework Team** - Spring Boot, Spring Security
- **Meta/Facebook** - React
- **All Open Source Contributors**

---

<div align="center">

### ⭐ Nếu dự án hữu ích, hãy cho chúng tôi một star! ⭐

<br/>

**🌌 Aurora Hotel - Xây dựng tương lai ngành khách sạn 🌌**

<br/>

Made with ❤️ by **Aurora Development Team**

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/giasinguyen/DHKTPM18B_Nhom09_AuroraHotelSystem)

</div>


