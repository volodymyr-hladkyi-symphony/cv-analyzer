# 🚀 Швидке налаштування CI/CD

## ❌ Поточна проблема: GitHub Secrets не налаштовані

### 📋 Крок 1: Перевірте наявність Secrets

Перейдіть в GitHub Repository:
1. **Settings** → **Secrets and variables** → **Actions**
2. Перевірте наявність цих секретів:

```
❓ GCP_PROJECT_ID: cv-analyzer-474713
❓ GCP_SA_KEY: (JSON ключ Service Account)
❓ GCP_SA_EMAIL: github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com
❓ GKE_CLUSTER_NAME: (назва кластера)
❓ GKE_ZONE: (зона кластера)
❓ GKE_REGION: (регіон кластера)
❓ GROQ_API_KEY: (ваш Groq API ключ)
❓ ADMIN_USERNAME: admin
❓ ADMIN_PASSWORD: (безпечний пароль)
```

### 🔧 Крок 2: Якщо секрети відсутні

#### Варіант A: Створіть Service Account ключ
```bash
# Встановіть gcloud CLI та авторизуйтесь
gcloud auth login

# Створіть Service Account
gcloud iam service-accounts create github-actions-sa \
    --display-name="GitHub Actions Service Account"

# Надайте ролі
gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/container.developer"

gcloud projects add-iam-policy-binding cv-analyzer-474713 \
    --member="serviceAccount:github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Створіть ключ
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com
```

#### Варіант B: Використовуйте простий тест
1. GitHub → Actions → "Simple Deploy (No Secrets Required)"
2. Натисніть "Run workflow"
3. Це збудує Docker образ без розгортання

### 📝 Крок 3: Додайте секрети в GitHub

1. Відкрийте файл `github-actions-key.json`
2. Скопіюйте весь JSON вміст
3. GitHub → Settings → Secrets → New repository secret
4. Назва: `GCP_SA_KEY`
5. Значення: JSON вміст

Повторіть для всіх необхідних секретів.

### 🧪 Крок 4: Протестуйте налаштування

#### Тест 1: Простий build
```bash
# GitHub → Actions → "Simple Deploy" → Run workflow
```

#### Тест 2: Перевірка секретів
```bash
# GitHub → Actions → "Test Secrets" → Run workflow
```

#### Тест 3: Повний деплой
```bash
# GitHub → Actions → "Manual Deploy" → Run workflow
```

### 🔍 Troubleshooting

#### Помилка: "credentials_json not found"
- Перевірте наявність `GCP_SA_KEY` в GitHub Secrets
- Переконайтеся, що JSON ключ правильний

#### Помилка: "No environments"
- Виправлено: видалено залежність від environments
- Використовуйте "Manual Deploy" замість environments

#### Помилка: "Cluster not found"
- Перевірте `GKE_CLUSTER_NAME`, `GKE_ZONE`, `GKE_REGION`
- Переконайтеся, що кластер існує в GCP

### 🎯 Швидкий старт (без GCP)

Якщо ви хочете просто протестувати збірку:

1. GitHub → Actions → "Simple Deploy"
2. Run workflow
3. Перевірте логи - образ збудується локально

### 📞 Підтримка

Якщо проблеми залишаються:
1. Запустіть "Test Secrets" workflow
2. Перевірте логи для детальної інформації
3. Переконайтеся, що всі секрети налаштовані правильно

## ✅ Після налаштування

Коли всі секрети налаштовані:
```bash
git push origin develop  # Запустить автоматичний деплой
```
