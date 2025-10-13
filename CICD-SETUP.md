# CI/CD Setup for CV Analyzer

## GitHub Actions Setup for GKE Deployment

### 1. Create Service Account in GCP

```bash
# Create Service Account
gcloud iam service-accounts create github-actions-sa \
    --display-name="GitHub Actions Service Account" \
    --description="Service account for GitHub Actions CI/CD"

# Grant required roles
gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/container.developer"

gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/container.clusterViewer"

# Create key
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com
```

### 2. Configure GitHub Secrets

Add the following secrets in GitHub Repository Settings:

- `GCP_PROJECT_ID`: `cv-analyzer-474713`
- `GCP_SA_KEY`: content of `github-actions-key.json` file
- `GCP_SA_EMAIL`: `github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com`
- `GKE_CLUSTER_NAME`: your GKE cluster name
- `GKE_ZONE`: your GKE cluster zone (e.g., `us-central1-a`)
- `GKE_REGION`: your GKE cluster region (e.g., `us-central1`)

### 3. Workflows

#### Automatic Deployment (deploy.yml)
- Triggers on push to main branch
- Automatically builds and deploys the application

#### Testing (test.yml)
- Triggers on push and pull requests
- Tests backend and frontend
- Builds application for verification

#### Manual Deployment (manual-deploy.yml)
- Triggers manually via GitHub UI
- Allows selection of environment and image tag

### 4. Usage

#### Automatic Deployment:
```bash
git push origin main
```

#### Manual Deployment:
1. Go to Actions tab in GitHub
2. Select "Manual Deploy"
3. Click "Run workflow"
4. Choose environment and image tag

#### Local Deployment:
```bash
cd backend
GCP_PROJECT_ID=cv-analyzer-474713 IMAGE_TAG=v1.0 ./deploy.sh
```

### 5. Monitoring

- Check status in GitHub Actions
- View logs in GKE cluster:
```bash
kubectl logs -l app=cv-analyzer --tail=50
kubectl get pods -l app=cv-analyzer
```

### 6. Troubleshooting

#### Authentication Error:
- Verify Service Account key is correct
- Ensure all roles are granted

#### Build Error:
- Check Dockerfile
- Ensure all dependencies are installed

#### Deployment Error:
- Verify cluster name and zone
- Ensure deployment exists in the cluster
