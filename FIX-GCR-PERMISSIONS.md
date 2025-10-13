# 🔧 Виправлення дозволів Google Container Registry

## ❌ Поточна помилка: Permission denied

```
denied: Permission "artifactregistry.repositories.uploadArtifacts" denied on resource "projects/***/locations/us/repositories/gcr.io"
```

## 🚀 Рішення 1: Додайте необхідні ролі

### Виконайте команди в gcloud CLI:

```bash
# Встановіть проект
gcloud config set project cv-analyzer-474713

# Додайте ролі для Service Account
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

### Або використайте скрипт:
```bash
chmod +x fix-gcr-permissions.sh
./fix-gcr-permissions.sh
```

## 🔄 Рішення 2: Використайте Artifact Registry

Якщо Container Registry продовжує давати проблеми, використайте новий Artifact Registry:

### В GitHub Actions:
1. GitHub → Actions → **"Deploy to GKE (Artifact Registry)"**
2. Run workflow

### Переваги Artifact Registry:
- ✅ Новіший та надійніший
- ✅ Кращі дозволи за замовчуванням
- ✅ Підтримка різних форматів артефактів

## 🔍 Перевірка дозволів

### Перевірте ролі Service Account:
```bash
gcloud projects get-iam-policy cv-analyzer-474713 \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com"
```

### Має показувати:
```
ROLE
roles/artifactregistry.admin
roles/artifactregistry.writer
roles/container.developer
roles/storage.admin
roles/storage.objectAdmin
```

## 🚨 Troubleshooting

### Помилка: "Service account not found"
```bash
# Перевірте, що Service Account існує
gcloud iam service-accounts list --filter="email:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com"
```

### Помилка: "Permission denied"
1. Перевірте, що ви авторизовані в gcloud:
   ```bash
   gcloud auth list
   gcloud auth login
   ```

2. Перевірте, що ви маєте права власника проекту:
   ```bash
   gcloud projects get-iam-policy cv-analyzer-474713 \
     --flatten="bindings[].members" \
     --filter="bindings.members:$(gcloud config get-value account)"
   ```

### Помилка: "API not enabled"
```bash
# Увімкніть необхідні API
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable storage.googleapis.com
```

## ⏱️ Час оновлення

Після додавання ролей:
- **Дозволи**: 1-2 хвилини
- **Service Account**: 2-3 хвилини
- **GitHub Actions**: негайно (при наступному запуску)

## 🎯 Наступні кроки

1. **Додайте ролі** (команди вище)
2. **Зачекайте 2-3 хвилини** для поширення дозволів
3. **Запустіть workflow знову**
4. **Якщо не працює** - використайте Artifact Registry workflow

## 💡 Альтернатива: Локальне тестування

Якщо проблеми з GCP продовжуються:
```bash
# Локальна збірка для тестування
cd backend
docker build -t cv-analyzer:test .
docker run -p 8080:8080 cv-analyzer:test
```
