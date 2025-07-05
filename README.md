# Lumen

Lumen is an AI-powered career development platform built to revolutionize how students and job seekers discover opportunities, improve their resumes, and prepare for applications. Developed during the INNOVATE X Hackathon, the platform is designed to provide end-to-end support for every stage of the career journey through intelligent automation and data-driven recommendations.

![screely-1748363117448](https://github.com/user-attachments/assets/d6b695ef-555e-471a-82e2-32a25f829020)


## Features

### Resume Evaluation and Feedback  
Helps users assess and refine their resumes:  
- AI analyzes uploaded CVs and generates a personalized resume rating  
- Tailored improvement suggestions based on content quality and structure  
- Automated keyword analysis aligned with industry standards

### Smart Job Discovery  
Connects users with jobs that match their skills and aspirations:  
- Extracts resume tags to recommend relevant jobs from LinkedIn and HR platforms  
- Dynamic filtering by skillset, experience, and location  
- Role-specific opportunities to increase job match accuracy

### Dual Career Navigation  
Empowers users to choose their path forward:  
- Take Preparation: Generates a personalized learning path with curated resources  
- Take Job: Allows users to directly apply with built-in assessments  
- Adaptive experience based on user confidence and readiness

### In-App Skill and Job Assessments  
Enhances job application outcomes through evaluation tools:  
- Resume screening tailored to job requirements  
- Built-in writing, coding, and aptitude tests  
- Communication skill assessments for real-world readiness

### Personalized Retry & Growth Engine  
Ensures continuous improvement after rejections:  
- Analyzes failure points and recommends actionable improvements  
- Delivers targeted practice plans to build missing skills  
- Encourages retrying with enhanced preparation

### Scalable and Interactive Architecture  
Designed for long-term scalability and user engagement:  
- Real-time feedback and smart routing logic  
- Modular architecture for extensibility  
- Mobile-first and user-friendly interface

---

**Lumen** empowers job seekers with the tools they need to succeed in the competitive job market. By combining AI, automation, and personalized learning, it transforms traditional career preparation into a smarter, more effective experience.


## 📁 Project Structure

```
📦 
├─ LICENSE
├─ README.md
├─ client
│  ├─ .eslintrc.json
│  ├─ .gitignore
│  ├─ README.md
│  ├─ components.json
│  ├─ jsconfig.json
│  ├─ next.config.mjs
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ images
│  │  │  ├─ Group.png
│  │  │  └─ user_story.jpg
│  │  ├─ next.svg
│  │  └─ vercel.svg
│  ├─ src
│  │  ├─ app
│  │  │  ├─ (hr)
│  │  │  │  └─ hrdashboard
│  │  │  │     ├─ create-job
│  │  │  │     │  └─ page.js
│  │  │  │     └─ layout.js
│  │  │  ├─ (user)
│  │  │  │  └─ userdashboard
│  │  │  │     ├─ interview
│  │  │  │     │  ├─ page.js
│  │  │  │     │  └─ result
│  │  │  │     │     └─ page.js
│  │  │  │     ├─ jobs
│  │  │  │     │  └─ page.js
│  │  │  │     ├─ layout.js
│  │  │  │     ├─ learn
│  │  │  │     │  ├─ [slug]
│  │  │  │     │  │  └─ page.js
│  │  │  │     │  └─ page.js
│  │  │  │     ├─ meet
│  │  │  │     │  └─ page.js
│  │  │  │     ├─ overview
│  │  │  │     │  └─ page.js
│  │  │  │     ├─ preparation
│  │  │  │     │  └─ page.js
│  │  │  │     ├─ rating
│  │  │  │     │  └─ page.js
│  │  │  │     └─ take
│  │  │  │        └─ [id]
│  │  │  │           ├─ coding-test
│  │  │  │           │  └─ page.js
│  │  │  │           ├─ resume-analysis
│  │  │  │           │  └─ page.js
│  │  │  │           └─ test
│  │  │  │              └─ page.js
│  │  │  ├─ _home
│  │  │  │  ├─ Benefit.js
│  │  │  │  ├─ Feature.js
│  │  │  │  ├─ Hero.js
│  │  │  │  └─ Service.js
│  │  │  ├─ favicon.ico
│  │  │  ├─ globals.css
│  │  │  ├─ layout.js
│  │  │  ├─ onboarding
│  │  │  │  ├─ question
│  │  │  │  │  └─ page.js
│  │  │  │  └─ resume
│  │  │  │     └─ page.js
│  │  │  ├─ page.js
│  │  │  ├─ signin
│  │  │  │  └─ page.js
│  │  │  └─ signup
│  │  │     └─ page.js
│  │  ├─ components
│  │  │  ├─ Footer
│  │  │  │  └─ page.js
│  │  │  ├─ Header
│  │  │  │  └─ page.js
│  │  │  ├─ Loader
│  │  │  │  └─ loader.js
│  │  │  ├─ Url
│  │  │  │  └─ page.js
│  │  │  ├─ UserSidebar
│  │  │  │  └─ page.js
│  │  │  ├─ hrSidebar
│  │  │  │  └─ page.js
│  │  │  └─ ui
│  │  │     ├─ CodeEditor.jsx
│  │  │     ├─ LanguageSelector.jsx
│  │  │     ├─ Output.jsx
│  │  │     ├─ Review.jsx
│  │  │     ├─ alert.jsx
│  │  │     ├─ avatar.jsx
│  │  │     ├─ badge.jsx
│  │  │     ├─ button.jsx
│  │  │     ├─ card.jsx
│  │  │     ├─ checkbox.jsx
│  │  │     ├─ dialog.jsx
│  │  │     ├─ dropdown-menu.jsx
│  │  │     ├─ input.jsx
│  │  │     ├─ label.jsx
│  │  │     ├─ navigation-menu.jsx
│  │  │     ├─ progress.jsx
│  │  │     ├─ radio-group.jsx
│  │  │     ├─ select.jsx
│  │  │     ├─ separator.jsx
│  │  │     ├─ sheet.jsx
│  │  │     ├─ skeleton.jsx
│  │  │     ├─ switch.jsx
│  │  │     ├─ table.jsx
│  │  │     ├─ tabs.jsx
│  │  │     ├─ textarea.jsx
│  │  │     └─ tooltip.jsx
│  │  └─ lib
│  │     ├─ actions
│  │     │  └─ codeReview.js
│  │     └─ utils.js
│  └─ tailwind.config.js
└─ server
   ├─ .gitignore
   ├─ app.js
   ├─ cloudinaryConfig.js
   ├─ controllers
   │  ├─ courseController.js
   │  ├─ interviewController.js
   │  ├─ jobController.js
   │  ├─ plannerController.js
   │  ├─ ratingController.js
   │  ├─ resumeController.js
   │  └─ userController.js
   ├─ db.js
   ├─ middlewares
   │  └─ authMiddleware.js
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  └─ schema.prisma
   └─ routes
      ├─ courseRouter.js
      ├─ interviewRoute.js
      ├─ jobRoute.js
      ├─ plannerRoute.js
      ├─ ratingRouter.js
      ├─ resumeRoutes.js
      └─ userRouter.js
```

## 🛠️ Tech Stack

- Frontend: React, Next.js, TailwindCSS,
- Backend: Node.js, Express
- Database: PostgreSql
- ORM: Prisma
- API: Gemini API + Google Cloud
  
## 🚦 Getting Started

### Frontend or client

1.  Clone the repository

```
git clone https://github.com/farhanpavel/Learn2Code
```

2.  Go to the client folder

```
cd client
```

3.  Install dependencies in the client folder

```
npm install
```

4.  Run the development server in the client folder

```
npm run dev
```

5.  Build for production

```
npm run build
```

6.  Watch it live on your browser in this URL

```
http://localhost:3000
```

### Backend or server

1.  Go to the server folder

```
cd server
```

2.  Install dependencies in the server folder

```
npm install
```

3.  Run the development server in the server folder

```
nodemon app
```

4.  The server is running on

```
http://localhost:4000
```

## 🤝 Team Contribution

1.  Md. Farhan Islam Pavel - Team Lead & Frontend Developer

    - UI/UX Design, Frontend Development

2.  Md. Kaif Ibn Zaman - Backend Developer

    - Backend Features development, API development, Database Design

3.  Zunaid Ali - Backend Developer

    - Features Testing, Security Testing, Documentation writing

## 📝 Scripts

1.  npm run dev - Start development server
2.  npm run build - Build for production
3.  npm start - Start production server
4.  npm run lint - Run ESLint
5.  nodemon app - Start backend server

## 🌎 .env

```
.env frontend:
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_VAPID_API_KEY=
NEXT_PUBLIC_YOUTUBE_API_KEY=
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=
NEXT_PUBLIC_ELEVENLABS_API_KEY=

.env backend:
DATABASE_URL=
PORT=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REFRESH_TOKEN_SECRET=""
ACCESS_TOKEN_SECRET=""
PDF_CO=
GEMINI_API_KEY=
YOUTUBE_API_KEY=
OCR_API_KEY=
```

## 📜 License

This project is licensed under the MIT License.
