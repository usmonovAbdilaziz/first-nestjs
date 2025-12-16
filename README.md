# First NestJS Project

This is a NestJS backend application with a modular architecture and hierarchical domain model.

## Authentication System

This application includes a complete JWT-based authentication system with role-based access control.

### Features

1. **JWT Authentication**: Secure token-based authentication
2. **Role-Based Access Control**: Different permission levels (Admin, SuperAdmin, User)
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
- Available roles: Admin, SuperAdmin, User

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
- **User**: Limited access to specific resources

### Environment Variables Required

```env
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_SECRET=your_verification_secret_key
JWT_ACCESS_TIME=15m
JWT_REFRESH_TIME=7d
```

### API Endpoints

#### Authentication

- `POST /auth/login` - User login (public)
- `POST /auth/refresh` - Refresh token (public)
- `POST /auth/logout` - Logout (authenticated)

#### Profile

- `GET /auth/profile` - Get user profile (authenticated)

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

# Muzey Inventarizatsiya Tizimi

Bu loyiha muzey inventarizatsiyasini boshqarish uchun mo'ljallangan NestJS asosidagi backend ilovasidir. Loyiha turli xil kategoriyalarga ajratilgan ob'ektlarni kuzatib borish, ularning joylashuvini aniqlash va batafsil ma'lumotlarini saqlash imkonini beradi.

## Texnologiyalar

