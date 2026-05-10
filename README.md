# Full-Stack Credit Card Fraud Detection System

A production-quality full-stack system designed to detect and manage credit card fraud using a React frontend, Spring Boot backend, and a Python Flask ML Service.

## Architecture

* **Frontend**: React + Vite + Tailwind CSS (Port: `5173`)
* **Backend**: Spring Boot 3 + Java 21 + Spring Security (Port: `8080`)
* **ML Service**: Python + Flask + Scikit-Learn (Port: `5000`)
* **Database**: MongoDB Atlas (Cloud NoSQL)

---

## Prerequisites

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Account & Cluster URI
- [Java 21 JDK](https://adoptium.net/) or higher
- [Maven](https://maven.apache.org/) (Or you can use the wrapper)
- [Python 3.9+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)

---

## Setup & Running Locally

### 1. Setup MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection URI (e.g. `mongodb+srv://<username>:<password>@cluster0...`).
3. Open `backend/src/main/resources/application.properties` and replace the placeholder URI with your actual connection string.

### 2. Start the ML Service (Flask API)
The ML service provides a `/predict` endpoint that the Spring Boot backend consumes to calculate fraud probability.

```bash
cd ml-service

# Create a virtual environment (optional but recommended)
python -m venv venv
# Activate it (Windows)
venv\Scripts\activate
# Or (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```
*The ML API will run on `http://localhost:5000`.*

### 3. Start the Backend Service (Spring Boot)
The Spring Boot backend handles authentication, business logic, and communication with the DB and ML service.

```bash
cd backend

# Clean and Build
.\mvnw clean install -DskipTests

# Run the Application
.\mvnw spring-boot:run
```
*The Backend API will run on `http://localhost:8080`. Swagger documentation is available at `http://localhost:8080/swagger-ui.html`.*

### 4. Start the Frontend (React + Vite)
The frontend provides a modern dashboard to view and manage transactions.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The UI will run on `http://localhost:5173`.*

---

## Features

- **JWT Authentication & RBAC**: Secure login and registration with Role-Based Access Control (Admin/User).
- **Fraud Detection Engine**: Submits transaction data to the Flask ML model API and stores the fraud probability score.
- **Modern Dashboard**: Built with React, TailwindCSS, and Recharts to visualize transaction volumes and fraud trends.
- **Transaction Management**: View recent alerts, filter transactions, and simulate new transactions through the UI.

## Deployment Notes

- **Backend**: Can be packaged into a `.jar` (`.\mvnw clean package`) and deployed to AWS Elastic Beanstalk or a cloud VPS.
- **Frontend**: Run `npm run build` to generate the production `dist` folder. Host it on Vercel, Netlify, or AWS S3.
- **ML Service**: Deploy the Flask app using a standard Python environment on AWS ECS or Heroku.
- **Database**: We use MongoDB Atlas (managed cloud database). No deployment needed for the database itself.
