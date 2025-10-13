#!/bin/bash

# Script to fix Google Container Registry permissions for GitHub Actions

set -e

PROJECT_ID="cv-analyzer-474713"
SA_NAME="github-actions-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "🔧 Fixing GCR permissions for GitHub Actions Service Account..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo "🔑 Adding required roles for Container Registry..."

# Add Storage Admin role for GCR
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.admin" \
    --quiet

# Add Artifact Registry Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/artifactregistry.admin" \
    --quiet

# Add Artifact Registry Writer role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/artifactregistry.writer" \
    --quiet

# Add Container Registry Service Agent role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.objectAdmin" \
    --quiet

# Add Legacy Container Registry roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/containerregistry.ServiceAgent" \
    --quiet

echo "✅ GCR permissions fixed!"
echo ""
echo "📋 Added roles:"
echo "   - roles/storage.admin"
echo "   - roles/artifactregistry.admin" 
echo "   - roles/artifactregistry.writer"
echo "   - roles/storage.objectAdmin"
echo "   - roles/containerregistry.ServiceAgent"
echo ""
echo "🚀 Try running the GitHub Actions workflow again!"
echo ""
echo "💡 If you still get errors, you might need to:"
echo "   1. Wait 2-3 minutes for permissions to propagate"
echo "   2. Check if Container Registry API is enabled"
echo "   3. Verify the Service Account key is up to date in GitHub Secrets"
