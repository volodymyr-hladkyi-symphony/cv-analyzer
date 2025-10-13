# 🚀 Quick CI/CD Setup

## ❌ Current Issue: GitHub Secrets Not Configured

### 📋 Step 1: Check for Secrets

Go to your GitHub Repository:
1. **Settings** → **Secrets and variables** → **Actions**
2. Check for these secrets:

```
❓ GCP_PROJECT_ID: cv-analyzer-474713
❓ GCP_SA_KEY: (Service Account JSON key)
❓ GCP_SA_EMAIL: github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com
❓ GKE_CLUSTER_NAME: (cluster name)
❓ GKE_ZONE: (cluster zone)
❓ GKE_REGION: (cluster region)
❓ GROQ_API_KEY: (your Groq API key)
❓ ADMIN_USERNAME: admin
❓ ADMIN_PASSWORD: (secure password)
```

### 🔧 Step 2: If Secrets Are Missing

#### Option A: Create a Service Account Key
```bash
# Install gcloud CLI and authenticate
gcloud auth login

# Create Service Account
gcloud iam service-accounts create github-actions-sa \
    --display-name="GitHub Actions Service Account"

# Grant roles
gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/container.developer"

gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Create key
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com
```

#### Option B: Use Simple Test
1. GitHub → Actions → "Simple Deploy (No Secrets Required)"
2. Click "Run workflow"
3. This will build a Docker image without deployment

### 📝 Step 3: Add Secrets to GitHub

1. Open the `github-actions-key.json` file
2. Copy the entire JSON content
3. GitHub → Settings → Secrets → New repository secret
4. Name: `GCP_SA_KEY`
5. Value: JSON content

Repeat for all required secrets.

### 🧪 Step 4: Test the Setup

#### Test 1: Simple Build
```bash
# GitHub → Actions → "Simple Deploy" → Run workflow
```

#### Test 2: Check Secrets
```bash
# GitHub → Actions → "Test Secrets" → Run workflow
```

#### Test 3: Full Deploy
```bash
# GitHub → Actions → "Manual Deploy" → Run workflow
```

### 🔍 Troubleshooting

#### Error: "credentials_json not found"
- Check that `GCP_SA_KEY` exists in GitHub Secrets
- Make sure the JSON key is correct

#### Error: "No environments"
- Fixed: dependency on environments removed
- Use "Manual Deploy" instead of environments

#### Error: "Cluster not found"
- Check `GKE_CLUSTER_NAME`, `GKE_ZONE`, `GKE_REGION`
- Make sure the cluster exists in GCP

### 🎯 Quick Start (No GCP)

If you just want to test the build:

1. GitHub → Actions → "Simple Deploy"
2. Run workflow
3. Check logs – the image will be built locally

### 📞 Support

If issues persist:
1. Run the "Test Secrets" workflow
2. Check logs for detailed information
3. Make sure all secrets are configured correctly

## ✅ After Setup

When all secrets are configured:
```bash
git push origin develop  # Triggers automatic deployment
```
