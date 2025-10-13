# Groq Configuration for CV Analyzer

## 🚀 Налаштування GitHub Actions для розгортання з Groq

### Що було зроблено:

1. **Оновлено Dockerfile** - додано підтримку Groq профілю
2. **Оновлено GitHub Actions workflows** - автоматичне використання Groq
3. **Оновлено deploy.sh** - підтримка Spring профілів
4. **Налаштовано змінні середовища** для Groq API

### 📋 Необхідні GitHub Secrets:

Додайте наступні секрети в GitHub Repository Settings:

```
✅ GCP_PROJECT_ID: cv-analyzer-474713
✅ GCP_SA_KEY: (JSON ключ Service Account)
✅ GCP_SA_EMAIL: github-actions-sa@cv-analyzer-474713.iam.gserviceaccount.com
✅ GKE_CLUSTER_NAME: (назва вашого GKE кластера)
✅ GKE_ZONE: (зона кластера)
✅ GKE_REGION: (регіон кластера)
✅ GROQ_API_KEY: (ваш Groq API ключ)
✅ ADMIN_USERNAME: admin
✅ ADMIN_PASSWORD: (безпечний пароль)
```

### 🔧 Конфігурація Groq:

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

### 🚀 Розгортання:

#### Автоматичне розгортання:
```bash
git push origin develop  # Запустить деплой з Groq профілем
```

#### Ручне розгортання:
1. GitHub → Actions → "Manual Deploy"
2. Виберіть branch: `develop`
3. Environment: `staging` або `production`
4. Image tag: `latest`

#### Локальне розгортання:
```bash
cd backend
GCP_PROJECT_ID=cv-analyzer-474713 \
SPRING_PROFILES_ACTIVE=groq \
GROQ_API_KEY=your-groq-key \
./deploy.sh
```

### 📊 Моніторинг:

#### Перевірка логів:
```bash
kubectl logs -l app=cv-analyzer --tail=50
```

#### Перевірка змінних середовища:
```bash
kubectl get deployment cv-analyzer -o yaml | grep -A 10 env:
```

#### Перевірка Spring профілю:
```bash
kubectl logs -l app=cv-analyzer | grep "The following profiles are active"
```

### 🔍 Troubleshooting:

#### Помилка: "Groq API key not found"
- Перевірте наявність `GROQ_API_KEY` в GitHub Secrets
- Переконайтеся, що змінна передається в deployment

#### Помилка: "Wrong profile active"
- Перевірте лог: `kubectl logs -l app=cv-analyzer | grep "profiles are active"`
- Має показувати: `The following profiles are active: groq`

#### Помилка: "Model not found"
- Перевірте, що модель `llama-3.1-8b-instant` доступна в Groq
- Спробуйте іншу модель: `mixtral-8x7b-32768`

### 💡 Переваги Groq:

- **Швидкість**: Набагато швидше ніж OpenAI
- **Вартість**: Дешевше за OpenAI API
- **Якість**: Відмінна якість для аналізу CV
- **Сумісність**: OpenAI-compatible API

### 🎯 Наступні кроки:

1. Налаштуйте GitHub Secrets
2. Протестуйте розгортання
3. Перевірте логи для підтвердження Groq профілю
4. Налаштуйте моніторинг використання API
