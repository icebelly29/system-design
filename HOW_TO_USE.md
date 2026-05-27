# System Design Masterclass — E-Learning Platform Guide

Welcome to the interactive **System Design Masterclass** e-learning course! This guide provides an overview of the platform's features, visual design principles, technical architecture, and instructions on how to run, develop, and export the entire textbook.

---

## Quick Start Guide

You can launch the interactive course dashboard locally on your machine in three simple steps:

### 1. Install Dependencies
Navigate into the web application directory and install the necessary npm packages:
```powershell
cd course-app
npm install
```

### 2. Run the Development Server
Launch the Vite hot-reloading development server:
```powershell
npm run dev
```
Once started, the console will print a local network address (typically `http://localhost:5173`). Open this link in any modern web browser to view the application.

### 3. Build for Production
If you want to package the application as a single-page deployment:
```powershell
npm run build
```
This compiles highly optimized, minified HTML, CSS, and JS bundles into the `/course-app/dist/` directory, ready to be deployed on static hosts like Vercel, Netlify, or GitHub Pages.

---

## Premium Visual Interface & Design System

The application has been styled from the ground up to emulate elite, developer-centric documentation platforms.

* **Inter Sans-Serif Stack**: Used for high-readability in technical long-form reading, balancing letter-spacing and line heights.
* **Fira Code & JetBrains Mono Fonts**: Applied to code containers, highlighting variables and programming statements cleanly.
* **Dynamic Theme Switcher**: Persists your dark/light preference inside browser `localStorage`, switching seamlessly between deep zinc night and bright slate day mode.
* **Interactive Code Blocks**: Code blocks are enclosed in structured custom widgets featuring syntax type labels and animated "Copy-to-Clipboard" buttons that shift to a checkmark on click.

---

## Dynamic Course Structure (Chapters I - V)

The monolithic 317KB `README.md` is ingested dynamically on startup and segment-split into an organized 5-chapter syllabus layout:

| Section | Topic | Core Area |
| :--- | :--- | :--- |
| **Getting Started** | Introduction | System Design Basics |
| **Chapter I** | Fundamentals | Networking (IP, DNS), OSI Model, Load Balancers, CDN, Caching, Proxies |
| **Chapter II** | Databases | SQL vs NoSQL, Replication, Sharding, CAP/PACELC, Indexes, Consistent Hashing |
| **Chapter III** | Architecture | Microservices, Message Brokers, Pub-Sub, Event Sourcing, CQRS, API Gateways, gRPC |
| **Chapter IV** | Advanced | Geohashing, Circuit Breakers, Rate Limiters, disaster recovery, OAuth/SSO |
| **Chapter V** | Case Studies | URL Shorteners, WhatsApp, Twitter, Netflix, Uber designs |
| **Appendix** | References | Recommended textbooks, links, and study paths |

---

## Key Interactive Features

### 1. Persistent Lesson Progress Tracking
* Next to every subtopic in the collapsible left sidebar layout, you will find an interactive checkbox.
* Clicking these checkboxes updates your syllabus completion record in real-time, calculating overall and chapter-specific percentages.
* **LocalStorage Integration**: Your finished lesson record is saved automatically inside your browser so your progress is retained if you close the tab or reload the browser.
* **Dynamic HUD Gauge**: A premium circular SVG progress indicator in the header provides a quick glance at your overall course progress.

### 2. Multi-Dimensional Search Console (Full-Text Querying)
* Focus the search bar immediately at any time by pressing **`/`** or **`Ctrl + K`** on your keyboard.
* Standard search bars only filter lesson names. Our search engine scans **lesson titles, chapter labels, AND the entire raw text body of each lesson**.
* Searching for key terms like `"round-robin"`, `"write-back"`, or `"Paxos"` will dynamically narrow down the sidebar syllabus to display only the lessons containing those specific keywords!

### 3. Smooth Anchor scroll Table of Contents (TOC)
* When studying a lesson, a floating **"On this page"** index appears on the right hand side of the desktop view.
* It dynamically parses all subheading elements (`h2`, `h3`) in the active article.
* Clicking any item smoothly scrolls you directly to that exact section of the lesson.

### 4. Textbook Page-to-Page Navigation
* Located at the bottom of every lesson is a textbook navigation panel with responsive **Previous** and **Next Lesson** buttons, letting you turn pages in order.
* A large **"Mark Lesson Finished"** action card is also provided at the bottom to quickly toggle completion status as you finish reading.

---

## Dynamic "Print to PDF" Book Exporter

The platform features a **high-fidelity client-side PDF Book Export System** that converts the entire interactive multi-page course into a beautifully paginated physical textbook with one click.

### How it works:
1. Under **"Course Syllabus"** in the left sidebar, click the blue **`Download as PDF Book`** button.
2. A sleek fullscreen overlay will appear stating: **`Compiling System Design Handbook — Fetching illustrations and caching layouts`**.
3. The engine dynamically fetches and eagerly pre-loads all external diagrams and illustrations from secure CDN servers to guarantee no blank frames appear.
4. Once loaded, the engine closes the compilation screen and fires the browser's native print modal.
5. In the print configurations, choose **`Save as PDF`** (with Background graphics turned ON, and Headers/Footers turned OFF).
6. Click **`Save`**! The browser will download a gorgeously aligned PDF complete with a custom Cover page, Table of Contents page, and exact page breaks (`break-before: page`) for each chapter.
7. The app then automatically returns you to your interactive reading dashboard.

---

## Tech Stack Highlights
* **Vite**: High-speed frontend building tool.
* **React**: Structured UI state and dynamic routing components.
* **Tailwind CSS v4**: Zero-config compilation stylesheet engine, leveraging theme variables and native utilities.
* **React Markdown + remark-gfm + rehype-raw**: Safe markdown content translation with full support for tables, lists, code elements, blockquotes, and custom LaTeX mathematical displays.
