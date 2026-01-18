# Snooker Live Scores

A web application for tracking live snooker match scores, built with Angular 17.

## Features

- **Live Matches**: View currently ongoing matches with real-time score updates via Server-Sent Events (SSE)
- **Scheduled Matches**: Browse upcoming match schedules
- **Completed Matches**: Review finished match results
- **Match Details**: Detailed view of individual matches including frame-by-frame scores
- **Subscribe**: Subscribe to match updates via email notifications

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 18.x or higher)
  ```bash
  node --version
  ```

- **npm** (comes with Node.js)
  ```bash
  npm --version
  ```

## Installation

1. Clone or navigate to the project directory:
   ```bash
   cd /path/to/ui-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Server

Start the development server with auto-recompile on file changes:

```bash
npm start
```

The application will be available at: **http://localhost:4200**

If you need to access from other devices on your network:

```bash
npx ng serve --host 0.0.0.0
```

### Production Build

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/snooker-app` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Navigation header component
│   │   └── footer/          # Footer component
│   ├── pages/
│   │   ├── home/            # Home page with match tabs (Live/Scheduled/Completed)
│   │   └── match-details/   # Match details page with live SSE updates
│   ├── app.component.*      # Root application component
│   ├── app.config.ts        # Application configuration
│   └── app.routes.ts        # Routing configuration
├── styles.css               # Global styles
└── index.html               # Main HTML entry point
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server at http://localhost:4200 |
| `npm run build` | Build for production |
| `npm run watch` | Build in watch mode |
| `npm test` | Run unit tests |

## Configuration

### SSE Endpoint

The match details page connects to a Server-Sent Events endpoint for live score updates. By default, it connects to:

```
http://127.0.0.1:8888/events
```

To change this, edit `src/app/pages/match-details/match-details.component.ts`.

### API Endpoint

The subscription feature sends requests to:

```
/api/subscribe
```

Configure your backend server to handle these requests.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved.
