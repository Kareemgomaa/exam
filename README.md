# Course Enrollment System Backend

A robust backend API for a Course Management System built with Node.js, Express.js, and MongoDB. This system manages authentication, user roles, course creation, and student enrollments.

## 🚀 Features

- **Authentication & Authorization**: Secure login and signup using JWT (JSON Web Tokens) with role-based access control (User/Admin).
- **User Management**: Handle user profiles and data.
- **Course Management**: Create, update, and list educational courses.
- **Enrollment System**:
  - Students can enroll in specific courses.
  - Validation to prevent duplicate enrollments.
  - View list of enrolled courses per student.
- **Sessions & Questions**: Modules to manage course sessions and Q&A (inferred from architecture).

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (JSON Web Token)

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <project-folder>
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    DB_CONNECTION_STRING=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Run the Server:**
    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm start
    ```

## 🔌 API Endpoints

### Enrollment Module

#### 1. Enroll in a Course
- **Endpoint**: `POST /enroll/course-enroll/:courseId`
- **Access**: Authenticated Users
- **Description**: Enrolls the logged-in user into the specified course.
- **Checks**:
  - Verifies Course existence.
  - Verifies User existence.
  - Prevents duplicate enrollment.

#### 2. View Enrolled Courses
- **Endpoint**: `GET /enroll/courses-enroll`
- **Access**: Authenticated Users
- **Description**: Returns a list of all courses the user is currently enrolled in.

### Other Modules (Overview)

- **Auth**: `/auth/login`, `/auth/signup`
- **User**: `/user` (Profile management)
- **Course**: `/course` (Course CRUD operations)
- **Admin**: `/admin` (Administrative tasks)

## 📂 Project Structure

```
src/
├── dataBase/           # Database connection and Models
│   ├── connection.js
│   └── model/
├── middleware/         # Auth and Role middlewares
├── module/             # Feature-based modules
│   ├── authModule/
│   ├── courseModule/
│   ├── enrollmentModule/
│   └── ...
├── utils/              # Helper functions
├── app.controller.js   # App setup and routing
└── main.js             # Entry point
```
