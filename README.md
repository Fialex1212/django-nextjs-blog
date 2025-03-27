# **Django & Next.js Blog**

## **Goal**
Develop a modern blog platform using Django for the backend and Next.js for the frontend.

## **Features**
- **User Authentication:** Users can register, login, and manage their profiles.
- **Blog Posts:** Create, edit, and delete posts.
- **Comments System:** Users can leave comments and interact with posts.
- **Search & Filtering:** Enable searching and filtering by all, users and posts.
- **Likes & Reactions:** Users can like posts.
- **Admin Panel:** Manage posts, users, and comments efficiently.

## **Design Elements**
- Clean and responsive UI for both desktop and mobile.
- Focus on readability with typography and whitespace.


## **Tech Stack:**
  - Frontend: React, Next.js, Tailwind CSS, zustand
  - Backend: Django, DRF, Pillow
  - Database: SQL, PostgreSQL
  - Technologies: JWT
---
## **Installation**
Clone my project
```cmd
    git clone https://github.com/Fialex1212/django-nextjs-blog.git
```

### **Frontend**
Run the frontend

```bash
  cd frontend
  cd blog
  yarn install
  yarn dev
```

### **Backend**
Run the backend

```cmd
  cd backend/base
  python -m venv venv
  .\venv\scripts\activate
  pip install requirements.txt
  python manage.py makemigrations
  python manage.py migrate
  python manage.py runserver
```
## **Authors**

- [@Aleks Seriakov](https://github.com/Fialex1212)