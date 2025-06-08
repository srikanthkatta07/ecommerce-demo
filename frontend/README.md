# Ecommerce Frontend

This is the frontend application for the Ecommerce platform, built using React and Vite.

## Features

- **Role-based Access Control**: Admin and user roles with specific permissions.
- **Add-to-Cart Functionality**: Persistent cart using localStorage.
- **Product View**: Grid layout with stock management.
- **Category-based Filtering**: Filter products by category using a modal.
- **Responsive Design**: Optimized for various screen sizes.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ecommerce-demo.git
   cd ecommerce-demo/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

The following environment variables are required:

- `VITE_API_URL`: Base URL for the backend API.
- `VITE_AUTH_SECRET`: Secret for authentication.
- `VITE_S3_BUCKET_NAME`: AWS S3 bucket name.
- `VITE_AWS_REGION`: AWS region.
- `VITE_DEBUG`: Enable debug mode.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build.

## Project Structure

- `src/`: Contains the source code.
  - `pages/`: React components for different pages.
  - `stores/`: State management using custom stores.
  - `utils/`: Utility functions.
  - `assets/`: Static assets like images.

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Spring Boot
- **Database**: PostgreSQL
- **Cloud Storage**: AWS S3
- **Authentication**: JWT
- **State Management**: Custom React Stores
- **Styling**: CSS Modules

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries, please contact [your-email@example.com](mailto:your-email@example.com).
