# Groq Configuration for CV Analyzer

## 🚀 GitHub Actions Setup for Groq Deployment

### What Has Been Done:

1. **Dockerfile updated** – added Groq profile support
2. **GitHub Actions workflows updated** – automatic Groq usage
3. **deploy.sh updated** – Spring profiles support
4. **Environment variables configured** for Groq API

### 📋 Required GitHub Secrets:

Add the following secrets in your GitHub Repository Settings:

```
✅ GCP_PROJECT_ID: cv-analyzer-474713
✅ GCP_SA_KEY: (Service Account JSON key)
✅ GCP_SA_EMAIL: github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com
✅ GKE_CLUSTER_NAME: (your GKE cluster name)
✅ GKE_ZONE: (cluster zone)
✅ GKE_REGION: (cluster region)
✅ GROQ_API_KEY: (your Groq API key)
✅ ADMIN_USERNAME: admin
✅ ADMIN_PASSWORD: (secure password)
```

### 🔧 Groq Configuration:

#### application-groq.properties:
```properties
# Groq OpenAI-compatible API
spring.ai.openai.base-url=https://api.groq.com/openai
spring.ai.openai.api-key=${OPENAI_API_KEY}
spring.ai.openai.chat.options.model=llama-3.1-8b-instant
spring.ai.openai.chat.options.temperature=0.1

# Groq Pricing
openai.pricing.input-tokens-per-million=0.59
openai.pricing.output-tokens-per-million=0.79
```

### 🚀 Deployment:

#### Automatic Deployment:
```bash
git push origin develop  # Triggers deployment with Groq profile
```

#### Manual Deployment:
1. GitHub → Actions → "Manual Deploy"
2. Select branch: `develop`
3. Environment: `staging` or `production`
4. Image tag: `latest`

#### Local Deployment:
```bash
cd backend
GCP_PROJECT_ID=cv-analyzer-474713 \
SPRING_PROFILES_ACTIVE=groq \
GROQ_API_KEY=your-groq-key \
./deploy.sh
```

### 📊 Monitoring:

#### Check logs:
```bash
kubectl logs -l app=cv-analyzer --tail=50
```

#### Check environment variables:
```bash
kubectl get deployment cv-analyzer -o yaml | grep -A 10 env:
```

#### Check Spring profile:
```bash
kubectl logs -l app=cv-analyzer | grep "The following profiles are active"
```

### 🔍 Troubleshooting:

#### Error: "Groq API key not found"
- Check that `GROQ_API_KEY` is present in GitHub Secrets
- Make sure the variable is passed to the deployment

#### Error: "Wrong profile active"
- Check logs: `kubectl logs -l app=cv-analyzer | grep "profiles are active"`
- Should show: `The following profiles are active: groq`

#### Error: "Model not found"
- Make sure the model `llama-3.1-8b-instant` is available in Groq
- Try another model: `mixtral-8x7b-32768`

### 💡 Groq Advantages:

- **Speed**: Much faster than OpenAI
- **Cost**: Cheaper than OpenAI API
- **Quality**: Excellent for CV analysis
- **Compatibility**: OpenAI-compatible API

### 🎯 Next Steps:

1. Set up GitHub Secrets
2. Test deployment
3. Check logs to confirm Groq profile
4. Set up API usage monitoring
