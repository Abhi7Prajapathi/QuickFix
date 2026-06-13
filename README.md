# QuickFix

A fully containerized full-stack web application featuring a React frontend, Django backend, and a PostgreSQL database. The entire ecosystem is orchestrated using Docker Compose for seamless development.

## 🚀 Tech Stack

* **Frontend:** React (Vite, HMR, ESLint)
* **Backend:** Django
* **Database:** PostgreSQL
* **Orchestration:** Docker & Docker Compose

---

## 🛠️ Getting Started

Because this project is fully Dockerized, you do not need to manually install Python, Node.js, or PostgreSQL on your computer. You only need **Docker Desktop** installed.

### 1. Clone the Repository

```bash
git clone https://github.com/Abhi7Prajapathi/QuickFix.git
cd QuickFix
```

### 2. Start the Application

```bash
docker compose up --build
```

### 3. Access the Services

* **React Frontend:** http://localhost:5173
* **Django Backend API:** http://localhost:8000
* **Django Admin:** http://localhost:8000/admin

### 4. Apply Database Migrations

```bash
docker compose exec backend python manage.py migrate
```

### 5. Create a Superuser

```bash
docker compose exec backend python manage.py createsuperuser
```

---

## 📦 Useful Commands

### Stop Containers

```bash
docker compose down
```

### View Logs

```bash
docker compose logs -f
```

### Rebuild Containers

```bash
docker compose up --build
```

---

## 📂 Project Structure

```text
QuickFix/
├── frontend/
├── backend/
├── docker-compose.yml
├── .dockerignore
├── README.md
```

---

## 👨‍💻 Author

**Abhilash R.**

* GitHub: https://github.com/Abhi7Prajapathi
* LinkedIn: https://linkedin.com/in/abhi-r-prajapathi-132544356
