# Mobility Sharing Fullstack

Complete Mobility Sharing monorepo.

- `backend`: Java 21, Spring Boot, MySQL, Flyway, and JWT authentication.
- `frontend-angular-ionic`: Ionic + Angular web frontend.
- `frontend-react-expo`: React Native/Expo frontend, compatible with web and mobile.
- `docker-compose.yml`: starts the database, backend, and both frontends.

## Quick Start

```bash
docker compose up -d --build
```

Services:

- Ionic + Angular: http://localhost:3000
- React Native/Expo Web: http://localhost:3001
- Backend API: http://localhost:8080
- Swagger/OpenAPI: http://localhost:8080/doc
- Backend health: http://localhost:9090/actuator/health
- MySQL: localhost:3307

## Start Individual Services

```bash
docker compose up -d --build db backend
docker compose up -d --build frontend-ionic
docker compose up -d --build frontend-react
```

## Local Development

Backend:

```bash
cd backend
./mvnw spring-boot:run
```

Ionic + Angular frontend:

```bash
cd frontend-angular-ionic
npm install
npm start
```

React Native/Expo frontend:

```bash
cd frontend-react-expo
npm install
npm start
```

For a physical mobile device with Expo, use your computer's local network IP:

```powershell
$env:EXPO_PUBLIC_API_URL="http://YOUR_LOCAL_IP:8080"
npm start
```

For the Android emulator:

```powershell
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:8080"
npm start
```

## Environment Variables

You can copy `.env.example` to `.env` and customize credentials if needed:

```bash
cp .env.example .env
```

Docker Compose includes default values, so the project can run without extra configuration.
