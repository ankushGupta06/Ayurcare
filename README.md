🌿 Ayurvedic Diet Management System

Bridging ancient wisdom with modern technology.

View Demo · Report Bug · Request Feature

</div>

📖 Overview

A comprehensive full-stack application for managing Ayurvedic diet plans. It allows doctors to create personalized plans based on Dosha types (Vata, Pitta, Kapha) and enables patients to track their progress, view recipes, and communicate with their health providers.

🏗️ System Architecture

graph LR
    subgraph Client
        UI[💻 Frontend UI<br/>React + Tailwind]
    end

    subgraph Server
        API[🚀 Backend API<br/>Node.js + Express]
        ML[🧠 ML Service<br/>Python + FastAPI]
    end

    subgraph Data
        DB[(🗄️ PostgreSQL)]
    end

    UI <-->|JSON / REST| API
    API <-->|Prisma ORM| DB
    API <-->|Prediction Requests| ML


🚀 Key Features

👨‍⚕️ For Doctors

🧘‍♀️ For Patients

🩺 Patient Management



Add, view, and manage comprehensive patient records and history.

📅 Diet History



Track daily adherence and view historical diet plans.

🥗 Diet Creator



Create specific Ayurvedic plans based on Dosha analysis.

💬 Secure Chat



Direct, encrypted communication channel with your assigned doctor.

🧠 AI Diet Generation



Auto-generate meal suggestions based on patient profiles using Python ML models.

🔔 Smart Reminders



Notifications for meals, water intake, and medication.

🛠️ Tech Stack

Frontend & Backend

Machine Learning

Data & Security

























📂 Project Structure

ayurvedic-diet-management/
├── UI/                  # Frontend React Application
│   ├── src/
│   └── package.json
├── backend/             # Backend Express API
│   ├── src/
│   ├── prisma/
│   └── package.json
├── Models/              # Machine Learning Service
│   ├── main.py
│   └── requirements.txt
└── README.md


⚡ Quick Start

Follow these steps to set up the environment manually.

1. Clone the repository

git clone [https://github.com/username/ayurvedic-diet-management.git](https://github.com/username/ayurvedic-diet-management.git)
cd ayurvedic-diet-management


2. Backend Setup (Node.js)

cd backend
npm install
# Setup .env file with DATABASE_URL first!
npm run dev


3. Frontend Setup (React)

cd ../UI
npm install
npm run dev


4. Machine Learning Service (Python)

[!NOTE]
Ensure you have Python 3.9+ installed.

cd ../Models
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

Updated date 02-09-2026

<div align="center">
Built with ❤️ using Ayurvedic principles.
</div>
