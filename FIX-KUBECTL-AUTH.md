# 🔧 Виправлення: gke-gcloud-auth-plugin не встановлений

## ❌ Поточна помилка:
```
executable gke-gcloud-auth-plugin not found
couldn't get current server API group list
```

## ✅ Рішення: Встановлення gke-gcloud-auth-plugin

### Для GitHub Actions (автоматично):
Всі workflows тепер автоматично встановлюють plugin:
```yaml
- name: Install gke-gcloud-auth-plugin
  run: |
    gcloud components install gke-gcloud-auth-plugin
    echo "✅ gke-gcloud-auth-plugin installed"
```

### Для локальної розробки:

#### Варіант 1: Використайте скрипт
```bash
chmod +x install-kubectl-gke.sh
./install-kubectl-gke.sh
```

#### Варіант 2: Встановіть вручну
```bash
# Встановіть gke-gcloud-auth-plugin
gcloud components install gke-gcloud-auth-plugin

# Встановіть kubectl (якщо не встановлений)
# Linux:
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# macOS (з Homebrew):
brew install kubectl

# macOS (без Homebrew):
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

## 🔄 Оновлені workflows:

1. **"Deploy to GKE"** - тепер встановлює plugin
2. **"Simple GCR Deploy"** - тепер встановлює plugin  
3. **"Deploy to GKE (Artifact Registry)"** - тепер встановлює plugin
4. **"Manual Deploy"** - тепер встановлює plugin

## 🧪 Тестування:

### Після встановлення plugin:
```bash
# Отримайте credentials для GKE кластера
gcloud container clusters get-credentials YOUR_CLUSTER_NAME \
  --zone YOUR_ZONE \
  --project cv-analyzer-474713

# Протестуйте kubectl
kubectl get pods
kubectl cluster-info
```

### В GitHub Actions:
1. Запустіть будь-який workflow
2. Перевірте логи - plugin має встановитися автоматично
3. kubectl команди мають працювати

## 🔍 Перевірка встановлення:

```bash
# Перевірте, що plugin встановлений
gcloud components list --filter="name:gke-gcloud-auth-plugin"

# Перевірте kubectl версію
kubectl version --client

# Перевірте підключення до кластера
kubectl cluster-info
```

## 🚨 Troubleshooting:

### Помилка: "gcloud components install failed"
```bash
# Оновіть gcloud CLI
gcloud components update

# Спробуйте знову
gcloud components install gke-gcloud-auth-plugin
```

### Помилка: "kubectl not found"
```bash
# Перевірте PATH
echo $PATH

# Додайте /usr/local/bin до PATH
export PATH=$PATH:/usr/local/bin

# Перевірте kubectl
which kubectl
```

### Помилка: "Still can't connect to cluster"
```bash
# Перевірте credentials
gcloud auth list

# Перевірте проект
gcloud config get-value project

# Отримайте credentials знову
gcloud container clusters get-credentials YOUR_CLUSTER_NAME \
  --zone YOUR_ZONE \
  --project cv-analyzer-474713
```

## 💡 Альтернативні рішення:

### Якщо plugin все ще не працює:
1. **Оновіть gcloud CLI** до останньої версії
2. **Використайте legacy auth** (тимчасово):
   ```bash
   gcloud container clusters get-credentials YOUR_CLUSTER_NAME \
     --zone YOUR_ZONE \
     --project cv-analyzer-474713 \
     --internal-ip
   ```

### Для Docker контейнерів:
```dockerfile
# Додайте до Dockerfile
RUN gcloud components install gke-gcloud-auth-plugin
```

## 🎯 Наступні кроки:

1. **Запустіть workflow знову** - plugin встановиться автоматично
2. **Перевірте логи** - kubectl команди мають працювати
3. **Протестуйте deployment** - перевірте статус подів

## 📞 Підтримка:

Якщо проблеми залишаються:
1. Перевірте версію gcloud CLI: `gcloud version`
2. Оновіть до останньої версії: `gcloud components update`
3. Перевірте, що проект правильний: `gcloud config get-value project`
