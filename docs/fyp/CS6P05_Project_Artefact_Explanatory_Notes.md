# CS6P05 — Project Artefact Explanatory Notes

**Project:** TechHire — SaaS platform for technical hiring and remote interviews  
**Artefact type:** Software development (web application)  
**Student name / ID:** *[Complete]*  
**Supervisor:** *[Complete]*  
**Submission date:** *[Complete]*

---

## 1. Concise description of the software

### 1.1 Overview

**TechHire** is a web application that supports **technical recruitment**: companies define hiring needs, **interviews** are scheduled and conducted **remotely**, and outcomes (including **live coding** and feedback-related data) are handled through a central system. There is no separate hardware artefact; the product runs on standard PCs or laptops using **Node.js** and a **browser**.

The system is built as **two cooperating parts**:

1. **`my-next-app`** — a **Next.js 14** application (React, **App Router** under `src/app/`) providing pages, dashboards, and **`src/app/api/*`** server routes for business logic, integrated with **Prisma** and **PostgreSQL**.
2. **Root Node server** — **`server.js`** — an **Express** application with **Socket.IO** for real-time interview-room events, **PeerJS** for peer connectivity, and a **sandboxed JavaScript** execution API (**vm2**) on **HTTP port 3001**, referenced by the front end via **`CODE_EXECUTION_SERVICE_URL`**.

### 1.2 Functions from the specification — implemented

The following maps **typical final-year project requirements** for this type of system to what the submitted artefact **implements and demonstrates**:

| Specification theme | Implemented behaviour |
|---------------------|------------------------|
| **User roles and access** | **Admin**, **company**, **interviewer**, and **interviewee** areas under `src/app/(dashboard)/…`; authentication via **NextAuth** and **Google OAuth**; role-appropriate navigation and screens. |
| **Company hiring workflow** | Company dashboard: **profile**, **interview scheduling**, **candidates** (including per-candidate views); data tied to **jobs** and **interviews** in the Prisma models. |
| **Interviewer workflow** | Dashboard, **availability**, **statistics**, **results / feedback**, **change password**. |
| **Interviewee workflow** | **Interview preparation** and related dashboard content. |
| **Admin oversight** | Views for **pending**, **scheduled**, and **completed** interviews; management of **companies** and **interviewers**. |
| **Public site** | Marketing and support pages (e.g. **About**, **Careers**, **Contact**, **FAQs**, **Documentation**, **Help**, cookie/privacy/terms). |
| **Remote interview session** | Real-time **room** behaviour in **`server.js`**: join/leave, participant list sync, **chat**, signalling for **audio / video / screen share**, host actions (e.g. mute, remove screen share); **PeerJS** path for media-style connectivity. |
| **Technical assessment (coding)** | **Monaco**-oriented UI components; **JavaScript** execution via **`POST /api/execute`** on the Node server with timeout and captured console-style output; supported languages advertised via **`GET /api/languages`** (JavaScript in the current server implementation). |
| **Persistence** | **PostgreSQL** with **Prisma** (`prisma/schema.prisma`): users, companies, interviewers, interviewees, job descriptions, interviews, **code submissions**, AI evaluation / feedback-related models as defined in the schema. |
| **Integrations** | **Supabase**-compatible URLs and keys for client usage where configured; **S3-related** SDKs in dependencies for file flows where used in the app. |

### 1.3 Functions — to be implemented or enhanced

The following items are **not claimed as fully finished products** in every edge case, or are natural **extensions** beyond the core demonstration:

