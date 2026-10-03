## TechHire — FYP Demo Video Script (Max 10 minutes)

**Audience**: Project client / supervisor / marker  
**Goal**: Show end-to-end workflow + key features with clear narration  
**Recording style**: Screen recording with voice-over (read this script)  

---

### Browser organization (say this first so the viewer doesn’t get confused)

**Script:**  
“Before I start, I’m going to keep the demo organised using browser tabs and windows. I’ll always say which tab or window I’m using so it’s easy to follow.”

**On-screen (set this up first):**
- **Tab 1 — App (Next.js UI):** `http://localhost:3000/`  
  - All sign-in, dashboards, scheduling, interview room and coding features happen here.
- **Tab 2 — Backend check (Executor server):** `http://localhost:3001/api/languages`  
  - I’ll open this briefly to confirm the backend service is running.

**Windows / profiles (important):**
- **Window A (Interviewer account)**
- **Window B (Company account)**
- **Window C (Admin account)**
- *(Optional later)* **Window D (Interviewee account)** for the live interview room demo

**Quick rule (say this):**  
“When I say **Tab 1**, that’s the app on port **3000**. When I say **Tab 2**, that’s the backend on port **3001**. And I’ll switch between browser **windows** for different user roles.”

---

### Pre-demo setup checklist (do this BEFORE recording)

> These steps ensure the scheduling demo works smoothly, especially the requirement: **interviewer must create availability slots first** so admin can schedule using them.

#### 1) Start the project
From repo root:

```bash
npm run run:all
```

#### 2) Window A — Interviewer creates availability slots
**Tab 1 (App)**  
1. Open `http://localhost:3000/SignIn`  
2. Choose role **Interviewer** → Sign in with Google  
3. Open `http://localhost:3000/interviewer/availability`  
4. Select a future date + time slot → click **Add Availability Slot**  
5. Add **2–3 slots** (so admin has multiple options).

#### 3) Window B — Company prepares candidate Excel file
Prepare an `.xlsx` file with these columns (spelling must match):
- `Name`
- `Phone Number`
- `Experience in Years`
- `Email`

Optional columns:
- `Availability (optional)`
- `Resume Link`

#### 4) Window C — Admin account ready
Make sure you can sign in as **Admin** in another window/profile.

---

## Video Script (aim: ~9:30–10:00)

### 0:00 – 0:25 — Introduction
**Window A — Tab 1 (App)** at `http://localhost:3000/`

**Script:**  
“Hello, I’m presenting my Final Year Project **TechHire**. It’s a SaaS platform that helps companies hire developers through structured workflows, including remote interviews with real-time collaboration and live coding.”

---

### 0:25 – 0:55 — Architecture overview (high level)
**Window A — Tab 1 (App)**, then briefly **Tab 2**

**Script:**  
“TechHire is implemented as two cooperating parts. First, a **Next.js** application that provides the user interface, dashboards, and API routes connected to a **PostgreSQL** database via **Prisma**. Second, a separate **Node/Express** server on port **3001** for real-time communication using **Socket.IO**, peer connectivity using **PeerJS**, and a sandboxed **code execution** service.”

**Action:**  
Switch to **Tab 2** and show `http://localhost:3001/api/languages` loads (then return to Tab 1).

---

### 0:55 – 2:00 — Interviewer setup (availability slots)
**Window A (Interviewer) — Tab 1**

**Script:**  
“First, I’ll log in as an **Interviewer** and create availability slots. This is important because the admin uses these slots to schedule interviews. Without interviewer availability, scheduling can’t be completed.”

**Actions:**  
1. Go to `http://localhost:3000/SignIn`  
2. Select role **Interviewer** → Sign in with Google  
3. Go to `http://localhost:3000/interviewer/availability`  
4. Select a future date and one slot (e.g., `03:00 PM - 04:00 PM`) → click **Add Availability Slot**  
5. Add 1 more slot so the list shows multiple options.

**Script (one line while showing the list):**  
“These slots are saved as ‘available’ and will be visible to the admin when scheduling.”

---

### 2:00 – 4:15 — Company creates interview request (profile + skills + sheet upload)
**Switch to Window B (Company) — Tab 1**

