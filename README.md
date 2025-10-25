# NLQ-to-SQL Library Demo

> Natural Language Querying for Library Database  
> Full-stack app using React, Node.js (Express), MySQL, Gemini AI, Aiven, and Vercel

---

## 🌟 Features

- **AI-powered NLQ**: Convert English questions to SQL automatically using Gemini Flash
- **Beautiful React Frontend**: Dark mode, syntax highlighting, responsive Material-UI
- **Express.js Backend**: Secure SQL execution, self-corrects bad queries, validates input
- **MySQL Cloud Database**: Hosted free on Aiven.io with sample library dataset
- **Error Handling**: Frontend and backend show helpful messages for failed queries
- **One-click Deploy**: Vercel for frontend + backend (serverless)

---

## 🗄️ Directory Structure

/
├── backend/ # Node.js/Express server, API, Gemini integration
│ ├── config/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ ├── api/index.js
│ ├── server.js
│ └── vercel.json
├── frontend/ # React Material-UI frontend
│ ├── src/
│ ├── public/
│ └── package.json



---

## 🚀 Deployment (Production)

- **Frontend**: https://nlq-frontend.vercel.app/
- **Backend/API**: https://nlq-2-sql.vercel.app/api
- **Cloud MySQL**: Free tier on [aiven.io](https://aiven.io/)

---

## ⚡ Quickstart (Local)

### Prerequisites

- Node.js (v18+)
- MySQL (or use Aiven credentials)
- Vercel CLI


---

## 🤖 How It Works

- User enters a question (e.g., "Which members have overdue books?")
- Frontend sends NLQ via API to backend
- Backend uses Gemini to turn NLQ into SQL
- Backend runs SQL on the Aiven MySQL DB
- Results returned and shown in a beautiful table

## 📝 Sample Queries

- "Show all overdue books with member details"
- "Which technology books are currently available?"
- "List all students who have borrowed fiction books"
- "How many books has each faculty member borrowed?"

---

## ⚙️ Tech Stack

- React + Material-UI (frontend)
- Node.js (Express) REST API
- Gemini Pro Flash (NLQ-to-SQL)
- MySQL (Aiven)
- Vercel (hosting)

---

## 🙌 Credits

- Gemini/GCP AI for the NLQ-to-SQL core
- Design inspired by Material-UI docs

---

## 📷 Screenshots

*(Add your own screenshots here!)*

---

## 🧩 License

MIT (add your license if needed)

---
