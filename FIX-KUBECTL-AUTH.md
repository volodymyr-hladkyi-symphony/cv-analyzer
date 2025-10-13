# 🔧 Fix: gke-gcloud-auth-plugin Not Installed

## ❌ Current Error:
```
executable gke-gcloud-auth-plugin not found
couldn't get current server API group list
```

## ✅ Solution: Install gke-gcloud-auth-plugin

### For GitHub Actions (automatic):
All workflows now automatically install the plugin:
```yaml
- name: Install gke-gcloud-auth-plugin
  run: |
    gcloud components install gke-gcloud-auth-plugin
    echo "✅ gke-gcloud-auth-plugin installed"
```

### For Local Development:

#### Option 1: Use the script
```bash
chmod +x install-kubectl-gke.sh
./install-kubectl-gke.sh
```

#### Option 2: Install manually
```bash
# Install gke-gcloud-auth-plugin
gcloud components install gke-gcloud-auth-plugin

# Install kubectl (if not installed)
# Linux:
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# macOS (with Homebrew):
brew install kubectl

# macOS (without Homebrew):
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

## 🔄 Updated Workflows:

1. **"Deploy to GKE"** - now installs the plugin
2. **"Simple GCR Deploy"** - now installs the plugin
3. **"Deploy to GKE (Artifact Registry)"** - now installs the plugin
4. **"Manual Deploy"** - now installs the plugin

## 🧪 Testing:

### After installing the plugin:
```bash
# Get credentials for your GKE cluster
gcloud container clusters get-credentials YOUR_CLUSTER_NAME \
  --zone YOUR_ZONE \
  --project cv-analyzer-474713

# Test kubectl
kubectl get pods
kubectl cluster-info
```

### In GitHub Actions:
1. Run any workflow
2. Check logs - the plugin should be installed automatically
3. kubectl commands should work

## 🔍 Verification:

```bash
# Check that the plugin is installed
gcloud components list --filter="name:gke-gcloud-auth-plugin"

# Check kubectl version
kubectl version --client

# Check cluster connection
kubectl cluster-info
```

## 🚨 Troubleshooting:

### Error: "gcloud components install failed"
```bash
# Update gcloud CLI
gcloud components update

# Try again
gcloud components install gke-gcloud-auth-plugin
```

### Error: "kubectl not found"
```bash
# Check PATH
echo $PATH

# Add /usr/local/bin to PATH
export PATH=$PATH:/usr/local/bin

# Check kubectl
which kubectl
```

### Error: "Still can't connect to cluster"
```bash
# Check credentials
gcloud auth list

# Check project
gcloud config get-value project

# Get credentials again
gcloud container clusters get-credentials YOUR_CLUSTER_NAME \
  --zone YOUR_ZONE \
  --project cv-analyzer-474713
```

## 💡 Alternative Solutions:

### If the plugin still doesn't work:
1. **Update gcloud CLI** to the latest version
2. **Use legacy auth** (temporarily):
   ```bash
   gcloud container clusters get-credentials YOUR_CLUSTER_NAME \
     --zone YOUR_ZONE \
     --project cv-analyzer-474713 \
     --internal-ip
   ```

### For Docker containers:
```dockerfile
# Add to Dockerfile
RUN gcloud components install gke-gcloud-auth-plugin
```

## 🎯 Next Steps:

1. **Run the workflow again** - the plugin will be installed automatically
2. **Check logs** - kubectl commands should work
3. **Test deployment** - check pod status

## 📞 Support:

If problems persist:
1. Check gcloud CLI version: `gcloud version`
2. Update to the latest version: `gcloud components update`
3. Check that the project is correct: `gcloud config get-value project`