**Script:**  
“Now I’ll switch to a **Company** account. The company creates an interview request using a guided workflow: select the job profile, choose skills and seniority, then upload candidates from an Excel sheet. This request appears in the admin dashboard as a pending item.”

**Actions:**  
1. Open `http://localhost:3000/SignIn`  
2. Select role **Company** → Sign in with Google  
3. Open `http://localhost:3000/company/interviewScheduling`  
4. **Step 1: Select Profile** (choose any profile)  
5. **Step 2: Choose Skills** (select a few)  
6. **Step 3: Set Seniority** (choose level)  
7. **Step 4: Customize Interview** (briefly show rubric/questions selection)  
8. Click **Upload Candidates** → upload the prepared `.xlsx` file  
9. Submit / complete the scheduling request

**Script (say this during upload):**  
“The candidate upload accepts Excel. The required columns are Name, Phone Number, Experience in Years, and Email. Optional columns include availability and a resume link.”

---

### 4:15 – 6:30 — Admin schedules the interview using interviewer slots
**Switch to Window C (Admin) — Tab 1**

**Script:**  
“Now I’ll switch to the **Admin** dashboard. The admin sees pending interview requests and schedules them by selecting a date and a time slot based on the interviewer’s availability. After scheduling, the interview moves to the scheduled list and a meeting link is generated.”

**Actions:**  
1. Sign in as **Admin** (if not already signed in)  
2. Open `http://localhost:3000/admin/pending`  
3. Find the new pending entry → click **Schedule**  
4. Pick a date and select one of the interviewer’s **available slots**  
5. Confirm schedule  
6. Open `http://localhost:3000/admin/scheduled`  
7. Open details and locate the **meeting link**

**Script (say this while showing it):**  
“Once scheduled, the interviewer’s selected slot becomes booked, and both participants can join using this meeting link.”

---

### 6:30 – 7:20 — Join the interview room (authorization)
**Window A (Interviewer) — Tab 1**

**Script:**  
“Next I’ll demonstrate the real-time interview room. The system authorizes access so only the correct interviewer or interviewee can join the specific interview.”

**Actions:**  
1. Copy the meeting link or interview identifier from admin  
2. Open the room URL in interviewer window (for example): `http://localhost:3000/qora/<INTERVIEW_ID>`  
3. Show the lobby screen and click **Join**

---

### 7:20 – 9:20 — Real-time features + live coding execution
**Window A (Interviewer) and Window D (Interviewee) — Tab 1**

**Script:**  
“Inside the room, TechHire supports real-time interview functionality. It includes chat, audio/video controls, screen sharing, and a live coding environment. The platform uses Socket.IO for room events and Peer connections for media-style communication. For live coding, code is executed through the backend execution service and the output is returned to the UI.”

**Actions (best with two participants):**
1. **Window D (Interviewee)**: open the same `http://localhost:3000/qora/<INTERVIEW_ID>` and click **Join**  
2. Show **Chat**: send a message interviewer → visible to interviewee  
3. Show **Mute/Unmute** and **Video toggle**  
4. Briefly start **Screen share** then stop  
5. Open **Code Editor** inside the room  
6. Paste code:

```js
console.log(\"Hello TechHire\");\nconsole.log(2 + 3);
```

7. Click **Run/Execute** and show the output in the UI.

**Script (say this while showing output):**  
“The app sends this to the execution service, which runs it safely and returns the output for evaluation during the interview.”

---

### 9:20 – 10:00 — Wrap-up
**Any window — Tab 1**

**Script:**  
“To summarise, TechHire provides a complete workflow: interviewers set availability, companies create interview requests and upload candidate data, admins schedule interviews using real slots, and finally interviews happen in a real-time room with collaboration and live coding. This demonstrates full-stack development using Next.js, Prisma with PostgreSQL, and real-time systems using Socket.IO and PeerJS. Thank you.”

---

### Optional notes for the recorder (do not read aloud)
- Keep the pace fast: avoid waiting screens; cut dead time if possible.
- If Google sign-in prompts appear, complete them once, then continue.
- If you don’t have an Interviewee account ready, you can still demo room features with one user, but chat/peer features look best with two windows.

