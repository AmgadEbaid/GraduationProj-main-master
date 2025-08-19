# Graduation Project: E-commerce & Repair Service Marketplace

This repository contains the back-end source code for a comprehensive e-commerce and repair service marketplace, developed as a graduation project. The platform is built with NestJS and leverages a modern, scalable architecture to provide a wide range of features for users, sellers, and administrators.

## 🚀 Features

This application is packed with features designed to provide a seamless and engaging user experience:

### Core E-commerce

- **Product Management:** Create, update, and manage products with details, images, and pricing.
- **Order Processing:** A complete order workflow, from cart to checkout, with status tracking.
- **Secure Payments:** Integration with payment gateways for secure transactions.
- **Reviews and Ratings:** Users can leave reviews and ratings for products and services.
- **Search Functionality:** Advanced search with filtering and sorting options.

### User & Authentication

- **User Accounts:** User registration, login, and profile management.
- **JWT-based Authentication:** Secure authentication using JSON Web Tokens.
- **Google OAuth 2.0:** Users can sign up and log in using their Google accounts.
- **Password Management:** Secure password hashing and a "forgot password" feature with OTP verification.

### Real-time Communication

- **Live Chat:** Real-time chat between buyers and sellers using WebSockets.
- **Push Notifications:** Instant notifications for order updates, messages, and other events using Firebase Cloud Messaging.

### Services & More

- **Repair Services:** A dedicated module for users to request and manage repair services.
- **Delivery Tracking:** Real-time tracking of deliveries and shipments.
- **AWS S3 Integration:** Secure and scalable storage for product images and other media.

## 🛠️ Tech Stack

This project is built with a modern and powerful technology stack:

- **Back-end:** [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Database:** [MySQL](https://www.mysql.com/) with [TypeORM](https://typeorm.io/) - A powerful ORM for TypeScript and JavaScript.
- **Authentication:** [Passport.js](http://www.passportjs.org/) - A simple, unobtrusive authentication for Node.js.
- **Real-time:** [WebSockets (Socket.IO)](https://socket.io/) - For real-time, bidirectional and event-based communication.
- **File Storage:** [AWS S3](https://aws.amazon.com/s3/) - For scalable and secure object storage.
- **API Documentation:** [Swagger (OpenAPI)](https://swagger.io/) - For generating interactive API documentation.
- **Email:** [Nodemailer](https://nodemailer.com/) - For sending emails.
- **Notifications:** [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) - For sending push notifications.

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or later)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your_username/GraduationProj-main-master.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd GraduationProj-main-master/GraduationProj-main-master
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the necessary environment variables (e.g., database credentials, JWT secret, AWS keys).

5.  **Run database migrations:**

    ```bash
    npm run typeorm:migration:run
    ```

### Running the Application

-   **Development mode:**

    ```bash
    npm run start:dev
    ```

-   **Production mode:**

    ```bash
    npm run start:prod
    ```

## 🧪 Testing

The project includes a comprehensive suite of tests to ensure code quality and reliability.

-   **Run unit tests:**

    ```bash
    npm run test
    ```

-   **Run end-to-end tests:**

    ```bash
    npm run test:e2e
    ```

-   **View test coverage:**

    ```bash
    npm run test:cov
    ```

## 📄 API Documentation

The API documentation is automatically generated using Swagger. Once the application is running, you can access the interactive API documentation at `http://localhost:3000/api`.

## 🤝 Contributors

This project was a collaborative effort between the following students:

- [Your Name](https://github.com/your_username)
- [Your Colleague's Name](https://github.com/colleague_username)

We are proud of the work we have accomplished and the skills we have developed throughout this project.

---

