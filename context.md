# Project Context: StudyNotion

## Overview
StudyNotion is an EdTech (Education Technology) web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It is a platform where instructors can create and publish courses, manage course content (sections/subsections/videos), and track earnings and student enrollments. Students can browse catalogs, purchase/enroll in courses via Razorpay payment gateway integration, view course video materials, track completion progress, and leave ratings and reviews.

---

## Technical Architecture & Stack

### Frontend
- **Framework**: React 18 (bootstrapped with React Scripts / Create React App)
- **Styling**: Tailwind CSS, Vanilla CSS (`App.css`), React Icons
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
  - **Slices**: `authSlice`, `cartSlice`, `courseSlice`, `profileSlice`, `viewCourseSlice`
- **Routing**: `react-router-dom` v6
- **Form Handling**: `react-hook-form`
- **Notifications**: `react-hot-toast`
- **Media & Analytics**: `video-react`, `chart.js`, `react-chartjs-2`, `swiper`, `react-rating-stars-component`, `react-otp-input`, `react-type-animation`, `@ramonak/react-progress-bar`

### Backend
- **Runtime & Framework**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with cookie-parser & bcrypt encryption
- **File & Media Storage**: Cloudinary (integrated with `express-fileupload`)
- **Email Service**: Nodemailer (sending OTP emails, password reset tokens, purchase confirmations)
- **Payment Processing**: Razorpay API
- **Avatar Generation**: DiceBear API (automatic profile avatar generation)

---

## Directory Structure

```
StudyNotion/
├── public/                 # Static public assets & HTML template
├── server/                 # Express backend server
│   ├── config/             # DB, Cloudinary, and Razorpay configuration
│   ├── controllers/        # Request handlers (Auth, Course, Profile, Payments, Category, etc.)
│   ├── mail/               # Email HTML templates (OTP, reset password, etc.)
│   ├── middleware/         # Auth middlewares (isAuth, isStudent, isInstructor, isAdmin)
│   ├── models/             # Mongoose schemas (User, Course, Profile, Section, Subsection, OTP, etc.)
│   ├── routes/             # Express API routes (User, Course, Profile, Payments, Contact)
│   ├── utils/              # Helper utilities (mailSender, imageUploader)
│   ├── index.js            # Server entry point
│   └── package.json        # Backend dependencies & scripts
├── src/                    # React frontend application
│   ├── assets/             # Images, icons, logos, videos
│   ├── components/         # Reusable UI components
│   │   ├── Common/         # Navbar, Footer, ConfirmationModal, IconBtn, ReviewSlider, RatingStars
│   │   └── core/           # Feature components (Auth, Catalog, Course, Dashboard, HomePage, ViewCourse)
│   ├── data/               # Static data (navbar links, footer links, homepage data, dashboard links)
│   ├── hooks/              # Custom React hooks (useOnClickOutside)
│   ├── pages/              # Top-level views (Home, About, Contact, Catalog, CourseDetails, Dashboard, ViewCourse, Auth pages)
│   ├── reducer/            # Root Redux reducer combining all slices
│   ├── services/           # API integration services (axios connectors, endpoints, API calls)
│   │   └── operations/     # API handler functions for Auth, Course, Profile, Settings, Payments
│   ├── slices/             # Redux state slices (auth, cart, course, profile, viewCourse)
│   ├── utils/              # Frontend helpers (constants, avgRating, secToDuration)
│   ├── App.css             # Main styling definitions & utilities
│   ├── App.jsx             # React app route definitions & main layout
│   └── index.js            # Frontend entry point
├── package.json            # Main project dependencies & client/server scripts
├── tailwind.config.js      # Tailwind CSS setup
└── README.md               # Original project description & documentation
```

---

## Data Models & Schema Overview

- **User**: Name, Email, Password, AccountType (`Student` / `Instructor` / `Admin`), AdditionalDetails (ref: `Profile`), Courses (ref: `Course` array), Image, Token, ResetPasswordExpires, CourseProgress (ref: `CourseProgress` array)
- **Profile**: Gender, DateOfBirth, About, ContactNumber
- **Course**: CourseName, CourseDescription, Instructor (ref: `User`), WhatYouWillLearn, CourseContent (ref: `Section` array), RatingAndReviews (ref: `RatingAndReview` array), Price, Thumbnail, Tag, Category (ref: `Category`), StudentsEnroled (ref: `User` array), Instructions, Status (`Draft`/`Published`), CreatedAt
- **Section**: SectionName, SubSection (ref: `Subsection` array)
- **Subsection**: Title, TimeDuration, Description, VideoUrl
- **Category**: Name, Description, Courses (ref: `Course` array)
- **CourseProgress**: CourseID (ref: `Course`), CompletedVideos (ref: `Subsection` array)
- **RatingAndReview**: User (ref: `User`), Rating, Review, Course (ref: `Course`)
- **OTP**: Email, OTP, CreatedAt (with auto-expire TTL index and pre-save email dispatch)

