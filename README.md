# DriveCore v2

Система управления автопарком с современным веб-интерфейсом и микросервисной архитектурой.

## 🚀 Быстрый старт

### Предварительные требования

- Docker и Docker Compose
- Git

### Установка и запуск

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd drivecore-react
   ```

2. **Настройте переменные окружения:**
   ```bash
   cp env.example .env
   ```
   
   Отредактируйте `.env` файл при необходимости.

3. **Запустите все сервисы:**
   ```bash
   docker compose up -d --build
   ```

4. **Проверьте статус сервисов:**
   ```bash
   docker compose ps
   ```

## 🌐 Доступные сервисы

После запуска будут доступны следующие сервисы:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Flower (Celery UI)**: http://localhost:5555
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 📋 Структура проекта

```
drivecore-react/
├── docker-compose.yml          # Оркестрация всех сервисов
├── env.example                 # Пример переменных окружения
├── README.md                  # Этот файл
├── backend/                   # FastAPI backend
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── alembic.ini
│   └── app/
│       ├── main.py            # FastAPI приложение
│       ├── core/              # Конфигурация
│       ├── api/               # API роуты
│       ├── tasks/             # Celery задачи
│       ├── workers/           # Celery конфигурация
│       └── migrations/        # Alembic миграции
└── frontend/                  # React frontend
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── components/        # React компоненты
        └── pages/            # Страницы приложения
```

## 🔧 Управление сервисами

### Просмотр логов

```bash
# Все сервисы
docker compose logs -f

# Конкретный сервис
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f celery-worker
docker compose logs -f celery-beat
docker compose logs -f flower
```

### Перезапуск сервисов

```bash
# Все сервисы
docker compose restart

# Конкретный сервис
docker compose restart backend
```

### Остановка сервисов

```bash
# Остановка без удаления данных
docker compose stop

# Полная остановка с удалением контейнеров
docker compose down

# Остановка с удалением данных (ОСТОРОЖНО!)
docker compose down -v
```

## 🛠️ Разработка

### Backend разработка

```bash
# Вход в контейнер backend
docker compose exec backend bash

# Запуск миграций
docker compose exec backend alembic upgrade head

# Создание новой миграции
docker compose exec backend alembic revision --autogenerate -m "Описание изменений"
```

### Frontend разработка

```bash
# Вход в контейнер frontend
docker compose exec frontend sh

# Установка новых зависимостей
docker compose exec frontend npm install <package-name>
```

## 📊 Мониторинг

### Flower (Celery UI)

Flower предоставляет веб-интерфейс для мониторинга Celery задач:
- http://localhost:5555

### Health Checks

- Backend: http://localhost:8000/health
- API Ping: http://localhost:8000/api/v1/ping

## 🔍 Отладка

### Проверка подключения к базе данных

```bash
docker compose exec postgres psql -U drivecore -d drivecore -c "SELECT version();"
```

### Проверка Redis

```bash
docker compose exec redis redis-cli ping
```

### Проверка Celery

```bash
docker compose exec celery-worker celery -A app.workers.celery inspect active
```

## 📝 Переменные окружения

Основные переменные в `.env`:

```env
# База данных
POSTGRES_DB=drivecore
POSTGRES_USER=drivecore
POSTGRES_PASSWORD=drivecore

# Redis
REDIS_URL=redis://redis:6379/0

# Порты сервисов
BACKEND_PORT=8000
FLOWER_PORT=5555
FRONTEND_PORT=5173

# Часовой пояс
TZ=Europe/Moscow
```

## 🚨 Устранение неполадок

### Проблемы с портами

Если порты заняты, измените их в `.env` файле или остановите конфликтующие сервисы.

### Проблемы с базой данных

```bash
# Пересоздание базы данных
docker compose down -v
docker compose up -d postgres
docker compose exec postgres psql -U drivecore -c "CREATE DATABASE drivecore;"
docker compose up -d --build
```

### Проблемы с зависимостями

```bash
# Пересборка без кэша
docker compose build --no-cache
docker compose up -d --build
```

## 📞 Поддержка

При возникновении проблем проверьте:
1. Логи сервисов: `docker compose logs -f <service>`
2. Статус контейнеров: `docker compose ps`
3. Использование портов: `netstat -tulpn | grep :5173`

---

**DriveCore v2** - Современная система управления автопарком 🚗
