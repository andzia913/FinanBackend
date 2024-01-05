# FinanApp - Financial Management Application

## Introduction

Welcome to FinanApp, a dynamic financial management application designed to streamline the tracking and planning of your financial journey. This application is divided into a frontend and backend. The frontend, built with React and MaterialUI, provides a responsive web design (RWD) for optimal user experience. It communicates with the backend, developed using Node.js and Express, along with a MySQL relational database.

### Routers

The backend utilizes various routers to handle different functionalities:
Login and Register Router: Manages authentication.
Financial Balance Router: Handles the creation, modification, and deletion of financial records.
Category Router: Manages custom categories for organizing financial data.
Goal Router: Facilitates the creation and tracking of savings goals.


### Database Handling

Database operations are handled through instances of classes, with each class corresponding to a specific table in the database. These classes encapsulate the logic for interacting with the database and ensure seamless data handling. Routers, on the other hand, are responsible for routing and responding to different views within the application.

## Getting Started

### Prerequisites

- Node.js, npm, xampp and HeidiSQL installed on your machine.
- MySQL database set up for backend. Script SQL in file db.sql

### Installation

1. Clone the repository: `git clone https://github.com/andzia913/FinanBackend.git`
2. Navigate to the project directory: `cd FinanBackend`
3. Install dependencies: `npm install`
4. Configure the database connection in the backend configuration file `/utils/db.ts`
5. In the FinanBackend directory, create a .env file and declare a variable named SECRET_KEY, which can be any string to enable the proper functioning of verification tokens.
###Contributions
Contributions are welcome! If you have ideas for improvements or new features, feel free to fork the repository, make your changes, and submit a pull request.
