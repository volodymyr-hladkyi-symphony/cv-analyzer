# 🔧 Fixing Google Container Registry Permissions

## ❌ Current Error: Permission denied

```
denied: Permission "artifactregistry.repositories.uploadArtifacts" denied on resource "projects/***/locations/us/repositories/gcr.io"
```

## 🚀 Solution 1: Add Required Roles

### Run these commands in gcloud CLI:

```bash
# Set the project
gcloud config set project cv-analyzer-474713

# Add roles for the Service Account
gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"
```

### Or use the script:
```bash
chmod +x fix-gcr-permissions.sh
./fix-gcr-permissions.sh
```

## 🔄 Solution 2: Use Artifact Registry

If Container Registry keeps causing issues, use the new Artifact Registry:

### In GitHub Actions:
1. GitHub → Actions → **"Deploy to GKE (Artifact Registry)"**
2. Run the workflow

### Advantages of Artifact Registry:
- ✅ Newer and more reliable
- ✅ Better default permissions
- ✅ Supports multiple artifact formats

## 🔍 Checking Permissions

### Check Service Account roles:
```bash
gcloud projects get-iam-policy cv-analyzer-474713 \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com"
```

### Should show:
```
ROLE
roles/artifactregistry.admin
roles/artifactregistry.writer
roles/container.developer
roles/storage.admin
roles/storage.objectAdmin
```

## 🚨 Troubleshooting

### Error: "Service account not found"
```bash
# Check that the Service Account exists
gcloud iam service-accounts list --filter="email:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com"
```

### Error: "Permission denied"
1. Check that you are authenticated in gcloud:
   ```bash
   gcloud auth list
   gcloud auth login
   ```

2. Check that you have owner rights for the project:
   ```bash
   gcloud projects get-iam-policy cv-analyzer-474713 \
     --flatten="bindings[].members" \
     --filter="bindings.members:$(gcloud config get-value account)"
   ```

### Error: "API not enabled"
```bash
# Enable required APIs
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable storage.googleapis.com
```

## ⏱️ Update Time

After adding roles:
- **Permissions**: 1-2 minutes
- **Service Account**: 2-3 minutes
- **GitHub Actions**: immediately (on next run)

## 🎯 Next Steps

1. **Add roles** (commands above)
2. **Wait 2-3 minutes** for permissions to propagate
3. **Run the workflow again**
4. **If it still doesn't work** - use the Artifact Registry workflow

## 💡 Alternative: Local Testing

If GCP issues persist:
```bash
# Local build for testing
cd backend
docker build -t cv-analyzer:test .
docker run -p 8080:8080 cv-analyzer:test
```
