import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import { 
  generateConnectionPackage, 
  generateNewCooperative, 
  downloadFiles,
  getGenerationStatus
} from './controllers/cooperative.controller';

const app: Express = express();
const port = process.env.PORT || 3542;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.post('/api/cooperative/connection-package', generateConnectionPackage);
app.post('/api/cooperative/new-cooperative', generateNewCooperative);
app.get('/api/status/:jobId', getGenerationStatus);
app.get('/api/download/:folderName', downloadFiles);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Document Generator API'
  });
});

// Serve frontend (when built)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📖 API documentation: http://localhost:${port}/api/health`);
});

export default app;