| Area | Status / enhancement |
|------|----------------------|
| **Code execution languages** | Server-side execution is **JavaScript-only** via **vm2**; adding Python, Java, C++, etc. would need extra runtimes or an external judge service—not part of the current single-server sandbox. |
| **Production deployment** | Local/demo-oriented URLs (e.g. `localhost`); full **HTTPS**, hardened **CORS**, rate limiting, and monitoring would be deployment-phase work. |
| **Automated testing** | Any unit, integration, or E2E suite should be expanded if the module or your specification requires explicit test evidence beyond manual checks. |
| **UX polish** | Broader **accessibility** (WCAG), **internationalisation**, and consistent empty-state handling across every dashboard screen. |
| **Collaborative editor edge cases** | **Yjs / Liveblocks**-style flows depend on network and browser permissions; stress testing under many simultaneous editors is enhancement work. |

*[Optional: add one row per deferred item from your own requirements document, e.g. “Payment integration — not in scope.”]*

---

## 2. Brief technical description — purposes of files and folders

### 2.1 Repository root (`TechHire/`)

| Path | Purpose |
|------|---------|
| **`package.json`** | Defines root dependencies and scripts **`install:all`** (install root + `my-next-app`) and **`run:all`** (run backend and Next together). |
| **`package-lock.json`** | Locks dependency versions for repeatable installs. |
| **`server.js`** | Main **Express + HTTP** server: **Socket.IO** on the same HTTP server, **PeerJS** peer server, **`/api/execute`** and **`/api/languages`** for sandboxed JS execution. Listens on **port 3001** (and logs **PeerJS** path). |
| **`server-code-executor.js`** | Auxiliary code-execution logic used alongside or by the execution feature (supporting module for the service). |
| **`docker-compose.yml`** | Optional definition of containerised dependencies if used in your environment. |
| **`.github/`** | GitHub workflows or templates, if present. |
| **`README.md`** | Short repository description. |
| **`my-next-app/`** | Entire Next.js application (UI, API routes, Prisma). |

### 2.2 Next.js application (`my-next-app/`)

| Path | Purpose |
|------|---------|
| **`package.json`** | App dependencies and scripts; **`dev:with-prisma`** runs **`prisma generate`** then **`next dev`**. |
| **`prisma/schema.prisma`** | Database schema: entities for users, companies, jobs, interviews, submissions, feedback, etc. |
| **`prisma/migrations/`** | Applied database migrations (when included in the submission). |
| **`next.config.*`**, **`tsconfig.json`**, **`tailwind.config.*`**, **`postcss.config.*`** | Framework, TypeScript, and styling configuration. |
| **`src/app/`** | **App Router** routes: **`Homepage`**, **`SignIn`** (including **SignUp** / **UserFormPage**), **`(dashboard)/admin|company|interviewer|interviewee`**, static pages (**AboutUs**, **Contact**, policies, **Documentation**, **HelpCenter**, **qora/[qoraId]`**, **feedbackform/[interviewId]`**, etc.). |
| **`src/app/api/`** | Route handlers grouped by domain, e.g. **`auth`**, **`admin`**, **`company`**, **`companies`**, **`interviewer`**, **`interviewee`**, **`interview`**, **`interviews`**, **`jobs`**, **`emails`**, **`execute`**, **`recordings`**, **`SkillLink`**, **`calender`**, etc. — server-side JSON and actions for the UI. |
| **`src/components/`** | Reusable UI: **video** / **peer** / **lobby**, **chat**, **code-editor**, **recording**, **tables**, **forms**, **layout**, **navbar**, **modals**, **charts**, **rubric**, and shared **ui** primitives. |
| **`src/room/`** | Interview room composition and wiring. |
| **`src/lib/`**, **`src/utils/`**, **`src/common/`** | Helpers, API clients, shared types/constants, and small shared components. |
| **`src/context/`**, **`src/contexts/`**, **`src/hooks/`**, **`src/stores/`** | React context, hooks, and client state (e.g. session or UI state). |
| **`src/assets/`** | Static assets such as icons. |
| **`.env`** | Runtime secrets and URLs for database, auth, Supabase, and the code-execution service (see Section 3.2). |

---

## 3. Install, set up, start up, and test

### 3.1 Prerequisites

