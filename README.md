# School Management API

A Node.js + Express.js + MySQL backend for managing school data.

## Features

- Add a new school
- List schools sorted by proximity to a user's location

## Tech Stack

- Node.js
- Express.js
- MySQL

## Project Structure

```bash
school-management-api/
├── config/
│   └── db.js
├── controllers/
│   └── schoolController.js
├── routes/
│   └── schoolRoutes.js
├── .env
├── .gitignore
├── package.json
└── server.js
```
## API Endpoints

1. Add School
   POST /addschool
```bash
Request body:
{
  "name": "Green Valley School",
  "address": "Noida Sector 12",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

2. List Schools
```bash 
GET /listSchools?latitude=28.7041&longitude=77.1025
```
Returns schools sorted by distance from the user's location.


## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/school-management-api.git
```
2. Install dependencies
```bash 
npm install cors dotenv mysql
```
3. Create .env file
```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```
4. Run the server
```bash
npm run dev
```

## Database Schema
```bash
CREATE TABLE schools ( 
  id INT AUTO_INCREMENT PRIMARY KEY, 
  name VARCHAR(255) NOT NULL, 
  address VARCHAR(255) NOT NULL, 
  latitude FLOAT NOT NULL, 
  longitude FLOAT NOT NULL 
  );
```
