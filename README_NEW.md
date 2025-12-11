# Museum Data Management System

## <p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A modern, efficient Node.js framework for storing and managing museum data.</p>

## About the Project

This project is designed to manage museum exhibits, categories, buildings, and their interrelationships. Built on the [NestJS](https://nestjs.com/) framework, it uses the following technologies:

- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL (TypeORM)
- **Validation**: class-validator
- **Configuration**: @nestjs/config
- **Error Handling**: Custom exception filter

## Project Structure

```
src/
├── Roles/                 # Enums (constant values)
├── building/              # Building module
│   ├── dto/               # Data Transfer Objects
│   ├── entities/          # Database models
│   ├── building.controller.ts
│   ├── building.module.ts
│   └── building.service.ts
├── category/              # Category module
├── info/                  # Information module
├── item-objects/          # Exhibits module
├── sub-category/          # Subcategory module
├── location/              # Location module
├── utils/                 # Helper functions
├── exceptions/            # Error handling
├── app.module.ts          # Main module
└── main.ts                # Application entry point
```

## Data Model

### Core Entities

1. **Category** - Main category of exhibits
2. **ItemObject** - Museum exhibit
3. **Building** - Museum building
4. **SubCategory** - Internal division of categories
5. **Info** - Information about category history
6. **Location** - Physical location of exhibits in buildings

### Relationships

- Each `ItemObject` belongs to one `Category`
- Each `Building` is associated with one `Category`
- Each `SubCategory` is linked to one `Category`
- Each `Info` is connected to one `Category`
- Each `Location` connects `Category`, `Building`, and physical coordinates (floor, room, showcase, shelf)

## API Endpoints

All API endpoints are under the `api/v1/` prefix.

### Base Modules CRUD Operations

Each module supports the following standard CRUD operations:

- `POST /` - Create new object
- `GET /` - Get all objects
- `GET /:id` - Get object by ID
- `PATCH /:id` - Update object
- `DELETE /:id` - Delete object

### Detailed Endpoints

#### Category Module (`/category`)
- `POST /category` - Create new category
- `GET /category` - Get all categories
- `GET /category/:id` - Get category by ID
- `PATCH /category/:id` - Update category
- `DELETE /category/:id` - Delete category

#### Building Module (`/building`)
- `POST /building` - Create new building
- `GET /building` - Get all buildings
- `GET /building/:id` - Get building by ID
- `PATCH /building/:id` - Update building
- `DELETE /building/:id` - Delete building

#### Item Objects Module (`/item-objects`)
- `POST /item-objects` - Create new exhibit
- `GET /item-objects` - Get all exhibits
- `GET /item-objects/:id` - Get exhibit by ID
- `PATCH /item-objects/:id` - Update exhibit
- `DELETE /item-objects/:id` - Delete exhibit

#### Sub Category Module (`/sub-category`)
- `POST /sub-category` - Create new subcategory
- `GET /sub-category` - Get all subcategories
- `GET /sub-category/:id` - Get subcategory by ID
- `PATCH /sub-category/:id` - Update subcategory
- `DELETE /sub-category/:id` - Delete subcategory

#### Location Module (`/location`)
- `POST /location` - Create new location
- `GET /location` - Get all locations
- `GET /location/:id` - Get location by ID
- `PATCH /location/:id` - Update location
- `DELETE /location/:id` - Delete location

## Request Data Structures

### Create Category
```json
{
  "name": "Art", // Archaeology, Art, Ethnography, Documents, Natural, Numismatics
  "categoryNumber": "VI",
  "statusType": "Valid",
  "description": "unique design"
}
```

### Create Building
```json
{
  "name": "Archive",
  "floors": 15,
  "rooms": 20,
  "showcase": 20,
  "polkas": 14
}
```

### Create Item Object (Exhibit)
```json
{
  "category_id": 2,
  "name": "Bukhara dinar",
  "fondType": "Auxiliary",
  "material": "gold",
  "period": 1880,
  "price": "50000",
  "status": "Unsatisfactory"
}
```

### Create Sub Category
```json
{
  "category_id": 2,
  "status": [{"key": "stone"}, {"key": "Coin"}]
}
```

### Create Location
```json
{
  "category_id": 2,
  "building_id": 1,
  "floor": 14,
  "room": 20,
  "showcase": 20,
  "polka": 12
}
```

## Recommended Request Order

To maintain data integrity, follow this order when creating related entities:

1. **Create Category First**:
   - `POST /category` - Create base category

2. **Create Building** (optional):
   - `POST /building` - Create building associated with category

3. **Add Exhibits**:
   - `POST /item-objects` - Add exhibits to category

4. **Define Locations**:
   - `POST /location` - Set physical locations for exhibits

5. **Create Subcategories** (optional):
   - `POST /sub-category` - Create subcategories for detailed classification

## Update Sequences

### Category Updates
- `moved` value increments by 1
- `status` changes to "Moved"
- Old data saved to `history` array
- New record created in `info` table

### Other Object Updates
- Standard update operation is performed

## Installation and Running

### Install Dependencies

```bash
$ npm install
```

### Run Application

```bash
# Development mode
$ npm run start

# Watch mode (automatically restarts when files change)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

### Run Tests

```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Configuration

The application requires the following environment variables:

- `DB_HOST` - Database server
- `DB_PORT` - Database port
- `DB_USERNAME` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `PORT` - Application port

## Technical Features

### Clean Code Principles

1. **Modular Separation** - Each module handles its own responsibilities
2. **Single Responsibility Principle** - Each class has one responsibility
3. **Dependency Injection** - Dependencies are automatically managed
4. **Error Handling** - Centralized error processing
5. **DTO (Data Transfer Objects)** - Special objects for data transfer
6. **Entity Relationships** - Database table relationships

### Validation

All incoming data is validated using `class-validator`.

### Error Handling

Centralized `HttpExceptionFilter` returns all errors in a standard format.

## Project Architecture

```
Client -> Controller -> Service -> Repository -> Database
                ↓         ↓          ↓
           Validation  Business    TypeORM
                       Logic      Entities
```

## Contact

If you have any questions, you can contact via [GitHub Issues](https://github.com/your-repo/issues).