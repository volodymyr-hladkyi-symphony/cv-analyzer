# 🚀 Швидке виправлення: Cloud Resource Manager API

## ❌ Поточна помилка:
```
Cloud Resource Manager API has not been used in project 15155041339 before or it is disabled
```

## ✅ Рішення 1: Увімкніть APIs (рекомендовано)

### Виконайте в gcloud CLI:
```bash
# Встановіть проект
gcloud config set project cv-analyzer-474713

# Увімкніть необхідні APIs
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable storage.googleapis.com
```

### Або використайте скрипт:
```bash
chmod +x enable-gcp-apis.sh
./enable-gcp-apis.sh
```

## 🔄 Рішення 2: Використайте спрощений workflow

Якщо не хочете увімкнути APIs, використайте спрощений workflow:

1. GitHub → Actions → **"Simple GCR Deploy (Minimal Permissions)"**
2. Run workflow
3. Цей workflow не перевіряє дозволи, тому не потребує Cloud Resource Manager API

## 🌐 Рішення 3: Увімкніть через веб-консоль

Перейдіть за посиланням з помилки:
```
https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=15155041339
```

Або увімкніть всі необхідні APIs:
1. [Cloud Resource Manager API](https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=15155041339)
2. [Kubernetes Engine API](https://console.developers.google.com/apis/api/container.googleapis.com/overview?project=15155041339)
3. [Artifact Registry API](https://console.developers.google.com/apis/api/artifactregistry.googleapis.com/overview?project=15155041339)
4. [Cloud Storage API](https://console.developers.google.com/apis/api/storage.googleapis.com/overview?project=15155041339)

## ⏱️ Час активації

Після увімкнення APIs:
- **Локально**: негайно
- **GitHub Actions**: 2-3 хвилини
- **Повне поширення**: до 10 хвилин

## 🧪 Тестування

### Після увімкнення APIs:
1. Запустіть оригінальний workflow: **"Deploy to GKE"**
2. Перевірте логи - помилка з API має зникнути

### Якщо використовуєте спрощений workflow:
1. GitHub → Actions → **"Simple GCR Deploy"**
2. Run workflow
3. Це має працювати без помилок API

## 🔍 Перевірка статусу APIs

```bash
# Перевірте, які APIs увімкнені
gcloud services list --enabled --filter="name:cloudresourcemanager.googleapis.com OR name:container.googleapis.com OR name:artifactregistry.googleapis.com"
```

## 💡 Альтернативні рішення

### Якщо не можете увімкнути APIs:
1. **Використайте Artifact Registry workflow** - часто має менше обмежень
2. **Використайте спрощений workflow** - не перевіряє дозволи
3. **Локальне розгортання** - використайте `deploy.sh` локально

### Для локального розгортання:
```bash
cd backend
GCP_PROJECT_ID=cv-analyzer-474713 ./deploy.sh
```

## 🎯 Рекомендації

1. **Найпростіше**: Увімкніть APIs через gcloud CLI
2. **Найшвидше**: Використайте "Simple GCR Deploy" workflow
3. **Найнадійніше**: Artifact Registry workflow

## 📞 Підтримка

Якщо проблеми залишаються:
1. Перевірте, що ви маєте права власника проекту
2. Переконайтеся, що проект існує та активний
3. Зачекайте 10 хвилин після увімкнення APIs
