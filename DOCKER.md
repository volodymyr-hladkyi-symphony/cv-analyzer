# Docker Setup for CV Analyzer

This document explains how to run the CV Analyzer application using Docker and Docker Compose.

## Prerequisites

- Docker
- Docker Compose
- OpenAI API Key

## Quick Start

### 1. Set up Environment Variables

Create a `.env` file in the root directory (if not already present):

```bash
OPENAI_API_KEY=your_openai_api_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### 2. Run with Docker Compose

#### Production Mode
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

##### Selecting an AI Profile (OpenAI vs Groq vs Docker LLM)
You can switch between AI providers by setting `SPRING_PROFILES_ACTIVE`:

```bash
# OpenAI (default configuration)
docker-compose up -d

# Groq profile (uses application-groq.properties)
SPRING_PROFILES_ACTIVE=groq docker-compose up -d

# Local Docker LLM profile (uses application-docker-llm.properties)
SPRING_PROFILES_ACTIVE=docker-llm docker-compose up -d
```

#### Development Mode
```bash
# Build and start development services
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d --build

# Override the default dev profile with Groq
SPRING_PROFILES_ACTIVE=groq docker-compose -f docker-compose.dev.yml up --build

# Override the default dev profile with local Docker LLM
SPRING_PROFILES_ACTIVE=docker-llm docker-compose -f docker-compose.dev.yml up --build
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health

## Service Architecture

### Backend Service
- **Image**: Spring Boot application with Java 17
- **Port**: 8080
- **Features**:
  - Multi-stage build for optimized image size
  - Health checks
  - Volume mounts for CVs and prompts
  - Environment variable configuration

### Frontend Service
- **Image**: React application served by Nginx
- **Port**: 3000 (mapped to container port 80)
- **Features**:
  - Multi-stage build with Nginx
  - API proxy configuration
  - Gzip compression
  - React Router support

## Development Workflow

### Hot Reloading
The development setup includes:
- Source code volume mounts
- Hot reloading for both frontend and backend
- Shared Maven cache for faster builds

### Development Commands
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Start development with Groq profile
SPRING_PROFILES_ACTIVE=groq docker-compose -f docker-compose.dev.yml up --build

# Start development with local Docker LLM profile
SPRING_PROFILES_ACTIVE=docker-llm docker-compose -f docker-compose.dev.yml up --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

## Production Deployment

### Building Production Images
```bash
# Build backend
docker build -t cv-analyzer-backend ./backend

# Build frontend
docker build -t cv-analyzer-frontend ./frontend
```

### Running Production Stack
```bash
# Start production stack
docker-compose up -d

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key (required) | - |
| `ADMIN_USERNAME` | Admin username | admin |
| `ADMIN_PASSWORD` | Admin password | admin |

### Volume Mounts

- **CVs**: `./backend/src/main/resources/cvs:/app/cvs:ro`
- **Prompts**: `./backend/src/main/resources/prompts:/app/prompts:ro`

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :8080 -i :3000
   
   # Change ports in docker-compose.yml if needed
   ```

2. **Build Failures**
   ```bash
   # Clean and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

3. **Environment Variables**
   ```bash
   # Verify .env file exists and has correct values
   cat .env
   
   # Check environment variables in containers
   docker-compose exec backend env | grep OPENAI
   ```

### Health Checks

Both services include health checks:
- **Backend**: `http://localhost:8080/actuator/health`
- **Frontend**: `http://localhost:80`

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup
docker system prune -a
```

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **Network Isolation**: Services communicate through internal Docker network
3. **Read-only Volumes**: CV and prompt volumes are mounted as read-only
4. **Health Checks**: Ensure services are healthy before accepting traffic

## Performance Optimization

1. **Multi-stage Builds**: Reduce final image size
2. **Layer Caching**: Optimize build times
3. **Gzip Compression**: Enabled in Nginx configuration
4. **Resource Limits**: Configure memory and CPU limits as needed


