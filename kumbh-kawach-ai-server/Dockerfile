# Base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements first for caching
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# Copy app source code
COPY . .

# Expose port Cloud Run expects
EXPOSE 8080

# Command to run FastAPI via Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
