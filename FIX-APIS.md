# 🚀 Quick Fix: Cloud Resource Manager API

## ❌ Current Error:
```
Cloud Resource Manager API has not been used in project 15155041339 before or it is disabled
```

## ✅ Solution 1: Enable APIs (Recommended)

### Run in gcloud CLI:
```bash
# Set the project
gcloud config set project cv-analyzer-474713

# Enable required APIs
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable storage.googleapis.com
```

### Or use the script:
```bash
chmod +x enable-gcp-apis.sh
./enable-gcp-apis.sh
```

## 🔄 Solution 2: Use the simplified workflow

If you don't want to enable APIs, use the simplified workflow:

1. GitHub → Actions → **"Simple GCR Deploy (Minimal Permissions)"**
2. Run workflow
3. This workflow does not check permissions, so it does not require Cloud Resource Manager API

## 🌐 Solution 3: Enable via web console

Go to the link from the error:
```
https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=15155041339
```

Or enable all required APIs:
1. [Cloud Resource Manager API](https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=15155041339)
2. [Kubernetes Engine API](https://console.developers.google.com/apis/api/container.googleapis.com/overview?project=15155041339)
3. [Artifact Registry API](https://console.developers.google.com/apis/api/artifactregistry.googleapis.com/overview?project=15155041339)
4. [Cloud Storage API](https://console.developers.google.com/apis/api/storage.googleapis.com/overview?project=15155041339)

## ⏱️ Activation Time

After enabling APIs:
- **Locally**: immediately
- **GitHub Actions**: 2-3 minutes
- **Full propagation**: up to 10 minutes

## 🧪 Testing

### After enabling APIs:
1. Run the original workflow: **"Deploy to GKE"**
2. Check the logs - the API error should disappear

### If using the simplified workflow:
1. GitHub → Actions → **"Simple GCR Deploy"**
2. Run workflow
3. This should work without API errors

## 🔍 Check API status

```bash
# Check which APIs are enabled
gcloud services list --enabled --filter="name:cloudresourcemanager.googleapis.com OR name:container.googleapis.com OR name:artifactregistry.googleapis.com"
```

## 💡 Alternative Solutions

### If you cannot enable APIs:
1. **Use Artifact Registry workflow** - often has fewer restrictions
2. **Use the simplified workflow** - does not check permissions
3. **Local deployment** - use `deploy.sh` locally

### For local deployment:
```bash
cd backend
GCP_PROJECT_ID=cv-analyzer-474713 ./deploy.sh
```

## 🎯 Recommendations

1. **Easiest**: Enable APIs via gcloud CLI
2. **Fastest**: Use the "Simple GCR Deploy" workflow
3. **Most reliable**: Artifact Registry workflow

## 📞 Support

If problems persist:
1. Check that you have owner rights for the project
2. Make sure the project exists and is active
3. Wait 10 minutes after enabling APIs
