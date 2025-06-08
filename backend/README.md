# Backend – ZIVDAH ONLINE GROCERY

This is the backend service for ZIVDAH ONLINE GROCERY, built with Java Spring Boot.

## Features
- User authentication & authorization
- Product, category, and order management
- Cart and checkout APIs
- PostgreSQL database
- AWS S3 integration for product images

## Requirements
- Java 17+
- Maven
- PostgreSQL

## Setup
1. Clone the repository.
2. Configure your database and AWS credentials in `src/main/resources/application.properties`.
3. Run database migrations with Flyway (auto on startup).
4. Build and run:
   ```sh
   mvn clean install
   java -jar target/backend-1.0-SNAPSHOT.jar
   ```

## API Endpoints
- `/api/auth` – Authentication
- `/api/products` – Product management
- `/api/categories` – Category management
- `/api/carts` – Cart operations
- `/api/orders` – Order management

## License
© 2025 ZIVDAH ONLINE GROCERY PRIVATE LIMITED
