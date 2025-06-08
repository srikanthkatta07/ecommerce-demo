# Ecommerce Fullstack Webapp – Project Plan

## Tech Stack
- Backend: Spring Boot (Java 11, Maven latest)
- Database: PostgreSQL 17.5 (with Flyway for migrations)
- Frontend: Modern UI (React.js or similar, with a focus on user experience)
- Storage: AWS S3 for product images
- Auth: JWT-based authentication/authorization

## Core Functionalities

### 1. User Management
- User registration (with role: user/admin)
- JWT-based login/logout
- Dummy admin user seeded by default

### 2. Product Management
- Admin can:
  - Add/edit/delete products
  - Set product prices
  - Upload multiple images per product (stored in AWS S3)
  - Assign products to categories (e.g., electronics, fashion, vegetables)
  - View product logs (CRUD actions)
- Users can:
  - View product list with prices and images
  - Filter by category

### 3. Cart & Order
- Users can:
  - Add products to cart
  - View/update/delete cart items (update quantity, remove items)
  - Checkout to create an order (no payment integration yet)
  - View order history

### 4. Database & Migrations
- PostgreSQL schema design for users, products, categories, images, carts, orders, logs
- Flyway for versioned DB migrations

### 5. UI/UX
- Responsive, modern UI
- Product gallery with image carousel
- Intuitive cart and checkout flow
- User-friendly registration/login

### 6. Logging & Auditing
- Log admin actions on products (add/edit/delete)

---

## Next Steps
1. Design database schema and create Flyway migration scripts.
2. Scaffold Spring Boot backend with RESTful APIs for all core entities.
3. Implement JWT authentication and role-based access.
4. Integrate AWS S3 for image uploads.
5. Build frontend with registration, login, product browsing, cart, and order features.
6. Seed dummy admin user and sample products/categories.
7. Add basic logging for admin actions.
