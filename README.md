
  # Syntecxhub Weather App

  A modern, animated weather dashboard built with React, TypeScript, and Vite.

  Live demo:
  https://shakib-mehrab.github.io/Syntecxhub_WeatherApp/

  ## Overview

  This project provides real-time weather data with an interactive dashboard layout, weather-reactive visual effects, and GPS-based location support.

  ## Key Features

  - Real weather data from Open-Meteo
  - City search with geocoding
  - Device GPS weather lookup (with graceful permission fallback)
  - Air quality panel (AQI + pollutant metrics)
  - Weekly forecast cards and forecast chart
  - Sunrise and sunset panel
  - Rain chance visualization
  - Dynamic weather effects (rain, snow, sunny glow, lightning)
  - Mouse-reactive atmosphere and parallax styling
  - Compact dashboard layout optimized for one-page viewing

  ## Tech Stack

  - React 18
  - TypeScript
  - Vite 6
  - Tailwind CSS 4
  - Framer Motion (motion)
  - Recharts
  - Lucide React

  ## APIs Used

  - Open-Meteo Forecast API
  - Open-Meteo Geocoding API
  - Open-Meteo Air Quality API
  - BigDataCloud Reverse Geocoding API

  All APIs used are free and do not require API keys for the current implementation.

  ## Local Setup

  1. Install dependencies

    npm install

  2. Start development server

    npm run dev

  3. Build for production

    npm run build

  ## Available Scripts

  - npm run dev: Start Vite development server
  - npm run build: Create production build in dist

  ## Deployment

  The project is configured for GitHub Pages deployment using GitHub Actions.

  - Workflow file: .github/workflows/deploy-pages.yml
  - Output directory: dist

  ## Design Reference

  Original Figma reference:
  https://www.figma.com/design/JyoXdrpgVRpWbQjKrGuM8h/Weather-Forecast-Web-App-UI
  