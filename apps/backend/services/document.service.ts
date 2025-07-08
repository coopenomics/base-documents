import fs from 'fs-extra';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import libre from 'libreoffice-convert';
import { promisify } from 'util';
import { ConnectionPackageData, NewCooperativeData } from '@coop/shared';

const convertAsync = promisify(libre.convert);

export interface ProcessResult {
  success: boolean;
  status: number;
  message: string;
  files?: string[];
  downloadUrl?: string;
}

// Функция для обработки данных для пакета подключения
function processConnectionPackageData(data: ConnectionPackageData): any {
  const protocolDate = new Date(data.protocol_date);
  const day = protocolDate.getDate().toString();
  const month = protocolDate.toLocaleDateString('ru-RU', { month: 'long' });
  const year = protocolDate.getFullYear();
  const dayAndMonth = `${day} ${month}`;
  
  return {
    ...data,
    // Автоматически генерируемые поля из даты протокола
    wallet_protocol_number: data.protocol_date,
    wallet_protocol_day_and_month: dayAndMonth,
    wallet_protocol_year: year,
    
    pep_protocol: data.protocol_date,
    pep_date_and_month: dayAndMonth,
    pep_year: year,
    
    confidential_protocol_number: data.protocol_date,
    confidential_protocol_day_and_month: dayAndMonth,
    confidential_protocol_year: year,
    
    agreement_protocol: data.protocol_date,
    agreement_day_and_month: dayAndMonth,
    agreement_year: year,
    
    coop_offer_protocol: data.protocol_date,
    coop_offer_day_and_month: dayAndMonth,
    coop_offer_year: year.toString(),
    
    // Дополнительные поля
    big_full_abbr: data.full_abbr?.toUpperCase() || '',
    full_abbr_eng: data.full_abbr_eng || 'Consumer Benefit Society',
    short_abbr_eng: data.short_abbr_eng || 'CBS',
    eng_name: data.eng_name || data.name
  };
}