- **Node.js** LTS (**18.x** or **20.x** recommended for Next.js 14).  
- **npm** (comes with Node).  
- A **PostgreSQL** database reachable from the machine (e.g. hosted **Supabase**).  
- **Google Cloud** OAuth client credentials for **NextAuth** (authorised redirect URIs must match your app URL).  

### 3.2 Set up environment variables

Create **`my-next-app/.env`** in the Next.js project folder. Use the same variable **names** as in your deployment; **values** are those issued by your database, Google, and Supabase accounts (not reproduced here).

| Variable | Role |
|----------|------|
| `DATABASE_URL` | Pooled Prisma connection to PostgreSQL. |
| `DIRECT_URL` | Direct PostgreSQL connection (e.g. for migrations). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth for NextAuth. |
| `NEXTAUTH_SECRET` | NextAuth signing secret. |
| `NEXTAUTH_URL` | Public base URL of the app (e.g. `http://localhost:3000/`). |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client configuration. |
| `CODE_EXECUTION_SERVICE_URL` | Base URL of **`server.js`** (e.g. `http://localhost:3001`). |

Optional: `NEXT_IGNORE_TYPE_ERRORS=true` on its **own** line if your build process relies on it.

### 3.3 Install dependencies

1. Open a terminal in the **repository root** (`TechHire/`).  
2. Run:

```bash
npm run install:all
```

This installs root packages and all packages under **`my-next-app/`**.

### 3.4 Database setup

If the database schema must be applied to an empty database:

```bash
cd my-next-app
npx prisma migrate deploy
```

For first-time Prisma Client generation without starting the dev server:

```bash
cd my-next-app
npx prisma generate
```

### 3.5 Start the application

**Recommended (single command from repository root):**

```bash
npm run run:all
```

This runs **`install:all`**, then starts **`node server.js`** (port **3001**) and **`prisma generate`** followed by **`next dev`** in **`my-next-app`** (typically **http://localhost:3000**).

**Alternative (two terminals):**

- Root: `npm run start`  
- `my-next-app`: `npx prisma generate` then `npm run dev`

Stop all processes with **Ctrl+C** in the terminal(s).

### 3.6 Testing implemented functions

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | With both processes running, open **`NEXTAUTH_URL`** in a browser. | Home or landing page loads; no Next.js fatal error page. |
| 2 | Use **Sign in** with Google using a valid test account. | Redirect completes; session established; dashboard or onboarding path loads for that user’s **role**. |
| 3 | Navigate **company** screens: profile, scheduling, candidates (as your seed data allows). | Pages render; API-backed lists/forms return **200** responses (check browser **Network** tab for failures). |
| 4 | Navigate **interviewer** and **interviewee** dashboards (availability, preparation, statistics, feedback). | Same as above for the routes you have populated with data. |
| 5 | Navigate **admin** sections (pending / scheduled / completed interviews, companies, interviewers). | Lists and detail views work against the database. |
| 6 | Open an **interview room** flow (with valid **meeting** / room identifiers from your data). | **Socket.IO** connection to port **3001**; chat and signalling events work between two browser sessions. |
| 7 | Trigger **live coding** that calls the execution service. | **`POST`** to `{CODE_EXECUTION_SERVICE_URL}/api/execute` with JSON body `{ "language": "javascript", "code": "console.log(1+1)" }` returns JSON with **`success: true`** and output containing **2** (or equivalent captured output). |
| 8 | **`GET`** `{CODE_EXECUTION_SERVICE_URL}/api/languages` | JSON lists **javascript** as supported. |

If any step fails, confirm **`.env`** values, that **PostgreSQL** accepts connections from your IP, and that **Google OAuth** redirect URIs match **`NEXTAUTH_URL`**.

---

**Declaration:** This artefact and explanatory notes represent my own practical work for the project; third-party libraries are used under their licence terms.

**Signature / date:** *[Complete]*
