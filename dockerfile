FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build


FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend

COPY --from=frontend-build /app/frontend/dist ./backend/static

ENV FLASK_APP=backend/app.py
ENV PYTHONUNBUFFERED=1

EXPOSE 10000

CMD ["gunicorn", "-b", "0.0.0.0:10000", "backend.app:app"]