// Функция для обработки данных для нового кооператива
function processNewCooperativeData(data: NewCooperativeData): any {
  const foundingDate = new Date(data.founding_date);
  const day = foundingDate.getDate().toString();
  const month = foundingDate.toLocaleDateString('ru-RU', { month: 'long' });
  const year = foundingDate.getFullYear().toString();
  
  // Форматирование даты учредительного собрания для шапки документа (DD.MM.YYYY)
  const foundingDateFormatted = `${foundingDate.getDate().toString().padStart(2, '0')}.${(foundingDate.getMonth() + 1).toString().padStart(2, '0')}.${foundingDate.getFullYear()}`;
  
  // Обработка даты протокола для правильного отображения
  let protocol1DateFormatted = '';
  if (data.protocol_1_date) {
    const protocolDate = new Date(data.protocol_1_date);
    const pDay = protocolDate.getDate().toString().padStart(2, '0');
    const pMonth = (protocolDate.getMonth() + 1).toString().padStart(2, '0');
    const pYear = protocolDate.getFullYear();
    protocol1DateFormatted = `${pDay}.${pMonth}.${pYear}`;
  }
  
  // Функция для обработки данных учредителя
  const processMember = (member: any) => {
    if (!member) {
      return {
        full_name: '',
        birthday: '',
        passport_series: '',
        passport_number: '',
        passport_issue_date: '',
        passport_issued_by: '',
        passport_code: '',
        passport_address: '',
        inn: ''
      };
    }
    
    return {
      full_name: member.full_name || '',
      birthday: member.birthday || '',
      passport_series: member.passport_series || '',
      passport_number: member.passport_number || '',
      passport_issue_date: member.passport_issue_date || '',
      passport_issued_by: member.passport_issued_by || '',
      passport_code: member.passport_code || '',
      passport_address: member.passport_address || '',
      inn: member.inn || ''
    };
  };
  
  // Обработка данных учредителей
  const member1 = processMember(data.member_1);
  const member2 = processMember(data.member_2);
  const member3 = processMember(data.member_3);
  const member4 = processMember(data.member_4);
  const member5 = processMember(data.member_5);
  const member6 = processMember(data.member_6);
  
  return {
    ...data,
    // Автоматически генерируемые поля из даты учредительного собрания
    fp_day: day,
    fp_month: month,
    fp_year: year,
    founding_date: foundingDateFormatted, // Переопределяем дату в правильном формате
    
    // Дополнительные поля
    big_full_abbr: data.full_abbr?.toUpperCase() || 'ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ',
    full_abbr_eng: data.full_abbr_eng || 'Consumer Benefit Society',
    short_abbr_eng: data.short_abbr_eng || 'CBS',
    eng_name: data.eng_name || data.name,
    
    // Развернутые данные учредителей для шаблона
    member_1: member1,
    member_2: member2,
    member_3: member3,
    member_4: member4,
    member_5: member5,
    member_6: member6,
    
    // Плоские поля для прямого доступа в шаблоне
    'member_1.full_name': member1.full_name,
    'member_1.birthday': member1.birthday,
    'member_1.passport_series': member1.passport_series,
    'member_1.passport_number': member1.passport_number,
    'member_1.passport_issue_date': member1.passport_issue_date,
    'member_1.passport_issued_by': member1.passport_issued_by,
    'member_1.passport_code': member1.passport_code,
    'member_1.passport_address': member1.passport_address,
    'member_1.inn': member1.inn,
    
    'member_2.full_name': member2.full_name,
    'member_2.birthday': member2.birthday,
    'member_2.passport_series': member2.passport_series,
    'member_2.passport_number': member2.passport_number,
    'member_2.passport_issue_date': member2.passport_issue_date,
    'member_2.passport_issued_by': member2.passport_issued_by,
    'member_2.passport_code': member2.passport_code,
    'member_2.passport_address': member2.passport_address,
    'member_2.inn': member2.inn,
    
    'member_3.full_name': member3.full_name,
    'member_3.birthday': member3.birthday,
    'member_3.passport_series': member3.passport_series,
    'member_3.passport_number': member3.passport_number,
    'member_3.passport_issue_date': member3.passport_issue_date,
    'member_3.passport_issued_by': member3.passport_issued_by,
    'member_3.passport_code': member3.passport_code,
    'member_3.passport_address': member3.passport_address,
    'member_3.inn': member3.inn,
    
    'member_4.full_name': member4.full_name,
    'member_4.birthday': member4.birthday,
    'member_4.passport_series': member4.passport_series,
    'member_4.passport_number': member4.passport_number,
    'member_4.passport_issue_date': member4.passport_issue_date,
    'member_4.passport_issued_by': member4.passport_issued_by,
    'member_4.passport_code': member4.passport_code,
    'member_4.passport_address': member4.passport_address,
    'member_4.inn': member4.inn,
    
    'member_5.full_name': member5.full_name,
    'member_5.birthday': member5.birthday,
    'member_5.passport_series': member5.passport_series,
    'member_5.passport_number': member5.passport_number,
    'member_5.passport_issue_date': member5.passport_issue_date,
    'member_5.passport_issued_by': member5.passport_issued_by,
    'member_5.passport_code': member5.passport_code,
    'member_5.passport_address': member5.passport_address,
    'member_5.inn': member5.inn,
    
    'member_6.full_name': member6.full_name,
    'member_6.birthday': member6.birthday,
    'member_6.passport_series': member6.passport_series,
    'member_6.passport_number': member6.passport_number,
    'member_6.passport_issue_date': member6.passport_issue_date,
    'member_6.passport_issued_by': member6.passport_issued_by,
    'member_6.passport_code': member6.passport_code,
    'member_6.passport_address': member6.passport_address,
    'member_6.inn': member6.inn,
    
    // Обработка пустых полей
    website: data.website || '',
    contact_email: data.contact_email || '',
    confidential_email: data.confidential_email || '',
    confidential_link: data.confidential_link || '',
    protocol_1_date: protocol1DateFormatted,
    index_and_full_address: data.index_and_full_address || '',
    protocol_1_open_time: data.protocol_1_open_time || '',
    protocol_1_close_time: data.protocol_1_close_time || '',
    
    // Финансовые параметры - убеждаемся что текстовые поля заполнены
    initial_individuals_and_entprs_text: data.initial_individuals_and_entprs_text || 'Сто',
    initial_organizations_text: data.initial_organizations_text || 'Одна тысяча',
    minimum_individuals_and_entprs_text: data.minimum_individuals_and_entprs_text || 'Триста',
    minimum_organizations_text: data.minimum_organizations_text || 'Три тысячи'
  };
}

// Генерация пакета подключения
export const processConnectionPackage = async (inputData: ConnectionPackageData): Promise<ProcessResult> => {
  const templatesDir = path.resolve('data/templates/connection-package');
  const tempDir = path.join(process.cwd(), 'temp', `connection_${Date.now()}`);
  
  try {
    await fs.ensureDir(tempDir);
    
    // Обработка данных
    const data = processConnectionPackageData(inputData);
    
    // Сохранение данных для отладки
    await fs.writeJSON(path.join(tempDir, 'data.json'), data, { spaces: 2 });
    
    const result = await generateDocuments(templatesDir, tempDir, data);
    
    if (result.success) {
      return {
        ...result,
        downloadUrl: `/api/download/${path.basename(tempDir)}`
      };
    }
    
    return result;
  } catch (error) {
    console.error('Ошибка генерации пакета подключения:', error);
    return {
      success: false,
      status: 500,
      message: `Ошибка генерации пакета подключения: ${error}`
    };
  }
};

