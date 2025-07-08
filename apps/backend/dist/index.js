"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cooperative_controller_1 = require("./controllers/cooperative.controller");
const app = (0, express_1.default)();
const port = process.env.PORT || 3542;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
// API Routes
app.post('/api/cooperative/connection-package', cooperative_controller_1.generateConnectionPackage);
app.post('/api/cooperative/new-cooperative', cooperative_controller_1.generateNewCooperative);
app.get('/api/status/:jobId', cooperative_controller_1.getGenerationStatus);
app.get('/api/download/:folderName', cooperative_controller_1.downloadFiles);
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
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📖 API documentation: http://localhost:${port}/api/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map