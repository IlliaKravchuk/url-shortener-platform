# URL Shortener Platform

A full-stack production-ready URL Shortener built with **ASP.NET Core 8** and **Angular 17**.

## 🚀 Features
* **Role-based Access Control (RBAC):** JWT-based authentication supporting `Admin` and `User` roles.
* **Smart URL Shortening:** High-performance Base62 encoding algorithm.
* **Redirection & Tracking:** Automatically redirects to original URLs and tracks click statistics.
* **Access Levels:** 
  - **Anonymous:** Can read the "About" page, view the public list of URLs, and use short links.
  - **Authorized Users:** Can create short links and view their detailed statistics. Can only edit/delete their own links.
  - **Administrators:** Can manage (edit/delete) all links in the system and edit the Base62 algorithm description on the "About" page.

## 🛠 Tech Stack
* **Backend:** C#, ASP.NET Core 8 Web API, Entity Framework Core (In-Memory for testing), xUnit
* **Frontend:** Angular 17 (Standalone Components), SCSS, RxJS

## 🏃‍♂️ How to Run Locally

### 1. Backend (API)
1. Navigate to the backend directory:
   ```bash
   cd backend/UrlShortener.Api
   ```
2. Run the application:
   ```bash
   dotnet run
   ```
3. The API will start (default port: `http://localhost:5260`). Swagger UI is available at `/swagger`.
4. *To run unit tests:* `dotnet test`

### 2. Frontend (UI)
1. Navigate to the frontend directory:
   ```bash
   cd url-shortener-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```
4. Open your browser and navigate to `http://localhost:4200`

## 🔐 Test Accounts (Role-Based Access)

Since the application uses an In-Memory database, it resets on every restart. 
To test the **Administrator** features, simply register a new account with the following specific email:

* **Email:** `admin@ukr.net`
* **Password:** *(any valid password, e.g., Password123!)*

The system will automatically recognize this email and grant **Admin** privileges, allowing you to:
* Edit the Base62 algorithm description on the About page.
* Edit or delete *any* user's shortened URLs.

To test standard **User** features, register with any other email address.
