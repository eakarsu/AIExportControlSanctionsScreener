#!/bin/bash
set -e

echo "=========================================="
echo "  Export Control & Sanctions Screener"
echo "  Starting Application..."
echo "=========================================="

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

BACKEND_PORT=${BACKEND_PORT:-4000}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# Kill any processes on our ports
echo ""
echo "[1/6] Cleaning up ports $BACKEND_PORT and $FRONTEND_PORT..."
lsof -ti:$BACKEND_PORT 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti:$FRONTEND_PORT 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Check PostgreSQL
echo "[2/6] Checking PostgreSQL..."
if ! pg_isready -q 2>/dev/null; then
  echo "Starting PostgreSQL..."
  brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || true
  sleep 2
fi

# Create database if it doesn't exist
echo "[3/6] Setting up database..."
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'export_control_screener'" 2>/dev/null | grep -q 1 || \
  createdb -U postgres export_control_screener 2>/dev/null || true

# Run schema and seed
echo "[4/6] Running schema and seeding data..."
psql -U postgres -d export_control_screener -f server/schema.sql -q 2>/dev/null
psql -U postgres -d export_control_screener -f server/seed.sql -q 2>/dev/null
echo "  Database seeded with data for all features."

# Install dependencies
echo "[5/6] Installing dependencies..."
cd server && npm install --silent 2>/dev/null && cd ..
cd client && npm install --silent 2>/dev/null && cd ..

# Start services with hot reload
echo "[6/6] Starting services..."
echo ""
echo "  Backend:  http://localhost:$BACKEND_PORT (with nodemon hot reload)"
echo "  Frontend: http://localhost:$FRONTEND_PORT (with React hot reload)"
echo ""
echo "  Login: admin@exportcontrol.com / password"
echo ""
echo "=========================================="

# Start backend with nodemon (hot reload)
cd server && npx nodemon index.js &
BACKEND_PID=$!
cd ..

# Start frontend (React dev server has built-in hot reload)
cd client && PORT=$FRONTEND_PORT npm start &
FRONTEND_PID=$!
cd ..

# Trap to cleanup on exit
cleanup() {
  echo ""
  echo "Shutting down..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  lsof -ti:$BACKEND_PORT 2>/dev/null | xargs kill -9 2>/dev/null || true
  lsof -ti:$FRONTEND_PORT 2>/dev/null | xargs kill -9 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
