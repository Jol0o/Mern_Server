# Book Review Platform - Server Setup

## Overview

This repository contains the server for the Book Review Platform. It is built with Node.js, Express, and MongoDB, and includes functionality for user authentication, book review management, and file uploads.

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (locally installed or a cloud instance like MongoDB Atlas)
- **Git** (for version control)
- **Postman** (optional, for API testing)

## Getting Started

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/Jol0o/Mern_Server.git
cd Mern_Server
```
### 2. Install all dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Run Database Migrations 

```bash
npm run migrate
```

### 4. Run the server

```bash
npm run dev
```
