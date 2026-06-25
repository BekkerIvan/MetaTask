#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting setup...${NC}"

# 1. Install PHP dependencies
echo -e "${GREEN}Installing Composer dependencies...${NC}"
composer install

# 2. Environment Setup
if [ ! -f .env ]; then
    echo -e "${GREEN}Creating .env file...${NC}"
    cp .env.example .env
    php artisan key:generate
else
    echo -e "${BLUE}.env file already exists. Skipping...${NC}"
fi

# 3. Install JS dependencies
echo -e "${GREEN}Installing PNPM dependencies...${NC}"
pnpm install

# 4. Database Migrations and Seeding
# --force allows running in "production" environments without interaction
# --no-interaction skips any [y/n] prompts
echo -e "${GREEN}Running database migrations and seeders...${NC}"
php artisan migrate:fresh --seed --force --no-interaction

php artisan wayfinder:generate

# 5. Build Frontend Assets
echo -e "${GREEN}Building frontend assets...${NC}"
pnpm build
