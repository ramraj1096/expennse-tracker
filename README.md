# WalletWatch

Deployment Link: http://wallet-watch-01.vercel.app/

## Table of Contents

-   [Project Description](#project-description)
-   [Objectives](#objectives)
-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Environment Variables](#environment-variables)
-   [Run Locally](#run-locally)
-   [Tech Stack](#tech-stack)
-   [Screenshots](#screenshots)

## Project Description

> Wallet Watch is an OTP secured web based application designed to assist users in tracking and managing their daily transactions. The project establishes a highly secure authentication process that mitigates common vulnerabilities associated with traditional username-password combinations. This combination ensures a robust and scalable architecture capable of handling a growing user base.

## Objectives

> -   Provide a highly secure and user-friendly authentication mechanism for public networks.
> -   Offer a secure platform for users to track their daily transactions.

## Features

> #### User Authentication
>
> -   Email Verification using OTP while register and login.
> -   Reset password using OTP when the user forgets the password.
> -   Temporary Account Blocking incase of invalid login attempt.
> -   Notifying user about invalid login attempt via email.

> #### Transaction Dashboard
>
> -   Provide a visual dashboard displaying an overview of the user's transactions.
> -   Enable users to create, update or delete any transaction.
> -   Allow users to Logout

## Technologies Used

> #### Backend
>
> -   Utilized Node.js and Express.js to build REST APIs serving as the application's backend.
> -   Engineered a secure authentication system by using the Nodemailer library, ensuring the confidential and reliable delivery of One Time Password for user authentication.
> -   Conducted comprehensive testing using Postman for optimal performance.

> #### Frontend
>
> -   Leveraged Material-UI and DevExtreme to desgin a seamless user interface for enhanced user experience.
> -   Enhanced user convenience by eliminating repeated logins using Local Storage, maintaining persistent login session.

> #### Database
>
> -   Stored all data, including user information and transaction details in MongoDB, a NoSQL database.
> -   Utilized MongoDB Atlas, a cloud based database.

> #### Deployment
>
> -   Deployed the Backend for the application on Render.
> -   Deployed the Frontend for the application on Vercel.
> -   Set up Continuous Integration and Continuous Deployment (CI/CD) pipelines for automated builds and deployments.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in backend folder create config folder and add `config.env` file in it and all env variables there.

#### Environment variables related to the email account used for sending OTPs and Notifications

If you are using gmail, enable 2 Step Verification

-   `MAIL_HOST` : Your email host, generally `smtp.gmail.com` for gmail.
-   `MAIL_USER` : Your email username
-   `MAIL_PASS` : Your email password, incase of gmail it is App Password in the 2 Step Verification of your account.

#### Server related environment variables

-   `MONGO_URL` : Your MongoDB connection string
-   `PORT` : Port number

## Run Locally

Clone the project

```bash
  git clone https://github.com/HarshBardolia01/WalletWatch.git
```

Go to the project directory

```bash
  cd WalletWatch
```

Go to the backend directory and Install dependencies

```bash
  cd backend
```

```bash
  npm install
```

Start the backend server

```bash
  npm run server
```

Go to the frontend directory and Install dependencies

```bash
  cd frontend
```

```bash
  npm install
```

Start the frontend server

```bash
  npm start
```

## Tech Stack

**Client:** React.js, Material-UI, DevExtreme

**Server:** Node.js, Express.js

**Database:** MongoDB Atlas

**Testing:** Postman

## Screenshots

### Registration

-   Send OTP

    ![Send OTP](./screenshots/register-send-otp.png)

-   Email - Register OTP

    ![Email - Register OTP](./screenshots/register-email-otp.png)

-   Register - Set Password

    ![Register - Set Password](./screenshots/register-set-password.png)

### Login

-   Enter Credentials

    ![Enter Credentials](./screenshots/login-Enter-Credentials.png)

-   Email - Login OTP

    ![Email - Login OTP](./screenshots/Login-email-OTP.png)

-   Login OTP

    ![Login OTP](./screenshots/login-OTP.png)

### Reset Password

-   Enter Email & OTP

    ![Enter Email & OTP](./screenshots/reset-enter-email-and-otp.png)

-   Email - Reset Password OTP

    ![Email - Reset Password OTP](./screenshots/reset-email-reset-password-otp.png)

### Block Unauthorized Access

-   OTP sent

    ![OTP sent](./screenshots/block-send-otp.png)

-   Incorrect OTP Entered

    ![Incorrect OTP Entered](./screenshots/block-incorrect-otp.png)

-   Email Alert to Account Holder

    ![Email Alert to Account Holder](./screenshots/block-email.png)

-   Further Login Attempts Blocked

    ![Further Login Attempts Blocked](./screenshots/block-login-attempt.png)

### HomePage

-   Home Page - No transactions

    ![Home Page - No transactions](./screenshots/home-no-transaction.png)

-   Home Page - Transaction

    ![Home Page - Transaction](./screenshots/home-all-transactions.png)

-   Add / Update Transaction

    ![Add / Update Transaction](./screenshots/home-add-update.png)

-   Delete Transaction

    ![Delete Transaction](./screenshots/home-delete.png)

## Contribution

Contributions are welcome! If you find any bugs or want to enhance the app, feel free to open issues or submit pull requests. Please make sure to follow the coding standards and guidelines.

Happy coding! If you have any questions or need assistance, don't hesitate to reach out.

## Designed and Implemented By

### Harsh Bardolia

-   [Github](https://github.com/HarshBardolia01)
-   [LinkedIn](https://www.linkedin.com/in/harsh-bardolia-0a0407217/)

### Khushali Vaidya

-   [Github](https://github.com/khushalivaidya)
-   [LinkedIn](https://www.linkedin.com/in/khushalivaidya/)
