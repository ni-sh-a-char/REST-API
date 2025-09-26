# REST‑API  
**REST API for performing CURD operations using Spring Boot and MongoDB**  

---  

## Table of Contents  

| Section | Description |
|---------|-------------|
| **1. Overview** | What the project does |
| **2. Prerequisites** | Software you need before installing |
| **3. Installation** | How to get the code and set it up locally |
| **4. Configuration** | Application properties, MongoDB connection, profiles |
| **5. Build & Run** | Maven/Gradle commands, Docker support |
| **6. Usage** | Starting the service and accessing the UI (Swagger) |
| **7. API Documentation** | Detailed list of endpoints, request/response schemas |
| **8. Example Calls** | `curl` / Postman snippets for each operation |
| **9. Testing** | Running unit/integration tests |
| **10. Deployment** | Docker, Kubernetes, CI/CD hints |
| **11. Contributing** | How to contribute to the project |
| **12. License** | License information |

---  

## 1. Overview  

`REST-API` is a lightweight Spring Boot application that demonstrates **C**reate, **U**pdate, **R**ead and **D**elete (CRUD) operations on a MongoDB collection.  

* **Technology stack** – Spring Boot 3.x, Spring Data MongoDB, Maven (or Gradle), Java 17+, MongoDB 6.x, Swagger UI (OpenAPI 3).  
* **Features** –  
  * Fully typed domain model (`User` by default)  
  * Reactive (WebFlux) **or** classic MVC implementation (choose via profile)  
  * Global exception handling & validation (JSR‑380)  
  * Swagger UI for interactive API exploration  
  * Dockerfile for containerised deployment  

---  

## 2. Prerequisites  

| Tool | Minimum version | Why |
|------|----------------|-----|
| **Java** | 17 (OpenJDK) | Spring Boot 3 requires Java 17+ |
| **Maven** | 3.8.6 (or Gradle 8.x) | Build & dependency management |
| **MongoDB** | 6.0 (or 5.x) | Data store |
| **Docker** *(optional)* | 20.10+ | Build & run container image |
| **Git** | any | Clone the repository |
| **cURL / HTTP client** | any | Test the API |

> **Tip** – If you prefer the Gradle wrapper, all commands below work with `./gradlew` as well.

---  

## 3. Installation  

```bash
# 1️⃣ Clone the repository
git clone https://github.com/your‑org/REST-API.git
cd REST-API

# 2️⃣ (Optional) Choose the build tool
# Maven (default)
./mvnw clean install

# Gradle (if you prefer)
./gradlew clean build
```

The build will:

* Resolve all dependencies (Spring Boot starters, Lombok, etc.)  
* Run unit tests (see §9)  
* Package the application as an executable JAR: `target/rest-api-0.1.0.jar`

---  

## 4. Configuration  

All configuration lives in `src/main/resources/application.yml`.  
A minimal configuration for a local MongoDB instance looks like:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/restapi-db
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher   # required for Spring Boot 3.x compatibility

server:
  port: 8080

# Enable Swagger UI only in dev profile
springdoc:
  api-docs:
    enabled: true
  swagger-ui:
    enabled: true
```

### Profiles  

| Profile | Purpose |
|---------|---------|
| `dev` (default) | Enables Swagger UI, verbose logging |
| `prod` | Disables Swagger UI, sets `logging.level.root=INFO` |
| `test` | In‑memory MongoDB (via `de.flapdoodle.embed.mongo`) for integration tests |

You can activate a profile with:

```bash
# Maven
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod

# JAR
java -jar target/rest-api-0.1.0.jar --spring.profiles.active=prod
```

---  

## 5. Build & Run  

### 5.1 Run directly (JAR)

```bash
# Build first (if you haven't)
./mvnw clean package -DskipTests

# Run
java -jar target/rest-api-0.1.0.jar
```

The service starts on **http://localhost:8080**.  

### 5.2 Run with Maven (hot‑reload)

```bash
./mvnw spring-boot:run
```

### 5.3 Docker  

```bash
# Build the image
docker build -t rest-api:latest .

# Run container (MongoDB must be reachable)
docker run -d -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI=mongodb://host.docker.internal:27017/restapi-db \
  --name rest-api \
  rest-api:latest
```

> **Docker‑Compose** (optional) – a ready‑made `docker-compose.yml` is provided:

```yaml
version: "3.9"
services:
  mongo:
    image: mongo:6
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  rest-api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/restapi-db
    depends_on:
      - mongo

volumes:
  mongo-data:
```

Run with `docker-compose up -d`.

---  

## 6. Usage  

### 6.1 Swagger UI  

Open a browser and navigate to:

```
http://localhost:8080/swagger-ui.html
```

All endpoints, request/response models, and example payloads are displayed automatically.

### 6.2 Health & Metrics  

* **Health** – `GET /actuator/health`  
* **Metrics** – `GET /actuator/metrics` (requires `actuator` dependency, enabled by default)

---  

## 7. API Documentation  

| Method | Path | Description | Request Body | Success Response | Errors |
|--------|------|-------------|--------------|------------------|--------|
| **POST** | `/api/users` | Create a new user | `UserDTO` (JSON) | `201 Created` + created `User` | `400 Bad Request` (validation) |
| **GET** | `/api/users` | Retrieve all users | – | `200 OK` + `List<User>` | `500 Internal Server Error` |
| **GET** | `/api/users/{id}` | Retrieve a user by ID | – | `200 OK` + `User` | `404 Not Found` |
| **PUT** | `/api/users/{id}` | Replace an existing user | `UserDTO` | `200 OK` + updated `User` | `400 Bad Request`, `404 Not Found` |
| **PATCH** | `/api/users/{id}` | Partially update a user | `Map<String,Object>` (JSON) | `200 OK` + updated `User` | `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/api/users/{id}` | Delete a user | – | `204 No Content` | `404 Not Found` |

### 7.1 Data Model  

```json
{
  "id": "63f1c2a5e4b0c9a7d5f6e8b2",   // MongoDB ObjectId (generated)
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "createdAt": "2024-09-26T12:34:56.789Z"
}
```

*All fields except `id` and `createdAt` are required when creating a user.*  

### 7.2 Validation Rules  

| Field | Constraint |
|-------|------------|
| `firstName` | `@NotBlank`, max 50 chars |
| `lastName` | `@NotBlank`, max 50 chars |
| `email` | `@Email`, unique (MongoDB index) |
| `age` | `@Min(0)`, `@Max(150)` |

If validation fails, the API returns:

```json
{
  "timestamp": "2025-09-26T14:12:34.567+00:00",
  "status": 400,
  "errors": [
    {
      "field": "email",
      "message": "must be a well‑formed email address"
    }
  ]
}
```

---  

##