// Генерация нового кооператива
export const processNewCooperative = async (inputData: NewCooperativeData): Promise<ProcessResult> => {
  const templatesDir = path.resolve('data/templates/new-cooperative');
  const tempDir = path.join(process.cwd(), 'temp', `cooperative_${Date.now()}`);
  
  try {
    await fs.ensureDir(tempDir);
    
    // Обработка данных
    const data = processNewCooperativeData(inputData);
    
    // Сохранение данных для отладки
    await fs.writeJSON(path.join(tempDir, 'data.json'), data, { spaces: 2 });
    
    const result = await generateDocuments(templatesDir, tempDir, data);
    
    if (result.success) {
      return {
        ...result,
        downloadUrl: `/api/download/${path.basename(tempDir)}`
      };
    }
    
    return result;
  } catch (error) {
    console.error('Ошибка генерации нового кооператива:', error);
    return {
      success: false,
      status: 500,
      message: `Ошибка генерации нового кооператива: ${error}`
    };
  }
};

// Общая функция для генерации документов
async function generateDocuments(templatesDir: string, outputDir: string, data: any): Promise<ProcessResult> {
  if (!fs.existsSync(templatesDir)) {
    return { 
      success: false, 
      status: 404, 
      message: `Папка с шаблонами не найдена: ${templatesDir}` 
    };
  }

  try {
    const files = fs.readdirSync(templatesDir);
    const docxFiles = files.filter(file => path.extname(file) === '.docx' && !file.includes('_temp'));
    
    if (docxFiles.length === 0) {
      return { 
        success: false, 
        status: 404, 
        message: 'Шаблоны документов не найдены' 
      };
    }

    const generatedFiles: string[] = [];

    for (const file of docxFiles) {
      const filePath = path.join(templatesDir, file);
      

      const content = fs.readFileSync(filePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render(data);

      const buffer = doc.getZip().generate({ type: 'nodebuffer' });
      const newDocxPath = path.join(outputDir, path.basename(file, '.docx') + '_rendered.docx');
      fs.writeFileSync(newDocxPath, buffer);
      generatedFiles.push(path.basename(newDocxPath));
      

      // Временно отключаем генерацию PDF
      /*
      const pdfPath = path.join(outputDir, path.basename(file, '.docx') + '.pdf');
      const inputBuffer = fs.readFileSync(newDocxPath);

      const pdfBuffer = await convertAsync(inputBuffer, '.pdf', undefined);
      fs.writeFileSync(pdfPath, pdfBuffer);
      generatedFiles.push(path.basename(pdfPath));
      console.log('PDF сгенерирован:', pdfPath);
      */
    }

    return { 
      success: true, 
      status: 200, 
      message: 'Документы успешно сгенерированы',
      files: generatedFiles
    };
  } catch (error) {
    console.error('Ошибка генерации документов:', error);
    return { 
      success: false, 
      status: 500, 
      message: `Ошибка генерации документов: ${error}` 
    };
  }
}

// Оставляем старую функцию для совместимости
export const processFiles = async (inputDir: string, variablesFile: string): Promise<ProcessResult> => {
  const inputPath = path.resolve(inputDir);
  const variablesFilePath = path.resolve(variablesFile);
  
  if (!fs.existsSync(inputPath)) {
    return { success: false, status: 404, message: `Error: Input directory "${inputPath}" does not exist.` };
  }

  if (!fs.existsSync(variablesFilePath)) {
    return { success: false, status: 404, message: `Error: Variables file "${variablesFilePath}" does not exist.` };
  }

  let data: any;
  try {
    const rawData = fs.readFileSync(variablesFilePath, 'utf8');
    data = JSON.parse(rawData);
  } catch (error) {
    console.log('error: ', error);
    return { success: false, status: 500, message: `Error reading variables file: ${error}` };
  }

  const outputDir = path.dirname(variablesFilePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  try {
    
    const files = fs.readdirSync(inputPath);

    const docxFiles = files.filter(file => path.extname(file) === '.docx' && !file.includes('_temp'));
    if (docxFiles.length === 0) {
      return { success: false, status: 404, message: 'No .docx files found in the input directory.' };
    }

    for (const file of docxFiles) {
      const filePath = path.join(inputPath, file);
    
      const content = fs.readFileSync(filePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render(data);

      const buffer = doc.getZip().generate({ type: 'nodebuffer' });
      const newDocxPath = path.join(outputDir, path.basename(file, '.docx') + '_rendered.docx');
      fs.writeFileSync(newDocxPath, buffer);
    
      // Временно отключаем генерацию PDF
      /*
      const pdfPath = path.join(outputDir, path.basename(file, '.docx') + '.pdf');
      const inputBuffer = fs.readFileSync(newDocxPath);

      const done = await convertAsync(inputBuffer, '.pdf', undefined);
      fs.writeFileSync(pdfPath, done);
      console.log('PDF generated:', pdfPath);
      */
    }

    return { success: true, status: 200, message: 'Files processed successfully.' };
  } catch (error) {
    console.error('Error processing files:', error);
    return { success: false, status: 500, message: `Error processing files: ${error}` };
  }
};

