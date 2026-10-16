import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import healthHandler from './api/health.ts';
import pm25Handler from './api/pm25.ts';
import psiHandler from './api/psi.ts';
import mapHandler from './api/map.ts';
import pharmaciesHandler from './api/pharmacies.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getServerPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (process.env.NODE_ENV === 'production' && process.env.PORT) {
    const parsed = Number(process.env.PORT);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 3000;
}

async function startServer() {
  const app = express();
  const PORT = getServerPort();

  // Mount API handlers from /api folder
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/pm25', (req, res) => pm25Handler(req, res));
  app.all('/api/psi', (req, res) => psiHandler(req, res));
  app.all('/api/map', (req, res) => mapHandler(req, res));
  app.all('/api/pharmacies', (req, res) => pharmaciesHandler(req, res));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Captain Haze server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