---

## Key Features

1. **Authentication & Authorization**:
   - Role-based access control (Student, Instructor, Admin).
   - OTP verification via email during registration.
   - JWT authentication stored in HTTP-only cookies / local storage.
   - Password reset via secure token links sent via email.

2. **Instructor Workflow**:
   - Course creation wizard (Course Details -> Builder -> Publish Settings).
   - Dynamic creation and management of Sections & Subsections with video uploads (Cloudinary).
   - Instructor Dashboard displaying total earnings, total enrolled students, and visual chart analytics.

3. **Student Workflow**:
   - Explore courses by category and dynamic search/catalog filtering.
   - Course detail views with expandable curriculum overview and instructor info.
   - Add courses to cart and purchase via Razorpay checkout integration.
   - Enrolled course viewer (`ViewCourse` sidebar & player) with video progress tracking.

4. **Review & Rating System**:
   - Enrolled students can rate and review completed/purchased courses.
   - Global review carousel/slider on public pages.

---

## Environment & Configuration Requirements

### Server `.env` Configuration
- `PORT`: Server port (e.g., `4000`)
- `MONGODB_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`: SMTP config for Nodemailer
- `FOLDER_NAME`: Cloudinary folder destination
- `CLOUD_NAME`, `API_KEY`, `API_SECRET`: Cloudinary API credentials
- `RAZORPAY_KEY`, `RAZORPAY_SECRET`: Razorpay API credentials

---

## Tally of Changes / Change Log