- [NestJS](https://nestjs.com/) - Progressiv Node.js framework
- [TypeORM](https://typeorm.io/) - ORM (Object Relational Mapper)
- [PostgreSQL](https://www.postgresql.org/) - Ma'lumotlar bazasi
- [Redis](https://redis.io/) - Kesh va sessiya ma'lumotlari (ixtiyoriy)
- [Docker](https://www.docker.com/) - Konteynerlashtirish
- TypeScript - Statically typed JavaScript

## Loyiha Arxitekturasi

Loyiha quyidagi modullardan iborat:

1. **Building (Bino)** - Binolar haqida ma'lumot
2. **Category (Kategoriya)** - Asosiy kategoriyalar
3. **SubCategory (Subkategoriya)** - Kategoriyalarning ichki bo'limlari
4. **ItemObjects (Elementlar)** - Haqiqiy inventarizatsiya ob'ektlari
5. **Location (Joylashuv)** - Ob'ektlarning joylashuvi
6. **Info (Ma'lumot)** - Qo'shimcha ma'lumotlar

## O'rnatish

### Talablarni tekshirish

- Node.js (v18+)
- PostgreSQL
- Docker (ixtiyoriy)

### O'rnatish qadamlari

1. Repozitoriyani klonlash:

```bash
git clone <repository-url>
cd first-nestjs
```

2. Bog'liqliklarni o'rnatish:

```bash
npm install
```

3. `.env` faylini yaratish:

```bash
cp .env.example .env
```

4. `.env` fayliga quyidagi ma'lumotlarni kiriting:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
REDIS_HOST=localhost
REDIS_PORT=6379
```

5. Ma'lumotlar bazasini yaratish:

```bash
# PostgreSQL-da yangi ma'lumotlar bazasini yarating
createdb your_db_name
```

## Ishga tushirish

### Rivojlanish rejimida (development)

```bash
npm run start:dev
```

### Ishlab chiqarish rejimida (production)

```bash
# Build qilish
npm run build

# Ishga tushirish
npm run start:prod
```

### Docker orqali

```bash
# Barcha konteynerlarni ishga tushirish
docker-compose up -d
```

## API Endpoints

API v1 versiyasi `/api/v1` prefiksi orqali mavjud.

### Building (Binolar)

- `POST /api/v1/building` - Yangi bino yaratish
- `GET /api/v1/building` - Barcha binolarni olish
- `GET /api/v1/building/:id` - Bitta binoni olish
- `PATCH /api/v1/building/:id` - Binoni yangilash
- `DELETE /api/v1/building/:id` - Binoni o'chirish

### Category (Kategoriyalar)

- `POST /api/v1/category` - Yangi kategoriya yaratish
- `GET /api/v1/category` - Barcha kategoriyalarni olish
- `GET /api/v1/category/:id` - Bitta kategoriyani olish
- `PATCH /api/v1/category/:id` - Kategoriyani yangilash
- `DELETE /api/v1/category/:id` - Kategoriyani o'chirish

### SubCategory (Subkategoriyalar)

- `POST /api/v1/sub-category` - Yangi subkategoriya yaratish
- `GET /api/v1/sub-category` - Barcha subkategoriyalarni olish
- `GET /api/v1/sub-category/:id` - Bitta subkategoriyani olish
- `PATCH /api/v1/sub-category/:id` - Subkategoriyani yangilash
- `DELETE /api/v1/sub-category/:id` - Subkategoriyani o'chirish

### ItemObjects (Inventar ob'ektlari)

- `POST /api/v1/item-objects` - Yangi inventar ob'ektini yaratish
- `GET /api/v1/item-objects` - Barcha inventar ob'ektlarini olish
- `GET /api/v1/item-objects/:id` - Bitta inventar ob'ektini olish
- `PATCH /api/v1/item-objects/:id` - Inventar ob'ektini yangilash
- `DELETE /api/v1/item-objects/:id` - Inventar ob'ektini o'chirish

### Location (Joylashuvlar)

- `POST /api/v1/location` - Yangi joylashuv yaratish
- `GET /api/v1/location` - Barcha joylashuvlarni olish
- `GET /api/v1/location/:id` - Bitta joylashuvni olish
- `PATCH /api/v1/location/:id` - Joylashuvni yangilash
- `DELETE /api/v1/location/:id` - Joylashuvni o'chirish

### Info (Qo'shimcha ma'lumotlar)

- `POST /api/v1/info` - Yangi ma'lumot yaratish
- `GET /api/v1/info` - Barcha ma'lumotlarni olish
- `GET /api/v1/info/:id` - Bitta ma'lumotni olish
- `PATCH /api/v1/info/:id` - Ma'lumotni yangilash
- `DELETE /api/v1/info/:id` - Ma'lumotni o'chirish

## Ma'lumotlar Modeli

### Building (Bino)

- `name` - Bino nomi (enum: Asosiy, Qushimcha, Arxiv)
- `floors` - Qavatlari soni
- `rooms` - Xonalari soni
- `showcase` - Vitrina soni
- `polkas` - Polkalar soni

### Category (Kategoriya)

- `name` - Kategoriya nomi
- `description` - Tavsifi
- `statusType` - Holati (enum: Yaroqli, Yaroqsiz, Foydalanilmasin)
- `categoryNumber` - Kategoriya raqami (I-XII)
- `moved` - Ko'chirilganlar soni
- `status` - Status (enum: Yangi, Ko'chirildi)

### SubCategory (Subkategoriya)

- `category_id` - Kategoriya identifikatori
- `status` - Status (JSON ob'ekt sifatida)

### ItemObject (Inventar ob'ekti)

- `category_id` - Kategoriya identifikatori
- `name` - Nomi
- `period` - Davri
- `price` - Narxi
- `material` - Material
- `status` - Holati (enum: Qoniqarli, Qoniqarsiz)
- `fondType` - Fond turi (enum: Asosiy, Yordamchi, O'quv)

### Location (Joylashuv)

- `floor` - Qavat
- `room` - Xona
- `showcase` - Vitrina
- `polka` - Polka
- `building_id` - Bino identifikatori
- `category_id` - Kategoriya identifikatori

### Info (Ma'lumot)

- `category_id` - Kategoriya identifikatori
- `name` - Nomi
- `description` - Tavsifi
- `home` - Qo'shimcha ma'lumotlar (JSON massiv sifatida)

## Testlash

Testlarni ishga tushirish:

```bash
npm run test
```

## Linting va Formatlash

Kodni tekshirish:

```bash
npm run lint
```

Kodni formatlash:

```bash
npm run format
```

## Deploy qilish

Loyihani deploy qilish uchun quyidagi variantlardan birini tanlang:

1. **Docker orqali deploy**:

```bash
docker-compose up -d
```

2. **Manual deploy**:

```bash
npm run build
npm run start:prod
```

## Muallif

Ushbu loyiha [Sizning Ismingiz] tomonidan yaratilgan.

## Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi. Batafsil ma'lumot uchun [LICENSE](LICENSE) fayliga qarang.
