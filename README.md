# Contact Management System - Client

## Overview
The Contact Management System (CMS) client is a web-based application that allows users to efficiently manage contacts. It provides a user-friendly interface to create, update, delete, and search for contacts. This frontend application is built using **React.js**, styled with **Tailwind CSS**, and interacts with the backend API for data management.

## Features
- Add, edit, delete and share contacts.
- View a list of contacts with search and filtering options.
- User authentication for secure access.
- Responsive design for a seamless experience across devices.
- Integration with the Contact Management System API.

## Tech Stack
- **Frontend Framework:** React.js
- **State Management:** React state and effect and Redux
- **Styling:** Tailwind CSS
- **API Communication:** Axios
- **Routing:** React Router
- **UI Library:** AntD

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js
- npm 

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Eugooti/contact_management_client_ebk.git
   cd contact-management-client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```

### Configuration
Create a `.env` file in the root directory and add the following:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```
Modify the API URL if your backend is hosted on a different server.

### Running the Application
To start the development server, run:
```sh
npm start
```
or
```sh
yarn start
```
The application will be available at `http://localhost:5173/`.

### Build for Development
To create an optimized production build:
```sh
npm run dev
```
or
```sh
yarn dev
```
The production-ready files will be generated in the `build` directory.

## API Integration
The client interacts with the backend API to perform CRUD operations on contacts. Ensure the backend is running and accessible via the configured `REACT_APP_API_BASE_URL`.

## Deployment
To deploy the frontend, you can use platforms like **Vercel**, **Netlify**, or **GitHub Pages**. Follow the respective documentation for deployment steps.

## Contribution
Feel free to contribute to this project by submitting issues or pull requests.

## License
This project is licensed under the MIT License.

---

Happy coding! 🚀

