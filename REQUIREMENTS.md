# Requirements and Dependencies Installation

## 1. System Requirements
- macOS, Linux, or Windows
- Node.js 20.x or newer
- npm 10.x or newer
- Internet access to download npm packages
- A TMDB API key for runtime API calls

## 2. Install Node.js and npm

## Option A: Homebrew (macOS)
```bash
brew install node
```

## Option B: nvm (recommended when managing multiple Node versions)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# Restart terminal, then:
nvm install 20
nvm use 20
```

## 3. Verify Installation
```bash
node -v
npm -v
```

Expected:
- Node version is 20+
- npm version is 10+

## 4. Install Project Dependencies
From this project directory:
```bash
cd /Users/catalin.ilea/WORK/APEX/Pathfinder/DEMO1
npm install
```

This installs all runtime and development dependencies defined in package.json.

## 5. Configure Environment Variables
1. Create a .env file from .env.example.
2. Set your TMDB API key.

```bash
cp .env.example .env
```

Then edit .env and set:
- VITE_TMDB_API_KEY
- VITE_TMDB_API_BASE_URL (optional, default provided)
- VITE_TMDB_IMAGE_BASE_URL (optional, default provided)

## 6. Run Project Commands
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 7. Dependencies Used

## Runtime dependencies
- @tanstack/react-query
- react
- react-dom
- react-router-dom

## Development dependencies
- @types/react
- @types/react-dom
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- @vitejs/plugin-react
- eslint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- typescript
- vite
