# EduMerge Assignment - Admission Management & CRM (Minimal BRS)

This repository contains a minimal full-stack admission management system built with:

- **Frontend:** Next.js
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas

## Features Implemented

- Master setup
- Program and quota configuration
- Seat matrix validation
- Applicant creation
- Seat allocation with quota blocking
- Admission confirmation
- Immutable admission number generation
- Fee and document status tracking
- Basic dashboard
- Role-based login for Admin / Admission Officer / Management

## Project Structure

```bash
edumerge-assignment/
  frontend/
  backend/
  README.md
```

## Setup Instructions

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your MongoDB Atlas connection string.

Then run:

```bash
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`

### 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`

## Demo Credentials

### Admin
- Email: `admin@edumerge.local`
- Password: `Admin123!`

### Admission Officer
- Email: `officer@edumerge.local`
- Password: `Officer123!`

### Management
- Email: `management@edumerge.local`
- Password: `Management123!`

## Business Rules Covered

1. Quota seats must equal intake
2. No allocation when quota is full
3. Admission number generated only once
4. Admission confirmed only when fee is paid
5. Seat counters update on allocation

## Notes / Simplifications

- This is a minimal version focused only on the assignment scope.
- File upload is represented through document status fields instead of actual upload storage.
- Institution-level cap and supernumerary logic are kept minimal at schema level and can be extended.
- Management role is view-only by intended usage.

## AI Disclosure

AI assistance used: **ChatGPT**

AI-assisted parts:
- Initial project scaffolding
- API and frontend boilerplate generation
- README drafting
- Some naming and structure suggestions

All code was reviewed and is expected to be explained by the candidate during interview discussion.

## Suggested GitHub Repo Name

`edumerge-admission-management`
