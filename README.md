# CampusLens 🎓

CampusLens is a production-grade, full-stack student academic tracking system and AI-powered intervention planner. It is designed to provide academic mentors, program chairs, and department advisors with a single, unified visual index of student trajectories, risk profiles, and recovery actions. 
By analyzing indicators like attendance compliance, internal assessment score ratios, test trends, and class participation metrics, CampusLens generates high-fidelity, predictive risk assessments and prioritized intervention steps in milliseconds.

---

## 🎨 Creative Architecture & Interface Visuals

The application is designed using a **sleek modern light interface** emphasizing micro-animations, structured data widgets, and intuitive navigation:
*   **Intuitive Visual Bento Dashboard**: Leveraging clean margins, balanced negative space, and responsive charts (`recharts`).
*   **Active Directory Panel**: A comprehensive management ledger to create, read, update, and remove student profiles dynamically.
*   **Interactive AI Diagnostics Panel**: Houses deep-dive generative analytics, dynamic resource matching, and direct communication widgets.
*   **Executive Contacts Terminal**: Direct pathways to Program Chairs and Co-Chairs of respective cohorts with interactive visual feedback and pre-filled WhatsApp link templates.

---

## 🚀 Key Features

*   **📈 Visual Analytics Dashboard**: Visual distribution of risk levels, real-time calculation of key metrics (Average Attendance, Assignment Completion, Unit Test Marks, and Internal Grade metrics).
*   **🔀 Multi-Tier Risk Evaluation Engine**: Automatic grouping of students into *High Risk*, *Moderate Risk*, and *Stable* tiers based on real-time telemetry inputs.
*   **🧠 Low-Latency AI Intervention Planner**: Automatically scans student characteristics using Google Gemini 3.5 Flash and returns an structured 5-point recovery roadmap containing:
    *   **Focus Areas**: Specific concepts requiring attention.
    *   **Actionable Tasks**: Staggered milestones mapped to key parameters.
    *   **Material Recommendations**: Curated high-relevance courses, videos, worksheets, and counselors.
*   **📞 Connected Faculty Ledger**: Department-wise contact matrix for rapid academic escalation. Fully responsive cards mapping direct email hooks and custom-typed WhatsApp templates that pre-fill escalation messages.

---

## 🛠️ Predictive Performance Optimization Subsystem

To deliver maximum responsive speed, CampusLens incorporates multiple cutting-edge Gemini API tuning features and a smart memory cache structure:

1.  **⚡ Low-Entropy Inference (t=0.15)**: Restricts exploratory output paths, ensuring swift, highly structured, and deterministic JSON responses.
2.  **🧠 Minimal Cognitive Overhead Configuration**: Specifies `thinkingConfig: { thinkingLevel: 'low' }` to prioritize immediate response latency by avoiding unnecessary reasoning tokens.
3.  **🏢 System Context Offloading**: Moves static rules, mandatory resource linkages, and personality descriptions entirely to `systemInstruction` arrays to optimize token size on repeat generation cycles.
4.  **💾 Predictive Deterministic Memory Cache**: Implements an in-memory caching map with a 20-minute Time-To-Live (TTL). Repeated requests for the same academic profile are resolved instantly at under 5ms, eliminating redundant external API round-trips.

---

## 🔌 API Route Map

CampusLens uses a unified backend API route topology to keep your AI keys hidden safe inside server-side environments:

| Method | Endpoint | Description | Payload Schema |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/students` | Retrieves list of all student files | None |
| **POST** | `/api/students` | Registers a new student file | `Partial<Student>` |
| **PUT** | `/api/students/:id` | Rewrites metrics of specific student | `Partial<Student>` |
| **DELETE** | `/api/students/:id` | Evicts specific student from database | None |
| **POST** | `/api/predict` | Generates or pulls low-latency AI interventions | `{ stats: StudentStats, name: string, branch: string, semester: number }` |

---

## 🧱 The Technical Stack

*   **Frontend**: React 19, TypeScript, TSX, Vite (for blazing fast build compiling), Tailwind CSS (for modern UI utility layouts), Lucide Icons, and Motion (for hardware-accelerated fluid transitions).
*   **Backend**: Node.js, Express, TypeScript (executed dynamically via local tsx preprocessors).
*   **Build Engine**: Custom optimized dual-compile system compiling the Vite client and bundling server controllers into a single CommonJS release container (`dist/server.cjs`) using `esbuild` for ultra-fast startup performance.

---

## ⚙️ Local Development Setup

To download, configure, and boot CampusLens on your local workstation:

### Prerequisite Checklist
*   Node.js (v18.0.0 or higher)
*   NPM (v9.0.0 or higher)

### 1. Retrieve & Install Dependencies
```bash
# Clone the repository and navigate to root
git clone https://github.com/nxtboi/Campus-Lens-V2.git
cd campuslens

# Install development & platform dependencies
npm install
```

### 2. Prepare Environment Configuration
Copy the sample environment file to your active runtime file:
```bash
cp .env.example .env
```
Open `.env` in your preferred editor:
```env
# Google Gemini SDK secrets config
GEMINI_API_KEY="AIzaSy..."

# Target container service location links
APP_URL="http://localhost:3000"
```

### 3. Launch Development Instance
Launches the full-stack server using Express server running Vite as an internal development middleware overlay:
```bash
npm run dev
```
Open [https://campus-lens-v2.vercel.app/](https://campus-lens-v2.vercel.app/) to check your local live changes!

---

## 📦 Building & Production Release Procedures

Production environments bundle client-side static files and compile backend scripts into standalone, high-performance optimized systems.

### 1. Compile Client and Unified Server
```bash
npm run build
```
This single compile command does two things:
1.  Vite generates optimized production assets and places them under `dist/`.
2.  `esbuild` bundles `/server.ts` dependencies into a highly optimized, path-resolved executable file in `/dist/server.cjs`.

### 2. Standalone Launch
```bash
npm start
```
Starts the bundled express server directly at `0.0.0.0:3000` for low-footprint virtual server scaling.

### 3. Maintain Code Quality Standards
Verify syntax, model bindings, types integrity, and general guidelines:
```bash
npm run lint
```

---

## 🐳 Deployment Considerations
*   **Port Binding**: The Node release server binds exclusively to port `3000` and `0.0.0.0` host interface. Ensure your container orchestrator mapping targets these values representing external networking policies.
*   **Secret Injection**: Inject `GEMINI_API_KEY` straight into system variables of the operating platform. Never hardcode live secrets inside static code files.

---

*Academic success engineered with machine precision.*
