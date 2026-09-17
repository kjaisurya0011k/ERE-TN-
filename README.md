# ERE-TN | Education Revolution & Evolution – Tamil Nadu

> **Tagline:** Discover. Apply. Achieve.  
> **Platform:** Unified Student Opportunity, Verified Scholarships, Government Schemes, Career Roadmaps & Mentorship Platform.

---

## 🌟 About ERE-TN

**ERE-TN (Education Revolution & Evolution – Tamil Nadu)** is a dedicated platform built to empower students—beginning with school-completed and college students across Tamil Nadu and expanding nationwide—by providing transparent, verified access to government welfare, merit scholarships, educational grants, structured career roadmaps, and 1-on-1 industry mentorship.

---

## 🚀 Key Features

### 1. Student Opportunity & Welfare Discovery
- **Rule-Based Eligibility Checker:** Matches students against 15+ criteria (income slabs, 12th cutoff %, caste/community, first-graduate status, TN government school 7.5% quota, gender, and district).
- **Tamil Nadu State Schemes:** Pudhumai Penn, Tamil Pudhalvan, First Graduate Tuition Waiver, Post-Matric SC/ST Fee Concessions, Moovalur Ramamirtham Ammaiyar, and BC/MBC/DNC Welfare Schemes.
- **Central & National Schemes:** AICTE Pragati & Saksham, National Scholarship Portal (NSP), Central Sector Scheme (CSSS), and PM-USP.
- **Grassroots Foundations & Corporate CSR:** Verified non-profit and CSR grants (Tata Capital Pankh, Reliance Foundation, Agaram Foundation, Vidyadhan, etc.).

### 2. Industry Mentorship & 1-on-1 Counselling
- Verified mentor network comprising senior architects, data scientists, and academicians.
- Direct booking of 1-on-1 online career counselling and portfolio review sessions.
- In-browser interactive video meeting rooms with WebRTC.

### 3. NOVA AI Career & Education Guide
- Multilingual conversational assistant powered by Google Gemini AI.
- Strictly grounded in verified ERE-TN database records with zero hallucination of scholarship amounts or deadlines.

### 4. Future Talks & Learning Hub
- Monthly flagship masterclasses with national leaders, industry innovators, and welfare administrators.
- Practical skill courses covering DevOps, Cloud Architecture, Python, and Full Stack Development.

### 5. Multi-Language Support (i18n)
- Seamless real-time switching between **English**, **Tamil (தமிழ்)**, and **Hindi (हिन्दी)**.

---

## 🏗️ Architecture & Tech Stack

```
ere-tn/
├── frontend/             # React 18, TypeScript, Tailwind CSS, Vite
│   ├── src/
│   │   ├── components/   # Modular UI components (Navbar, Footer, Modals, Cards)
│   │   ├── contexts/     # AuthContext, LanguageContext
│   │   ├── pages/        # Public, Student, Mentor, Admin dashboards
│   │   ├── services/     # Unified Axios/Fetch API client & auth handlers
│   │   └── i18n/         # Multi-language translation dictionaries (en, ta, hi)
│   └── public/           # PWA manifest, favicon, vector assets
│
└── backend/              # Spring Boot 3.3.5 REST API (Java 21)
    ├── src/main/java/com/edunova/
    │   ├── controller/   # REST API Controllers (/api/*)
    │   ├── service/      # Business logic & NOVA AI grounding service
    │   ├── repository/   # Spring Data JPA repositories
    │   ├── domain/       # JPA entities & enums
    │   └── config/       # Security filter chain, JWT, and CORS configs
    └── src/main/resources/
        ├── db/migration/ # Flyway database versioning (V1 through V9)
        └── application.yml
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js 18+ and npm
- Java JDK 21+ and Maven (or included `./mvnw`)

### 1. Run the Frontend (Vite)
```bash
# From the root directory:
npm run dev

# Or directly in frontend:
cd frontend
npm run dev
```
Frontend URL: **http://localhost:5173**

### 2. Run the Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
Backend API URL: **http://localhost:8080/api**  
Health Check: **http://localhost:8080/api/health**

---

## 👥 Default Demo Accounts

For local evaluation and testing:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@edunova.in` | `Student@12345` |
| **Mentor** | `mentor.karthik@edunova.in` | `Mentor@12345` |
| **Administrator** | `admin@edunova.in` | `Admin@12345` |

*(One-click quick-fill buttons are available on the Sign In page).*

---

## 📄 License & Compliance

All government scheme information hosted on ERE-TN is verified against official state gazettes, university notifications, and department circulars. ERE-TN provides eligibility indications and direct navigation to official government portals.
