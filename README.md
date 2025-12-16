# Museum Inventory Management System

This is a NestJS backend application for managing museum inventory with a modular architecture and hierarchical domain model. The system tracks objects across various categories, locations, and buildings within a museum.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Authentication System](#authentication-system)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Example Data](#example-data)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## Features

1. **Complete CRUD Operations** - Full Create, Read, Update, Delete functionality for all entities
2. **Hierarchical Data Management** - Organize items by Building → Category → SubCategory → ItemObject
3. **Location Tracking** - Track items by floor, room, showcase, and shelf
4. **JWT Authentication** - Secure token-based authentication with role-based access control
5. **Data Validation** - Comprehensive input validation using class-validator
6. **Database Seeding** - Automatic creation of super admin user on application startup
7. **Docker Support** - Containerized deployment with PostgreSQL and Redis
8. **RESTful API** - Well-structured REST API with consistent responses

## Technologies

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM (Object Relational Mapper)
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Redis](https://redis.io/) - Cache and session storage (optional)
- [Docker](https://www.docker.com/) - Containerization
- [TypeScript](https://www.typescriptlang.org/) - Statically typed JavaScript
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication

## Architecture

The application follows a modular architecture with the following modules:

1. **Building** - Information about museum buildings
2. **Category** - Main categories for organizing items
3. **SubCategory** - Subdivisions within categories
4. **ItemObjects** - Actual inventory objects
5. **Location** - Physical locations of items
6. **Info** - Additional information about items
7. **History** - Movement and change history of items
8. **Auth** - Authentication and authorization
9. **Admin** - Administrative functions and user management

## Authentication System

This application includes a complete JWT-based authentication system with role-based access control.

### Features

1. **JWT Authentication**: Secure token-based authentication
2. **Role-Based Access Control**: Different permission levels (Admin, SuperAdmin)
3. **Route Protection**: Automatic protection of all routes with optional public access
4. **Custom Guards**: Flexible authorization mechanisms

### How It Works

#### 1. Login Process

- Users send credentials to `/auth/login`
- Server validates credentials and generates JWT token
- Token is returned to client for subsequent requests

#### 2. Token Usage

- Client includes token in Authorization header: `Bearer <token>`
- All requests (except explicitly marked public) require valid token

#### 3. Role-Based Access

- Routes can be protected by specific roles using `@Roles()` decorator
- Available roles: Admin, SuperAdmin

### Available Decorators

#### `@Public()`

Makes a route accessible without authentication:

```typescript
@Post('login')
@Public()
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

#### `@Roles(...)`

Restricts access to specific user roles:

```typescript
@Post()
@Roles(RoleUser.SUPERADMIN)
create(@Body() createAdminDto: CreateAdminDto) {
  return this.adminService.create(createAdminDto);
}
```

### Role Permissions

- **SuperAdmin**: Can create/delete admins, access all resources
- **Admin**: Can manage most resources except other admins

### Environment Variables Required

```env
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_TIME=15m
JWT_REFRESH_TIME=7d
```

### API Endpoints

#### Authentication

- `POST /auth/login` - User login (public)
- `GET /auth/me` - Get authenticated user profile

### Adding Authentication to New Controllers

1. By default, all routes are protected
2. Use `@Public()` decorator to make routes accessible without authentication
3. Use `@Roles(role1, role2, ...)` to restrict access to specific roles

Example:

```typescript
@Controller('items')
export class ItemsController {
  @Get() // Protected - requires valid token
  findAll() {
    return this.itemsService.findAll();
  }

  @Post() // Only SuperAdmins can access
  @Roles(RoleUser.SUPERADMIN)
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Get('public') // Accessible without authentication
  @Public()
  publicItems() {
    return this.itemsService.findPublicItems();
  }
}
```

## Installation

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Docker (optional)

### Setup Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd first-nestjs
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Configure the `.env` file with your settings:

```env
# Application configuration
PORT=3000
NODE_ENV=development

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Super admin user (created automatically on first startup)
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASS=secure_password
SUPER_ADMIN_NAME=Super Administrator

# JWT configuration
JWT_ACCESS_SECRET=your_secure_access_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret
JWT_ACCESS_TIME=1h
JWT_REFRESH_TIME=7d
```

5. Create database:

```bash
# Create a new PostgreSQL database
createdb your_db_name
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
# Build the application
npm run build

# Run in production mode
npm run start:prod
```

### Using Docker

```bash
# Start all services (application, PostgreSQL, Redis)
docker-compose up -d
```

## API Documentation

All API endpoints are prefixed with `/api/v1`.

### Authentication Endpoints

- `POST /api/v1/auth/login` - Authenticate user and receive JWT token
- `GET /api/v1/auth/me` - Get authenticated user information

### Admin Endpoints

- `POST /api/v1/admin` - Create new admin (SuperAdmin only)
- `GET /api/v1/admin` - Get all admins
- `GET /api/v1/admin/:id` - Get specific admin
- `PATCH /api/v1/admin/:id` - Update admin
- `DELETE /api/v1/admin/:id` - Delete admin (SuperAdmin only)

### Building Endpoints

- `POST /api/v1/building` - Create new building
- `GET /api/v1/building` - Get all buildings
- `GET /api/v1/building/:id` - Get specific building
- `PATCH /api/v1/building/:id` - Update building
- `DELETE /api/v1/building/:id` - Delete building

### Category Endpoints

- `POST /api/v1/category` - Create new category
- `GET /api/v1/category` - Get all categories
- `GET /api/v1/category/:id` - Get specific category
- `PATCH /api/v1/category/:id` - Update category
- `DELETE /api/v1/category/:id` - Delete category

### SubCategory Endpoints

- `POST /api/v1/sub-category` - Create new sub-category
- `GET /api/v1/sub-category` - Get all sub-categories
- `GET /api/v1/sub-category/:id` - Get specific sub-category
- `PATCH /api/v1/sub-category/:id` - Update sub-category
- `DELETE /api/v1/sub-category/:id` - Delete sub-category

### Item Objects Endpoints

- `POST /api/v1/item-objects` - Create new item object
- `GET /api/v1/item-objects` - Get all item objects
- `GET /api/v1/item-objects/:id` - Get specific item object
- `PATCH /api/v1/item-objects/:id` - Update item object
- `DELETE /api/v1/item-objects/:id` - Delete item object

### Location Endpoints

- `POST /api/v1/location` - Create new location
- `GET /api/v1/location` - Get all locations
- `GET /api/v1/location/:id` - Get specific location
- `PATCH /api/v1/location/:id` - Update location
- `DELETE /api/v1/location/:id` - Delete location

### Info Endpoints

- `POST /api/v1/info` - Create new info record
- `GET /api/v1/info` - Get all info records
- `GET /api/v1/info/:id` - Get specific info record
- `PATCH /api/v1/info/:id` - Update info record
- `DELETE /api/v1/info/:id` - Delete info record

### History Endpoints

- `POST /api/v1/history` - Create new history record
- `GET /api/v1/history` - Get all history records
- `GET /api/v1/history/:id` - Get specific history record
- `PATCH /api/v1/history/:id` - Update history record
- `DELETE /api/v1/history/:id` - Delete history record

## Database Schema

### Admin

- `id` - Auto-generated primary key
- `email` - Unique email address
- `name` - User's name
- `password` - Hashed password
- `role` - User role (Admin, SuperAdmin)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Building

- `id` - Auto-generated primary key
- `name` - Building name (enum: Main, Additional, Archive)
- `floors` - Number of floors
- `rooms` - Number of rooms
- `showcases` - Number of showcases
- `shelves` - Number of shelves

### Category

- `id` - Auto-generated primary key
- `name` - Category name
- `description` - Description
- `statusType` - Status type (enum: Suitable, Unsuitable, DoNotUse)
- `categoryNumber` - Category number (I-XII)
- `moved` - Number of moved items
- `status` - Status (enum: New, Moved)

### SubCategory

- `id` - Auto-generated primary key
- `categoryId` - Foreign key to Category
- `status` - Status (JSON object)

### ItemObject

- `id` - Auto-generated primary key
- `categoryId` - Foreign key to Category
- `name` - Object name
- `period` - Historical period
- `price` - Estimated price
- `material` - Material composition
- `status` - Condition status (enum: Satisfactory, Unsatisfactory)
- `fondType` - Fund type (enum: Main, Auxiliary, Educational)

### Location

- `id` - Auto-generated primary key
- `floor` - Floor number
- `room` - Room number
- `showcase` - Showcase number
- `shelf` - Shelf number
- `buildingId` - Foreign key to Building
- `categoryId` - Foreign key to Category

### Info

- `id` - Auto-generated primary key
- `categoryId` - Foreign key to Category
- `name` - Information name
- `description` - Description
- `details` - Additional details (JSON array)

### History

- `id` - Auto-generated primary key
- `itemId` - Foreign key to ItemObject
- `reason` - Reason for change (enum: ExhibitionChange, Renovation, Restoration, Safety, TourExhibition, Storage, Other)
- `description` - Description of changes
- `date` - Date of change

## Example Data

When the application starts for the first time, it automatically creates a super admin user based on the environment variables:

```env
SUPER_ADMIN_EMAIL=admin@gmail.com
SUPER_ADMIN_PASS=admin
SUPER_ADMIN_NAME=superadmin
```

### Sample API Requests

#### 1. Login as Super Admin

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "admin"
  }'
```

Response:

```json
{
  "statusCode": 200,
  "message": "success",
  "data": {
    "admin": {
      "id": 1,
      "email": "admin@gmail.com",
      "name": "superadmin",
      "role": "Superadmin",
      "createdAt": "2025-12-16T10:30:00.000Z",
      "updatedAt": "2025-12-16T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Create a New Building

```bash
curl -X POST http://localhost:3000/api/v1/building \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Main",
    "floors": 3,
    "rooms": 15,
    "showcases": 45,
    "shelves": 120
  }'
```

#### 3. Create a New Category

```bash
curl -X POST http://localhost:3000/api/v1/category \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Archaeology",
    "description": "Ancient artifacts and archaeological findings",
    "statusType": "Suitable",
    "categoryNumber": "I",
    "moved": 0,
    "status": "New"
  }'
```

#### 4. Create a New Item Object

```bash
curl -X POST http://localhost:3000/api/v1/item-objects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "categoryId": 1,
    "name": "Ancient Vase",
    "period": "Bronze Age",
    "price": 5000,
    "material": "Clay",
    "status": "Satisfactory",
    "fondType": "Main"
  }'
```

#### 5. Get All Items

```bash
curl -X GET http://localhost:3000/api/v1/item-objects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Testing

Run tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:cov
```

## Deployment

### Docker Deployment

1. **Using Docker Compose** (Recommended):

```bash
docker-compose up -d
```

This will start:

- The NestJS application on port 3000
- PostgreSQL database on port 5432
- Redis cache on port 6379

### Manual Deployment

1. **Build the application**:

```bash
npm run build
```

2. **Run in production mode**:

```bash
npm run start:prod
```

### Environment Configuration for Production

Ensure all environment variables are properly set in production:

```env
# Application
PORT=3000
NODE_ENV=production

# Database
DB_HOST=your_production_db_host
DB_PORT=5432
DB_USERNAME=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=your_production_db_name

# Security
JWT_ACCESS_SECRET=your_production_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.
