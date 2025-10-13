#!/bin/bash

# Script to install kubectl and gke-gcloud-auth-plugin for local development

set -e

echo "🚀 Installing kubectl and GKE auth plugin for local development..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Install gke-gcloud-auth-plugin
echo "📦 Installing gke-gcloud-auth-plugin..."
gcloud components install gke-gcloud-auth-plugin

# Install kubectl if not present
if ! command -v kubectl &> /dev/null; then
    echo "📦 Installing kubectl..."
    
    # Detect OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        chmod +x kubectl
        sudo mv kubectl /usr/local/bin/
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install kubectl
        else
            curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
            chmod +x kubectl
            sudo mv kubectl /usr/local/bin/
        fi
    else
        echo "❌ Unsupported OS. Please install kubectl manually:"
        echo "   https://kubernetes.io/docs/tasks/tools/"
        exit 1
    fi
else
    echo "✅ kubectl is already installed"
fi

# Update PATH for current session
export PATH=$PATH:/usr/local/bin

echo "✅ Installation completed!"
echo ""
echo "📋 Installed components:"
echo "   - kubectl: $(kubectl version --client --short 2>/dev/null || echo 'installed')"
echo "   - gke-gcloud-auth-plugin: installed"
echo ""
echo "🔧 Next steps:"
echo "1. Get GKE credentials:"
echo "   gcloud container clusters get-credentials YOUR_CLUSTER_NAME --zone YOUR_ZONE --project cv-analyzer-474713"
echo ""
echo "2. Test kubectl access:"
echo "   kubectl get pods"
echo ""
echo "3. Check cluster info:"
echo "   kubectl cluster-info"
