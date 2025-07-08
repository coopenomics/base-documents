"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFiles = exports.getGenerationStatus = exports.generateNewCooperative = exports.generateConnectionPackage = void 0;
const document_service_1 = require("../services/document.service");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
// Функция для очистки устаревших папок (старше 1 часа)
const cleanupOldFolders = async () => {
    const tempDir = path_1.default.join(process.cwd(), 'temp');
    try {
        if (!fs_extra_1.default.existsSync(tempDir)) {
            return;
        }
        const folders = fs_extra_1.default.readdirSync(tempDir);
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000); // 1 час назад
        for (const folder of folders) {
            const folderPath = path_1.default.join(tempDir, folder);
            const stats = fs_extra_1.default.statSync(folderPath);
            if (stats.isDirectory()) {
                // Извлекаем timestamp из имени папки
                const match = folder.match(/^(connection|cooperative)_(\d+)$/);
                if (match) {
                    const timestamp = parseInt(match[2]);
                    if (timestamp < oneHourAgo) {
                        console.log(`Удаляем устаревшую папку: ${folder}`);
                        fs_extra_1.default.removeSync(folderPath);
                    }
                }
            }
        }
    }
    catch (error) {
        console.error('Ошибка при очистке устаревших папок:', error);
    }
};
const generateConnectionPackage = async (req, res) => {
    try {
        // Очистка устаревших папок
        await cleanupOldFolders();
        const data = req.body;
        // Валидация обязательных полей
        if (!data.name || !data.city) {
            res.status(400).json({
                success: false,
                message: 'Название кооператива и город обязательны'
            });
            return;
        }
        const result = await (0, document_service_1.processConnectionPackage)(data);
        if (result.success) {
            // Извлекаем код папки из downloadUrl
            const folderName = result.downloadUrl?.split('/').pop();
            res.status(200).json({
                success: true,
                message: result.message,
                files: result.files,
                downloadUrl: result.downloadUrl,
                downloadCode: folderName // Добавляем код для скачивания
            });
        }
        else {
            res.status(result.status).json({
                success: false,
                message: result.message
            });
        }
    }
    catch (error) {
        console.error('Ошибка генерации пакета подключения:', error);
        res.status(500).json({
            success: false,
            message: `Ошибка генерации документов: ${error}`
        });
    }
};
exports.generateConnectionPackage = generateConnectionPackage;
const generateNewCooperative = async (req, res) => {
    try {
        // Очистка устаревших папок
        await cleanupOldFolders();
        const data = req.body;
        // Валидация обязательных полей
        if (!data.name || !data.city || !data.member_1?.full_name) {
            res.status(400).json({
                success: false,
                message: 'Название кооператива, город и данные первого учредителя обязательны'
            });
            return;
        }
        console.log(data);
        const result = await (0, document_service_1.processNewCooperative)(data);
        if (result.success) {
            // Извлекаем код папки из downloadUrl
            const folderName = result.downloadUrl?.split('/').pop();
            res.status(200).json({
                success: true,
                message: result.message,
                files: result.files,
                downloadUrl: result.downloadUrl,
                downloadCode: folderName // Добавляем код для скачивания
            });
        }
        else {
            res.status(result.status).json({
                success: false,
                message: result.message
            });
        }
    }
    catch (error) {
        console.error('Ошибка генерации нового кооператива:', error);
        res.status(500).json({
            success: false,
            message: `Ошибка генерации документов: ${error}`
        });
    }
};
exports.generateNewCooperative = generateNewCooperative;
const getGenerationStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        // TODO: Реализовать проверку статуса задачи
        res.status(200).json({
            id: jobId,
            status: 'completed',
            progress: 100,
            message: 'Документы сгенерированы'
        });
    }
    catch (error) {
        console.error('Ошибка получения статуса:', error);
        res.status(500).json({
            success: false,
            message: `Ошибка получения статуса: ${error}`
        });
    }
};
exports.getGenerationStatus = getGenerationStatus;
// Скачивание сгенерированных документов с проверкой кода
const downloadFiles = async (req, res) => {
    try {
        const { folderName } = req.params;
        const { code } = req.query;
        // Проверяем, что код соответствует имени папки
        if (!code || code !== folderName) {
            res.status(403).json({
                success: false,
                message: 'Неверный код доступа'
            });
            return;
        }
        const tempDir = path_1.default.join(process.cwd(), 'temp', folderName);
        if (!fs_extra_1.default.existsSync(tempDir)) {
            res.status(404).json({ success: false, message: 'Файлы не найдены' });
            return;
        }
        const files = fs_extra_1.default.readdirSync(tempDir);
        const docxFiles = files.filter(file => file.endsWith('_rendered.docx'));
        if (docxFiles.length === 0) {
            res.status(404).json({ success: false, message: 'Документы не найдены' });
            return;
        }
        // Если один файл - отправляем его напрямую
        if (docxFiles.length === 1) {
            const filePath = path_1.default.join(tempDir, docxFiles[0]);
            res.download(filePath, docxFiles[0], (err) => {
                if (err) {
                    console.error('Ошибка при скачивании файла:', err);
                }
                // Удаляем файл через 5 секунд после скачивания
                setTimeout(() => {
                    fs_extra_1.default.remove(tempDir).catch(console.error);
                }, 5000);
            });
            return;
        }
        // Если несколько файлов - создаем архив
        const archiver = require('archiver');
        const archive = archiver('zip');
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${folderName}.zip"`);
        archive.pipe(res);
        for (const file of docxFiles) {
            const filePath = path_1.default.join(tempDir, file);
            archive.file(filePath, { name: file });
        }
        archive.finalize();
        // Удаляем временную папку после отправки
        archive.on('end', () => {
            setTimeout(() => {
                fs_extra_1.default.remove(tempDir).catch(console.error);
            }, 5000);
        });
    }
    catch (error) {
        console.error('Ошибка при скачивании файлов:', error);
        res.status(500).json({
            success: false,
            message: `Ошибка при скачивании файлов: ${error}`
        });
    }
};
exports.downloadFiles = downloadFiles;
//# sourceMappingURL=cooperative.controller.js.map