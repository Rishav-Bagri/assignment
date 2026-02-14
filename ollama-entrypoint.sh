#!/bin/bash

CONTAINER="ollama"
MODEL="llama3:8b-instruct-q4_K_M"

echo "Checking Ollama container..."

# 1️⃣ If container exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "Container exists."

    # If not running, start it
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        echo "Starting container..."
        docker start ${CONTAINER}
    else
        echo "Container already running."
    fi
else
    # 2️⃣ If container does not exist, create it
    echo "Creating new Ollama container..."
    docker run -d \
        --name ${CONTAINER} \
        -p 11434:11434 \
        -v ollama_data:/root/.ollama \
        ollama/ollama
fi

echo "Checking model..."

# 3️⃣ Check if model exists
if docker exec ${CONTAINER} ollama list | grep -q "${MODEL}"; then
    echo "Model already present."
else
    echo "Pulling model..."
    docker exec ${CONTAINER} ollama pull ${MODEL}
fi

echo "Ollama setup complete."
