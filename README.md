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

## 🚗 Модуль Автопарк

### Функциональность

- **Управление автомобилями**: CRUD операции для транспортных средств
- **Поиск и фильтрация**: По номеру, VIN, марке, модели, статусу, городу
- **Пагинация**: Настраиваемый размер страницы (10/25/50)
- **Детальная информация**: Полная информация об автомобиле
- **Валидация**: Проверка российских номеров и VIN кодов

### Поля автомобиля

- **Основные**: Номер, VIN, марка, модель, год, цвет
- **Статус**: Доступен, Арендован (такси/тур), На ТО, На осмотре, Неактивен
- **Местоположение**: Город (Псков, Печоры, Себеж, Остров, Опочка)
- **Дополнительно**: Пробег, владелец, номер ОСАГО
- **Системные**: Дата создания, дата обновления

### API Endpoints

```bash
# Получить список автомобилей
GET /api/v1/vehicles?q=А111&status=AVAILABLE&page=1&page_size=10

# Получить автомобиль по ID
GET /api/v1/vehicles/{id}

# Создать автомобиль
POST /api/v1/vehicles
{
  "plate_number": "А111АА77",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2023,
  "status": "AVAILABLE"
}

# Обновить автомобиль
PUT /api/v1/vehicles/{id}

# Удалить автомобиль
DELETE /api/v1/vehicles/{id}
```

### Celery задачи

При создании автомобиля автоматически запускается задача `vehicle_created_event`, которую можно отслеживать в Flower.

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

# Просмотр истории миграций
docker compose exec backend alembic history

# Откат миграции
docker compose exec backend alembic downgrade -1
```

### Миграции базы данных

Миграции автоматически применяются при запуске backend сервиса. Для ручного управления:

```bash
# Применить все миграции
docker compose exec backend alembic upgrade head

# Создать миграцию для изменений в моделях
docker compose exec backend alembic revision --autogenerate -m "Add new field"

# Применить конкретную миграцию
docker compose exec backend alembic upgrade 0002
```

### Frontend разработка

```bash
# Вход в контейнер frontend
docker compose exec frontend sh

# Установка новых зависимостей
docker compose exec frontend npm install <package-name>
```

### Лэйаут и стили

Приложение использует фиксированный лэйаут:
- **Header**: Фиксированный сверху, не прокручивается
- **Sidebar**: Фиксированный слева, скрывается на мобильных устройствах
- **Main content**: Прокручиваемая область с фиксированной высотой

#### Адаптивность

- **Desktop (lg+)**: Sidebar всегда видим, контент с отступом слева
- **Mobile (< lg)**: Sidebar скрыт, открывается по кнопке бургера
- **Breakpoints**: Используются стандартные Tailwind breakpoints

#### Изменение размеров

Размеры можно настроить в `src/components/Layout.tsx`:
- Ширина sidebar: `w-64` (256px)
- Высота header: `pt-16` (4rem)
- Z-index слои: header (z-50), sidebar (z-40), overlay (z-30)

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

## 🧪 Тестирование

### Smoke тесты

После запуска системы можно проверить основные функции:

```bash
# Проверка API
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/ping

# Создание автомобиля
curl -X POST http://localhost:8000/api/v1/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "plate_number": "А111АА77",
    "brand": "Toyota",
    "model": "Camry",
    "year": 2023,
    "status": "AVAILABLE"
  }'

# Получение списка автомобилей
curl http://localhost:8000/api/v1/vehicles
```

### Проверка Celery

1. Откройте Flower: http://localhost:5555
2. Создайте автомобиль через API или UI
3. Проверьте выполнение задачи `vehicle_created_event`

## 📞 Поддержка

При возникновении проблем проверьте:
1. Логи сервисов: `docker compose logs -f <service>`
2. Статус контейнеров: `docker compose ps`
3. Использование портов: `netstat -tulpn | grep :5173`
4. Состояние базы данных: `docker compose exec postgres psql -U drivecore -d drivecore -c "\dt"`

---

**DriveCore v2** - Современная система управления автопарком 🚗
