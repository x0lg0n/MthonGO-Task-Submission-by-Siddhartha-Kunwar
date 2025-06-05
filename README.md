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

### GET /api/v1/chapters

Fetch all chapters with filtering and pagination.

**Query Parameters:**
- `class`: Filter by class
- `unit`: Filter by unit
- `status`: Filter by status
- `weakChapters`: Filter weak chapters (true/false)
- `subject`: Filter by subject
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response:**
```json
{
  "total": 100,
  "page": 1,
  "limit": 10,
  "chapters": [...]
}
```

### GET /api/v1/chapters/:id

Fetch a specific chapter by ID.

**Response:**
```json
{
  "id": "...",
  "subject": "Physics",
  "chapter": "Mechanics",
  "class": "11",
  "unit": "1",
  "yearWiseQuestionCount": {...},
  "questionSolved": 45,
  "status": "completed",
  "isWeakChapter": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### POST /api/v1/chapters

Upload chapters (admin only).

**Headers:**
- `Authorization`: Bearer [ADMIN_TOKEN]

**Body:**
- `file`: JSON file containing an array of chapter objects

**Response:**
```json
{
  "success": true,
  "message": "Chapters processed",
  "uploaded": 10,
  "failed": [...]
}
```

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