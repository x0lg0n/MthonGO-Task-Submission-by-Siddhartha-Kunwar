# MathonGO Backend Task Submission by Siddhartha Kunwar

A RESTful API for managing educational chapters with MongoDB, Redis caching, and rate limiting.

## Features

- **MongoDB with Mongoose**: Robust data storage and schema validation
- **Redis Caching**: Improved performance with Redis caching for API responses
- **Rate Limiting**: Protection against abuse with Redis-based rate limiting
- **RESTful API**: Well-structured endpoints for chapter management
- **Filtering & Pagination**: Advanced query capabilities for chapters

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Redis
- Express Rate Limit with Redis Store

## API Endpoints

### Chapters

1. **GET /api/v1/chapters**
   - Description: Fetch all chapters with optional filtering and pagination
   - Query Parameters:
     - `class`: Filter by class (e.g., "Class 11")
     - `unit`: Filter by unit
     - `status`: Filter by status
     - `weakChapters`: Filter weak chapters (true/false)
     - `subject`: Filter by subject
     - `page`: Page number (default: 1)
     - `limit`: Number of items per page (default: 10)
   - Response: JSON object with total count, page info, and chapters array

2. **GET /api/v1/chapters/:id**
   - Description: Fetch a specific chapter by ID
   - Response: JSON object with chapter details

3. **POST /api/v1/chapters**
   - Description: Upload chapters (admin only)
   - Authentication: Admin token required in Authorization header
   - Request: Multipart form with file field containing JSON array of chapters
   - Response: JSON object with upload status

4. **GET /api/v1/chapters/user-stats**
   - Description: Get user-specific chapter statistics
   - Authentication: JWT token required in Authorization header
   - Response: JSON object with user statistics

### Authentication

1. **POST /api/v1/auth/login**
   - Description: Login and get JWT token
   - Request Body: `{ "username": "admin", "password": "password" }`
   - Response: `{ "success": true, "token": "your-jwt-token" }`

2. **GET /api/v1/auth/verify**
   - Description: Verify JWT token
   - Authentication: JWT token required in Authorization header
   - Response: `{ "success": true, "user": { "id": 1, "username": "admin", "role": "admin" } }`

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_USERNAME=your_redis_username
   REDIS_PASSWORD=your_redis_password
   PORT=3000
   ADMIN_TOKEN=your_admin_token
   ```
4. Start the server:
   ```
   npm run dev
   ```

## Testing with Mock Data

This project includes several tools to test the API with the provided mock data:

### 1. Using the Node.js Test Script

Run the test script to automatically test all API endpoints with the mock data:

```bash
# First install the required dependencies
npm install axios form-data

# Then run the test script
node test-api.js
```

This script will:
- Upload the mock data to the API
- Test fetching all chapters
- Test fetching chapters with filters
- Test fetching a specific chapter by ID

### 2. Using Postman

Import the provided Postman collection:

1. Open Postman
2. Click on "Import" and select the `MathonGO-API.postman_collection.json` file
3. Set the collection variables:
   - `baseUrl`: `http://localhost:3000/api/v1`
   - `adminToken`: Your admin token from the .env file
4. Use the collection to test the API endpoints

### 3. Using the Web Interface

A simple HTML-based API tester is included:

1. Start the server with `npm run dev`
2. Open the `api-tester.html` file in your browser
3. Use the interface to test the different API endpoints

### 4. Using cURL

You can also test the API using cURL commands:

```bash
# Get all chapters
curl http://localhost:3000/api/v1/chapters

# Get chapters with filters
curl "http://localhost:3000/api/v1/chapters?class=Class%2011&subject=Physics&weakChapters=true"

# Get a specific chapter by ID
curl http://localhost:3000/api/v1/chapters/[chapter-id]

# Upload chapters (replace YOUR_ADMIN_TOKEN with your actual token)
curl -X POST \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@mockdata.txt" \
  http://localhost:3000/api/v1/chapters
```

## Security Considerations

- The API uses a simple token-based authentication for admin endpoints
- Rate limiting is implemented to prevent abuse
- Sensitive data is not exposed in responses

## Performance Optimizations

- Redis caching for frequently accessed data
- Pagination to limit response size
- Efficient MongoDB queries with proper indexing

## Future Improvements

- Implement JWT authentication for more secure access control
- Add more comprehensive error handling and logging
- Implement unit and integration tests
- Add Swagger documentation for API endpoints


## Authentication

The application supports two types of authentication:

### 1. JWT Authentication

JSON Web Token (JWT) authentication is used for regular user authentication.

- **Login Endpoint**: `POST /api/v1/auth/login`
  - Request body: `{ "username": "admin", "password": "password" }`
  - Response: `{ "success": true, "token": "your-jwt-token" }`

- **Verify Token Endpoint**: `GET /api/v1/auth/verify`
  - Headers: `Authorization: Bearer your-jwt-token`
  - Response: `{ "success": true, "user": { "id": 1, "username": "admin", "role": "admin" } }`

### 2. Admin Token Authentication

A simple token-based authentication is used for admin-only endpoints.

- **Admin-Protected Endpoints**: Currently only the chapter upload endpoint
  - Headers: `Authorization: Bearer your-admin-token`
  - The admin token is set in the `.env` file as `ADMIN_TOKEN`

### Testing Authentication

A test script is provided to demonstrate how to use both authentication methods:

```bash
node test-auth.js
```

This script will:
1. Attempt to login and get a JWT token
2. Verify the JWT token
3. Test accessing an admin-protected endpoint using the admin token