#!/bin/bash
bun i
cp .env.example .env
docker-compose down
docker-compose up -d
bun run dev
