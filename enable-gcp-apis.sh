#!/bin/bash

# Script to enable required Google Cloud APIs

set -e

PROJECT_ID="cv-analyzer-474713"

echo "🔧 Enabling required Google Cloud APIs for project: $PROJECT_ID"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo "🚀 Enabling required APIs..."

# Enable required APIs
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable containerregistry.googleapis.com

echo "✅ All required APIs enabled!"
echo ""
echo "📋 Enabled APIs:"
echo "   - Cloud Resource Manager API"
echo "   - Kubernetes Engine API"
echo "   - Artifact Registry API"
echo "   - Cloud Storage API"
echo "   - Container Registry API"
echo ""
echo "⏱️  Please wait 2-3 minutes for APIs to propagate, then try the GitHub Actions workflow again."
