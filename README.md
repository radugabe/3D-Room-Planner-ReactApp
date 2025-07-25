
# 🏠 3D Room Planner Web App

🚧 **This is a work-in-progress project (BETA).**
I'm still actively developing features, improving performance, and refining the user experience.

An interactive web application for designing and customizing 3D interior spaces directly in the browser. Built with React, Three.js, and Node.js, the app offers both beginner-friendly and advanced tools for room planning, model manipulation, and texture application.

## 🚀 Demo

🎥 Watch the [Demo Videos](in project's root) - RECOMMENDED
📁 Or clone this repo and run locally (instructions below)

---

## 🧩 Features

- 🧱 **Two Planning Modes**:
  - **Rectangular Planner**: Quick setup of standard 4-wall rooms
  - **Custom Planner**: Draw any number of walls freely in 3D space

- 🪑 **Model Catalog**:
  - Add 3D furniture and objects via drag & drop
  - Real-time manipulation (move, rotate, scale)

- 🎨 **Material System**:
  - Apply realistic textures to floors, walls, and objects
  - Individual texture control for walls in Custom Planner

- 📐 **Precise Design Tools**:
  - Wall length indicators and snapping
  - Grid and wireframe overlays for better spatial planning

- 🤖 **AI-Powered Room Generator**:
  - Describe your ideal room in plain text
  - The app builds a 3D room automatically using AI integration

- 💾 **Project Import & Export**:
  - Save your layout as `.json`
  - Reopen or share later


---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, @react-three/fiber, @react-three/drei
- **3D Engine**: Three.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **AI Integration**: OpenAI GPT API

---

> 📁 Note: `.env`, `public/models/`, and `node_modules` are excluded from GitHub.  
> You must provide your own `.env` and assets locally.

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/radugabe/3D-Room-Planner-ReactApp
cd 3D-Room-Planner-ReactApp

# 2. Install dependencies
cd frontend && npm install
cd backend && npm install

# 3. Configure environment variables
# Create a .env file in /backend with appropriate keys

# 4. Start the app
# (Terminal 1)
cd backend
nodemon serve.js

# (Terminal 2)
cd frontend
npm start
```

---

## 📚 License

This project was developed as part of my Bachelor’s thesis at the Bucharest University of Economic Studies – Faculty of Cybernetics, Statistics and Economic Informatics. I received the maximum grade (10/10) for this project.

🧑‍🎓 **Author**: Radu-Gabriel Dinu  
👨‍🏫 **Supervisor**: Conf. univ. dr. Mihai Doinea

---

## 💡 Future Improvements

- Real-time collaboration
- Photo-realistic rendering (ray tracing)
- Cloud project storage
- Mobile adaptation

---

## 🙌 Acknowledgments

Thanks to the open-source communities behind:
- React & React Three Fiber
- Three.js
- Tailwind CSS
- Node.js
- MySQL
- OpenAI API

---