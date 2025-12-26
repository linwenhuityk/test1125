# HR Magic Box - Lucky Draw & Team Organizer

A React application built with Vite, utilizing TypeScript for type safety.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Building for Production

Build the application for production:
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

## 🛠 Project Structure

- `src/`: Source code
  - `components/`: React components
  - `App.tsx`: Main application component
  - `index.tsx`: Entry point
- `public/`: Static assets
- `vite.config.ts`: Vite configuration

## 📦 Deployment

This project is configured to automatically deploy to **GitHub Pages** using GitHub Actions.

1. Push your changes to the `main` branch.
2. The GitHub Action defined in `.github/workflows/deploy.yml` will trigger.
3. It will build the project and deploy the `dist` folder to the `gh-pages` branch.
4. Ensure GitHub Pages settings in your repository are set to serve from the `gh-pages` branch.
