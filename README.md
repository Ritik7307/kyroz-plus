# KYROZ-PLUS: The Ultimate Kitchen Operating System (SaaS)

KYROZ-PLUS is a highly scalable, AI-powered Kitchen Operating System (KOS) designed specifically as a Software-as-a-Service (SaaS) for restaurants, cafes, and cloud kitchens. It provides complete end-to-end management from POS terminal operations to intelligent SOP library management and dynamic pricing.

## 🚀 Tech Stack & Frameworks

### Frontend (Client-Side)
- **Framework**: [Next.js (App Router)](https://nextjs.org/) - React framework for server-side rendering and static site generation.
- **Library**: [React 19](https://react.dev/) - UI Component architecture.
- **Language**: TypeScript - For robust, type-safe code.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework for rapid and responsive UI development.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - For rich, dynamic micro-animations and page transitions.
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful and consistent iconography.
- **Payments**: Razorpay Checkout - Integrated frontend payment gateway wrapper.

### Backend (Server-Side)
- **Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
- **Language**: TypeScript - Ensures type safety across the backend application.
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) ORM - NoSQL database for flexible schema management.
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs` for secure password hashing.
- **Payments**: Razorpay Node SDK - For creating orders and verifying signatures on the backend.
- **AI Integrations**: 
  - `@google/generative-ai` (Gemini API)
  - `openai` 
  - `groq-sdk`
- **File Uploads**: `multer` - For handling `multipart/form-data` (images, PDFs).
- **Document Parsing**: `pdf-parse` & `mammoth` - For extracting text from PDF and DOCX files.
- **Communications**: `resend` (Email) & `twilio` (SMS/WhatsApp).
- **Security**: `express-rate-limit` (for brute force protection) and `cors`.

### Python AI Microservices (Optional/Auxiliary)
- **Framework**: `FastAPI` (served via `uvicorn`) - High-performance Python web framework used for running specialized AI microservices alongside the main Node.js server.

## ⚙️ Key Features
- **Tiered SaaS Model**: Includes Basic, Pro, and Elite plans with feature locking and session device limits (e.g., 1 device vs 4 devices).
- **Smart POS Terminal**: Built-in client-side canvas image compression to optimize network requests and database storage.
- **Dynamic SOP Library**: Create, categorize, and view standard operating procedures with intelligent tier restrictions.
- **Intelligent KOSA (AI Chef)**: Context-aware AI assistant to help standardise kitchen recipes and scale operations.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Razorpay API Keys

### Running the Project

1. **Install Dependencies**
   Navigate to both the `frontend` and `backend` directories and run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - In `backend/`: Create a `.env` file for your MongoDB URI, JWT Secret, Razorpay keys, etc.
   - In `frontend/`: Create a `.env.local` for the public Razorpay Key ID and backend API URL.

3. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   *Note: This utilizes `concurrently` to spin up both the Node server and the Python AI service.*

4. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## 🔒 Security & Performance
- Client-side heavy image compression (via HTML5 Canvas) before upload.
- Strict API rate limiting and cross-origin controls.
- Token-based rolling session architecture enforcing plan-based active device limits.
