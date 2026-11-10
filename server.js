import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve only public/. Never the project folder: email_list.csv and other
// private files live there and must not reach the network.
const PUBLIC_DIR = path.join(__dirname, 'public');

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '127.0.0.1';

app.use(express.static(PUBLIC_DIR, { dotfiles: 'deny' }));

app.listen(PORT, HOST, () => {
  console.log(`uwscc preview at http://${HOST}:${PORT}`);
});
