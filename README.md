# PAM

## Requirements
+ Docker
+ MariaDB (running locally or in Docker container)
+ Java JDK >= 17
+ Gradle
+ your preferred IDE (IntelliJ CE or Ultimate Edition)

### Setup
First, you need to set the environment variables first. Change the env "AZURE_CLIENT_SECRET" and prompt this command
```bash
cp .env.example .env
```
To have an appropriate database instance for the backend, run this command:
```bash
docker compose -f docker-compose.local.yml up -d
```
This command runs the database in a detached process, means it runs by itself and not in the terminal.

#### Description
The server runs on port 8080.
You can access and send requests to the server with this url:
- http://localhost:8080

For testing and seeing the implemented REST API routes, visit this url: 
- http://localhost:8080/swagger-ui/index.html