# Kumbh Kawach Project

## Overview

**Kumbh Kawach** is a comprehensive safety and facial recognition platform designed for large-scale events such as the Kumbh Mela. The system leverages modern web, mobile, and AI technologies to provide real-time facial recognition, emergency contact management, and seamless integration with cloud services. This repository contains multiple sub-projects, each serving a distinct purpose within the overall solution.

---

## Repository Structure

```
Kumbh-Kawach-Main/
│
├── AI-Facial-recognization/         # Next.js frontend for facial recognition
├── Kawach-v2-Backend/               # Node.js backend for emergency and user management
├── kumbh-kawach-ai-server/          # Python FastAPI server for face embedding & matching
├── suraksha-kawach-vercel/          # Next.js frontend for Suraksha Kawach
├── SurakshaKawach-MoblieFrontend/   # Android mobile frontend (Kotlin)
```

---

## Tech Stack

| Subproject                       | Tech Stack                                                                 |
|-----------------------------------|---------------------------------------------------------------------------|
| AI-Facial-recognization           | Next.js, TypeScript, React, Tailwind CSS, Node.js                         |
| Kawach-v2-Backend                 | Node.js, Express, TypeScript, MongoDB, Firebase Admin SDK                 |
| kumbh-kawach-ai-server            | Python, FastAPI, PyTorch, FaceNet, MongoDB, Google Cloud Storage          |
| suraksha-kawach-vercel            | Next.js, React, Tailwind CSS, Node.js                                     |
| SurakshaKawach-MoblieFrontend     | Kotlin, Android SDK                                                       |

---

## Code Flow Explanation

### 1. **Facial Recognition Flow**

#### **Frontend: AI-Facial-recognization**

- **User Registration:**  
  Users register and upload their photos via a React-based Next.js UI (`registration-form.tsx`).
- **Photo Upload:**  
  Images are uploaded to Google Cloud Storage using utility functions (`cloud-storage.ts`).
- **Data Preview & Face Match:**  
  Components like `data-preview.tsx` and `face-match.tsx` allow users to preview their data and perform face matching.

#### **Backend: kumbh-kawach-ai-server**

- **Embedding Generation (`/embed` endpoint):**
  - Receives a user ID.
  - Fetches the user from MongoDB.
  - Downloads the user's photo from Google Cloud Storage.
  - Preprocesses the image and generates a facial embedding using FaceNet (PyTorch).
  - Stores the embedding back in MongoDB.

- **Face Matching (`/match` endpoint):**
  - Receives a photo URL.
  - Downloads and preprocesses the image.
  - Generates an embedding.
  - Compares the embedding with all stored embeddings in MongoDB using cosine similarity.
  - Returns the best match if similarity exceeds a threshold.

#### **Backend: Kawach-v2-Backend**

- **Emergency Contact & User Management:**
  - Handles authentication, user registration, emergency contact linking, and ticketing via RESTful APIs.
  - Integrates with Firebase for authentication and messaging.
  - MongoDB is used for persistent storage of user and emergency data.
  - Controllers (`auth.controller.ts`, `contact.controller.ts`, etc.) manage business logic.
  - Middlewares ensure request validation and user permission checks.

### 2. **Suraksha Kawach Flow**

#### **Frontend: suraksha-kawach-vercel**

- Provides a user-friendly interface for safety features, emergency alerts, and information dissemination.
- Built with Next.js and Tailwind CSS for rapid development and responsive design.

### 3. **Mobile Frontend**

#### **SurakshaKawach-MoblieFrontend**

- Android application written in Kotlin.
- Allows users to access safety features, register, and receive notifications on the go.

---

## Key Features

- **Real-time Facial Recognition:**  
  Fast and accurate face matching using deep learning (FaceNet).

- **Emergency Contact Management:**  
  Users can register emergency contacts and link them to their profiles.

- **Cloud-Native Architecture:**  
  Utilizes Google Cloud Storage for scalable image storage and Firebase for secure authentication.

- **Cross-Platform Support:**  
  Web and mobile frontends ensure accessibility for all users.

---

## Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-org/Kumbh-Kawach-Main.git
cd Kumbh-Kawach-Main
```

### 2. **Environment Variables**

- Each subproject contains a `.env` file template.  
  Fill in the required credentials for MongoDB, Google Cloud, and Firebase.

### 3. **Install Dependencies**

#### AI-Facial-recognization

```bash
cd AI-Facial-recognization
npm install
```

#### Kawach-v2-Backend

```bash
cd Kawach-v2-Backend
npm install
```

#### kumbh-kawach-ai-server

```bash
cd kumbh-kawach-ai-server
pip install -r requirements.txt
```

#### suraksha-kawach-vercel

```bash
cd suraksha-kawach-vercel
npm install
```

#### SurakshaKawach-MoblieFrontend

Open in Android Studio and sync Gradle.

### 4. **Run the Servers**

- **AI Server:**  
  ```bash
  uvicorn main:app --reload
  ```
- **Node.js Backend:**  
  ```bash
  npm run dev
  ```
- **Next.js Frontends:**  
  ```bash
  npm run dev
  ```

---

## API Endpoints

### **kumbh-kawach-ai-server**

- `GET /health`  
  Health check endpoint.

- `POST /embed`  
  Generates and stores facial embedding for a user.

- `POST /match`  
  Matches a face against stored embeddings.

### **Kawach-v2-Backend**

- `/auth/*`  
  Authentication endpoints.

- `/contact/*`  
  Emergency contact management.

- `/ticket/*`  
  Ticketing and reporting.

---

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to the branch.
5. Create a pull request.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please contact the project maintainers at Abhaynamdev121@gmail.com.

---

**Kumbh Kawach** — Empowering safety and connectivity at scale.