| # | Date / Time | Component / File | Description of Changes | Author / Source |
|---|-------------|------------------|------------------------|-----------------|
| 1 | 2026-06-26 | Core Codebase | Initial project commit. | shreya-agl005 |
| 2 | 2026-08-14 | `server/config/database.js` | Updated Mongoose connection options (removed deprecated `useNewUrlParser` and `useUnifiedTopology`). | Workspace |
| 3 | 2026-08-14 | `server/controllers/Auth.js` | Fixed approval status logic during instructor/student registration (`accountType === "Instructor"` check). | Workspace |
| 4 | 2026-08-14 | `server/models/OTP.js` | Fixed hook comment to match `.pre("save")` behavior. | Workspace |
| 5 | 2026-08-14 | `README.md` | Updated author details to Shreya Agarwala. | Workspace |
| 6 | 2026-08-14 | [`context.md`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/context.md) | Created master project context documentation and change tracking tally. | Antigravity AI |
| 7 | 2026-08-14 | [`package.json`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/package.json) | Fixed `dev` and `server` npm scripts so `npm run dev` starts client & server without missing script error. | Antigravity AI |
| 8 | 2026-08-14 | [`server/index.js`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/server/index.js) | Moved `dotenv.config()` before `process.env.PORT` evaluation for proper environment initialization. | Antigravity AI |
| 9 | 2026-08-14 | [`src/services/apis.js`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/src/services/apis.js) | Enabled `process.env.REACT_APP_BASE_URL` support for dynamic API endpoint configuration. | Antigravity AI |
| 10 | 2026-08-14 | [`server/.env`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/server/.env), [`server/.env.example`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/server/.env.example) | Created backend `.env` configuration & `.env.example` template with placeholders for DB, JWT, Cloudinary, Razorpay, Mailer. | Antigravity AI |
| 11 | 2026-08-14 | [`.env`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/.env), [`.env.example`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/.env.example) | Created root frontend `.env` configuration & `.env.example` template. | Antigravity AI |
| 12 | 2026-08-14 | [`package.json`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/package.json) | Moved `fsevents` to `optionalDependencies` to resolve Windows `EBADPLATFORM` npm install error. | Antigravity AI |
| 13 | 2026-08-14 | [`package.json`](file:///c:/Users/shrey/OneDrive/Desktop/PROJECT/StudyNotion/package.json) | Fixed typo replacing `chat.js` with `chart.js` (`^4.5.1`) required for Instructor Dashboard Chart.js integration. | Antigravity AI |
| 14 | 2026-10-05 | `server/config/database.js` | Root cause of "app not working": the Atlas host in `MONGODB_URL` (`cluster0.g182iai.mongodb.net`) no longer exists (DNS NXDOMAIN, even on 8.8.8.8). Removed "standalone mode" (which hid the failure); server now exits with a clear message on DB connection failure. | Claude Code |
| 15 | 2026-10-05 | `server/controllers/Auth.js` | Removed Antigravity "demo" bypasses: any 6-digit OTP was accepted, any email with password `Password123` got a JWT for a fake user id, OTP was returned in the API response, in-memory OTP store. Kept the real fixes (instructor `approved` flag, JWT `role: accountType`, default DiceBear avatar). Password hash no longer returned on signup. Password-change email failure no longer turns a successful change into a 500. | Claude Code |
| 16 | 2026-10-05 | `server/controllers/Category.js`, `server/controllers/RatingandReview.js` | Removed fake demo-data fallbacks (fake categories/courses/reviews shown when the DB was down). Category page now returns an empty list instead of 404 for categories without published courses, handles the single-category case, sorts "most selling" by enrolments. `createCategory` returned `success: true` on error. | Claude Code |
| 17 | 2026-10-05 | `server/utils/mailSender.js`, `server/models/OTP.js` | `mailSender` now throws on failure (it used to swallow errors), so "OTP sent" is only reported when the email was really sent. | Claude Code |
| 18 | 2026-10-05 | `server/controllers/payments.js` | `verifyPayment` could send two responses (crash "headers already sent"); `sendPaymentSuccessEmail` never responded (request hung); enrolment email failure no longer aborts enrolment; `$addToSet` avoids duplicate enrolments. | Claude Code |
| 19 | 2026-10-05 | `server/routes/Course.js`, `server/controllers/Course.js` | `DELETE /deleteCourse` had no auth (anyone could delete any course): now requires instructor login and ownership; also removes the course from its category/instructor. Fixed `studentsEnroled` typo in `getAllCourses`. | Claude Code |
| 20 | 2026-10-05 | `server/controllers/resetPassword.js`, `server/.env.example` | Reset-password link pointed at someone else's Vercel deployment; now uses `FRONTEND_URL` (default `http://localhost:3000`). | Claude Code |
| 21 | 2026-10-05 | `server/index.js`, `server/middleware/auth.js` | Unknown `/api/*` routes hung forever (catch-all never responded); build is only served if `build/index.html` exists; upload temp dir uses `os.tmpdir()` (Windows). Auth middleware no longer throws when the `Authorization` header is missing. | Claude Code |
| 22 | 2026-10-05 | `src/services/operations/studentFeaturesAPI.js`, `.env`, `.env.example` | Razorpay checkout used a hardcoded key (`rzp_test_2R3g…`) different from the server key, so payments could never succeed. Now reads `REACT_APP_RAZORPAY_KEY` (must equal `RAZORPAY_KEY` in `server/.env`). Fixed stuck loading toast. | Claude Code |
| 23 | 2026-10-05 | `src/services/operations/authAPI.js`, `src/pages/VerifyEmail.jsx` | Toasts now show the server's error message (e.g. "Password is incorrect"). "Resend OTP" crashed because `navigate` wasn't passed. | Claude Code |
| 24 | 2026-10-05 | `src/components/Common/ReviewSlider.jsx`, `src/pages/ViewCourse.jsx`, `src/pages/Catalog.jsx`, `src/components/core/ViewCourse/VideoDetails.jsx`, `src/services/operations/courseDetailsAPI.js`, `src/services/operations/pageAndComponntDatas.js` | Crash / infinite-spinner fixes when an API call fails, a catalog name is unknown, or a course has no lectures (unhandled promise rejection showed the CRA red error overlay). | Claude Code |
| 25 | 2026-10-05 | `src/components/core/Dashboard/AddCourse/index.jsx`, `.../CourseInformation/CourseInformationForm.jsx` | "Add Course" opened the last edited course; now starts blank. Edit mode didn't preselect the category and ignored category changes on a newly created course; "Continue Without Saving" also submitted the form. | Claude Code |
| 26 | 2026-10-06 | Project location | Moved project from OneDrive to `D:\StudyNotion` (OneDrive sync made builds take 30+ min and fail with `UNKNOWN: unknown error, read`; now ~40 s). Local MongoDB 7.0 installed as a Windows service; `server/.env` points to `mongodb://127.0.0.1:27017/studynotion`. | Claude Code |
| 27 | 2026-10-06 | `server/utils/mailSender.js`, `server/utils/seedData.js`, `vercel.json`, `server/.env.example` | Deployment prep: configurable `MAIL_PORT` (Render's free plan blocks SMTP 587/465 → use Brevo on 2525) and `MAIL_FROM`; demo instructor/courses (publicly known password) only seeded when `SEED_DEMO_DATA=true` (categories are always seeded into an empty DB); `vercel.json` builds with `CI=false` and rewrites routes to `index.html`. | Claude Code |
