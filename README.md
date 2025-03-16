# Headout-Globetrotter-Challenge
Globetrotter is a full-stack web app where users get cryptic clues about a famous place and must guess which destination it refers to. Once they guess, they'll unlock fun facts, trivia, and surprises about the destination!


## 🚀 Live Demo
[To Play , Click Here](https://extraordinary-creation-production.up.railway.app/)

## 🛠 Tech Stack & Architecture

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB
- **Key Features**:
  * RESTful API design
  * Async support
  * Data validation
  * Efficient database operations

### Frontend
- **Framework**: Vue.js
- **Styling**: Tailwind CSS
- **Technologies**:
  * HTML5
  * Responsive design
  * Component-based architecture

### Deployment
- **Platform**: Railway
- **Continuous Deployment**: Automated CI/CD pipeline

## 🎯 Project Overview

### 1. Dataset
- [x] Created a comprehensive dataset of 100+ destinations
- [x] Utilized AI tools for dataset expansion
- [x] Dataset includes:
  * Cryptic clues for each destination
  * Fun facts
  * Interesting trivia

### 2. Web Application Features
#### Gameplay Mechanics
- [x] Randomly select 1-2 clues for a destination
- [ ] Multiple-choice destination guessing
- [x] Immediate feedback system
  * Correct Answer:
    - Confetti animation
    - Reveal a fun fact
  * Incorrect Answer:
    - Sad-face animation
    - Reveal a fun fact
- [x] 'Play Again' or 'Next' button to load a different destination
- [x] User score tracking
  * Total correct answers
  * Total incorrect answers

#### Backend Requirements
- [x] Storing dataset on backend
- [x] Preventing users from accessing all questions/answers through source code

### 3. "Challenge a Friend" Feature
#### User Registration
- [x] Username is entered before playing
- [x] It Creates user profile in the system if username is found unique, else re-enter username message is displayed

#### Friend Challenge Mechanism
- [x] 'Challenge a Friend' button functionality
- [x] Share popup with:
  * Dynamic invite image
  * WhatsApp invitation link
- [x] Display invitee's score to the invited friend
- [x] Invitation link provides full game access

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/BelieveInTheLimitless/Headout-Globetrotter-Challenge.git
cd Headout-Globetrotter-Challenge
```

### 2. Running the application with Docker Compose
Ensure Docker is installed on your system. Then run the following command to start all services (MongoDB, backend, and frontend) using Docker Compose:
```bash
docker-compose up --build
```
This command builds and starts all the containers defined in your `docker-compose.yml` file. You can access the frontend at `http://localhost:3001` and the backend API at `http://localhost:5001`.
