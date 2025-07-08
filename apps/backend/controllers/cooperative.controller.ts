import { Request, Response } from 'express';
import { processConnectionPackage, processNewCooperative } from '../services/document.service';
import { ConnectionPackageData, NewCooperativeData } from '@coop/shared';
import fs from 'fs-extra';
import path from 'path';

// Функция для очистки устаревших папок (старше 1 часа)
const cleanupOldFolders = async () => {
  const tempDir = path.join(process.cwd(), 'temp');
  
  try {
    if (!fs.existsSync(tempDir)) {
      return;
    }
    
    const folders = fs.readdirSync(tempDir);
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000); // 1 час назад
    
    for (const folder of folders) {
      const folderPath = path.join(tempDir, folder);
      const stats = fs.statSync(folderPath);
      
      if (stats.isDirectory()) {
        // Извлекаем timestamp из имени папки
        const match = folder.match(/^(connection|cooperative)_(\d+)$/);
        if (match) {
          const timestamp = parseInt(match[2]);
          if (timestamp < oneHourAgo) {
            console.log(`Удаляем устаревшую папку: ${folder}`);
            fs.removeSync(folderPath);
          }
        }
      }
    }
  } catch (error) {
    console.error('Ошибка при очистке устаревших папок:', error);
  }
};

export const generateConnectionPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Очистка устаревших папок
    await cleanupOldFolders();
    
    const data: ConnectionPackageData = req.body;
    
    // Валидация обязательных полей
    if (!data.name || !data.city) {
      res.status(400).json({
        success: false,
        message: 'Название кооператива и город обязательны'
      });
      return;
    }
    
    const result = await processConnectionPackage(data);
    
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
    } else {
      res.status(result.status).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Ошибка генерации пакета подключения:', error);
    res.status(500).json({
      success: false,
      message: `Ошибка генерации документов: ${error}`
    });
  }
};

export const generateNewCooperative = async (req: Request, res: Response): Promise<void> => {
  try {
    // Очистка устаревших папок
    await cleanupOldFolders();
    
    const data: NewCooperativeData = req.body;
    
    // Валидация обязательных полей
    if (!data.name || !data.city || !data.member_1?.full_name) {
      res.status(400).json({
        success: false,
        message: 'Название кооператива, город и данные первого учредителя обязательны'
      });
      return;
    }
    
    console.log(data)
    const result = await processNewCooperative(data);
    
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
    } else {
      res.status(result.status).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Ошибка генерации нового кооператива:', error);
    res.status(500).json({
      success: false,
      message: `Ошибка генерации документов: ${error}`
    });
  }
};

export const getGenerationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    
    // TODO: Реализовать проверку статуса задачи
    res.status(200).json({
      id: jobId,
      status: 'completed',
      progress: 100,
      message: 'Документы сгенерированы'
    });
  } catch (error) {
    console.error('Ошибка получения статуса:', error);
    res.status(500).json({
      success: false,
      message: `Ошибка получения статуса: ${error}`
    });
  }
};

// Скачивание сгенерированных документов с проверкой кода
export const downloadFiles = async (req: Request, res: Response): Promise<void> => {
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
    
    const tempDir = path.join(process.cwd(), 'temp', folderName);
    
    if (!fs.existsSync(tempDir)) {
      res.status(404).json({ success: false, message: 'Файлы не найдены' });
      return;
    }
    
    const files = fs.readdirSync(tempDir);
    const docxFiles = files.filter(file => file.endsWith('_rendered.docx'));
    
    if (docxFiles.length === 0) {
      res.status(404).json({ success: false, message: 'Документы не найдены' });
      return;
    }
    
    // Если один файл - отправляем его напрямую
    if (docxFiles.length === 1) {
      const filePath = path.join(tempDir, docxFiles[0]);
      res.download(filePath, docxFiles[0], (err) => {
        if (err) {
          console.error('Ошибка при скачивании файла:', err);
        }
        // Удаляем файл через 5 секунд после скачивания
        setTimeout(() => {
          fs.remove(tempDir).catch(console.error);
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
      const filePath = path.join(tempDir, file);
      archive.file(filePath, { name: file });
    }
    
    archive.finalize();
    
    // Удаляем временную папку после отправки
    archive.on('end', () => {
      setTimeout(() => {
        fs.remove(tempDir).catch(console.error);
      }, 5000);
    });
    
  } catch (error) {
    console.error('Ошибка при скачивании файлов:', error);
    res.status(500).json({
      success: false,
      message: `Ошибка при скачивании файлов: ${error}`
    });
  }
}; 