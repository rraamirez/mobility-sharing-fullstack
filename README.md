# Mobility Sharing Fullstack

Monorepo completo de Mobility Sharing:

- `backend`: API Java 21 + Spring Boot + MySQL + Flyway + JWT.
- `frontend-angular-ionic`: frontend web Ionic + Angular.
- `frontend-react-expo`: frontend React Native/Expo, compatible con web y movil.
- `docker-compose.yml`: levanta base de datos, backend y los dos frontends.

## Arranque rapido

```bash
docker compose up -d --build
```

Servicios:

- Ionic + Angular: http://localhost:3000
- React Native/Expo Web: http://localhost:3001
- Backend API: http://localhost:8080
- Swagger/OpenAPI: http://localhost:8080/doc
- Health backend: http://localhost:9090/actuator/health
- MySQL: localhost:3307

## Levantar solo una parte

```bash
docker compose up -d --build db backend
docker compose up -d --build frontend-ionic
docker compose up -d --build frontend-react
```

## Desarrollo local

Backend:

```bash
cd backend
./mvnw spring-boot:run
```

Frontend Ionic + Angular:

```bash
cd frontend-angular-ionic
npm install
npm start
```

Frontend React Native/Expo:

```bash
cd frontend-react-expo
npm install
npm start
```

Para movil fisico con Expo, usa la IP local del PC:

```powershell
$env:EXPO_PUBLIC_API_URL="http://TU_IP_LOCAL:8080"
npm start
```

Para emulador Android:

```powershell
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:8080"
npm start
```

## Variables

Puedes copiar `.env.example` a `.env` y ajustar credenciales si lo necesitas:

```bash
cp .env.example .env
```

Docker Compose incluye valores por defecto para que el proyecto arranque sin configurar nada.
