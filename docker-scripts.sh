#!/bin/bash

# CV Analyzer Docker Management Script

set -e

PROFILE=${SPRING_PROFILES_ACTIVE:-}

case "$1" in
    "start")
        echo "Starting CV Analyzer services..."
        if [ -n "$2" ]; then
            PROFILE="$2"
        fi
        echo "Using Spring profile: ${PROFILE:-<default>}"
        SPRING_PROFILES_ACTIVE="$PROFILE" docker-compose up -d
        echo "Services started!"
        echo "Frontend: http://localhost:3000"
        echo "Backend: http://localhost:8080"
        ;;
    "stop")
        echo "Stopping CV Analyzer services..."
        docker-compose down
        echo "Services stopped!"
        ;;
    "restart")
        echo "Restarting CV Analyzer services..."
        if [ -n "$2" ]; then
            PROFILE="$2"
        fi
        docker-compose down
        echo "Using Spring profile: ${PROFILE:-<default>}"
        SPRING_PROFILES_ACTIVE="$PROFILE" docker-compose up -d
        echo "Services restarted!"
        ;;
    "build")
        echo "Building CV Analyzer images..."
        if [ -n "$2" ]; then
            PROFILE="$2"
        fi
        echo "Using Spring profile: ${PROFILE:-<default>}"
        SPRING_PROFILES_ACTIVE="$PROFILE" docker-compose build
        echo "Images built successfully!"
        ;;
    "logs")
        if [ -z "$2" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f "$2"
        fi
        ;;
    "dev")
        echo "Starting CV Analyzer in development mode..."
        if [ -n "$2" ]; then
            PROFILE="$2"
        fi
        echo "Using Spring profile: ${PROFILE:-dev}"
        SPRING_PROFILES_ACTIVE="${PROFILE:-dev}" docker-compose -f docker-compose.dev.yml up --build
        ;;
    "dev-stop")
        echo "Stopping CV Analyzer development services..."
        docker-compose -f docker-compose.dev.yml down
        ;;
    "clean")
        echo "Cleaning up Docker resources..."
        docker-compose down -v --rmi all
        docker system prune -f
        echo "Cleanup completed!"
        ;;
    "status")
        echo "CV Analyzer service status:"
        docker-compose ps
        ;;
    "test")
        echo "Testing CV Analyzer services..."
        echo "Testing backend health..."
        curl -s http://localhost:8080/actuator/health | jq '.status' 2>/dev/null || echo "Backend health check failed"
        echo "Testing frontend..."
        curl -s -I http://localhost:3000 | head -1 2>/dev/null || echo "Frontend health check failed"
        ;;
    *)
        echo "CV Analyzer Docker Management Script"
        echo ""
        echo "Usage: $0 {start|stop|restart|build|logs|dev|dev-stop|clean|status|test} [profile]"
        echo ""
        echo "Commands:"
        echo "  start     - Start all services in production mode (profile optional: main|groq|ollama|docker-llm)"
        echo "  stop      - Stop all services"
        echo "  restart   - Restart all services (profile optional: main|groq|ollama|docker-llm)"
        echo "  build     - Build all Docker images (profile optional: main|groq|ollama|docker-llm)"
        echo "  logs      - Show logs (all services or specific service)"
        echo "  dev       - Start services in development mode with hot reloading (profile optional: dev|groq|ollama|docker-llm)"
        echo "  dev-stop  - Stop development services"
        echo "  clean     - Clean up all Docker resources"
        echo "  status    - Show service status"
        echo "  test      - Test if services are responding"
        echo ""
        echo "Examples:"
        echo "  $0 start main"
        echo "  $0 start groq"
        echo "  $0 start ollama"
        echo "  $0 start docker-llm"
        :
        echo "  $0 logs backend"
        echo "  $0 dev groq"
        echo "  $0 dev ollama"
        echo "  $0 dev docker-llm"
        :
        ;;
esac
