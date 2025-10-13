#!/bin/bash
set -e

# Variables (can be overridden via environment variables)
PROJECT_ID=${GCP_PROJECT_ID:-"cv-analyzer-474713"}
IMAGE_NAME="gcr.io/${PROJECT_ID}/candidate-matcher"
IMAGE_TAG=${IMAGE_TAG:-"latest"}
DEPLOYMENT_NAME="cv-analyzer"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting deployment process..."

# Check required variables
if [ -z "$PROJECT_ID" ]; then
    log "ERROR: GCP_PROJECT_ID is not set"
    exit 1
fi

log "Project ID: $PROJECT_ID"
log "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
log "Deployment: $DEPLOYMENT_NAME"

# 1. Create builder for cross-platform
log "Setting up Docker buildx..."
docker buildx create --use --name mybuilder || true
docker buildx inspect --bootstrap

# 2. Build for linux/amd64
log "Building Docker image..."
docker buildx build --platform=linux/amd64 \
    -t ${IMAGE_NAME}:${IMAGE_TAG} \
    --load .

# 3. Push to GCP
log "Pushing image to GCR..."
docker push ${IMAGE_NAME}:${IMAGE_TAG}

# 4. Update Deployment in GKE
log "Updating Kubernetes deployment..."
kubectl set image deployment/${DEPLOYMENT_NAME} candidate-matcher=${IMAGE_NAME}:${IMAGE_TAG}
kubectl rollout status deployment/${DEPLOYMENT_NAME} --timeout=300s

# 5. Check pods
log "Checking deployment status..."
kubectl get pods -l app=${DEPLOYMENT_NAME}
kubectl logs -l app=${DEPLOYMENT_NAME} --tail=50

log "Deployment completed successfully!"
