"use strict";
// Перенесено из apps/backend/services/data-processing.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToText = numberToText;
exports.capitalize = capitalize;
exports.processDate = processDate;
exports.processConnectionPackageData = processConnectionPackageData;
exports.processNewCooperativeData = processNewCooperativeData;
exports.validateINN = validateINN;
exports.validatePassport = validatePassport;
// Функция для перевода чисел в текст
function numberToText(num) {
    const ones = [
        '', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять',
        'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать',
        'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'
    ];
    const tens = [
        '', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят',
        'восемьдесят', 'девяносто'
    ];
    const hundreds = [
        '', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот',
        'восемьсот', 'девятьсот'
    ];
    const thousands = [
        '', 'одна тысяча', 'две тысячи', 'три тысячи', 'четыре тысячи', 'пять тысяч',
        'шесть тысяч', 'семь тысяч', 'восемь тысяч', 'девять тысяч'
    ];
    if (num === 0)
        return 'ноль';
    let result = '';
    // Тысячи
    if (num >= 1000) {
        const thousandsPart = Math.floor(num / 1000);
        if (thousandsPart < 10) {
            result += thousands[thousandsPart];
        }
        else if (thousandsPart < 20) {
            result += ones[thousandsPart] + ' тысяч';
        }
        else {
            const thousandsHundreds = Math.floor(thousandsPart / 100);
            const thousandsTens = Math.floor((thousandsPart % 100) / 10);
            const thousandsOnes = thousandsPart % 10;
            if (thousandsHundreds > 0)
                result += hundreds[thousandsHundreds] + ' ';
            if (thousandsTens >= 2)
                result += tens[thousandsTens] + ' ';
            if (thousandsOnes > 0 || thousandsTens < 2) {
                if (thousandsTens < 2)
                    result += ones[thousandsPart % 100];
                else
                    result += ones[thousandsOnes];
            }
            result += ' тысяч';
        }
        result += ' ';
        num %= 1000;
    }
    // Сотни
    if (num >= 100) {
        result += hundreds[Math.floor(num / 100)] + ' ';
        num %= 100;
    }
    // Десятки и единицы
    if (num >= 20) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
    }
    if (num > 0) {
        result += ones[num];
    }
    return result.trim();
}
// Функция для капитализации первой буквы
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
// Функция для обработки даты
function processDate(dateString) {
    const date = new Date(dateString);
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return {
        day: day.toString(),
        month: month,
        year: year.toString(),
        dayAndMonth: `${day} ${month}`,
        fullDate: `${day} ${month} ${year}`,
        isoDate: dateString
    };
}
// Функция для обработки данных пакета подключения
function processConnectionPackageData(inputData) {
    const protocolDate = processDate(inputData.protocol_date || new Date().toISOString());
    return {
        // Базовая информация
        name: inputData.name || '',
        website: inputData.website || '',
        city: inputData.city || '',
        short_abbr: inputData.short_abbr || 'ПК',
        full_abbr: inputData.full_abbr || 'Потребительский Кооператив',
        full_abbr_genitive: inputData.full_abbr_genitive || 'Потребительского Кооператива',
        full_abbr_dative: inputData.full_abbr_dative || 'Потребительском Кооперативе',
        big_full_abbr: inputData.big_full_abbr || 'ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ',
        full_abbr_eng: inputData.full_abbr_eng || 'Consumer Benefit Society',
        short_abbr_eng: inputData.short_abbr_eng || 'CBS',
        eng_name: inputData.eng_name || '',
        chairman_full_name: inputData.chairman_full_name || '',
        contact_email: inputData.contact_email || '',
        confidential_email: inputData.confidential_email || '',
        confidential_link: inputData.confidential_link || '',
        // Исходная дата
        protocol_date: inputData.protocol_date || '',
        // Все документы используют одну дату протокола
        wallet_protocol_number: protocolDate.isoDate.split('T')[0],
        wallet_protocol_day_and_month: protocolDate.dayAndMonth,
        wallet_protocol_year: parseInt(protocolDate.year),
        pep_protocol: protocolDate.isoDate.split('T')[0],
        pep_date_and_month: protocolDate.dayAndMonth,
        pep_year: parseInt(protocolDate.year),
        confidential_protocol_number: protocolDate.isoDate.split('T')[0],
        confidential_protocol_day_and_month: protocolDate.dayAndMonth,
        confidential_protocol_year: parseInt(protocolDate.year),
        agreement_protocol: protocolDate.isoDate.split('T')[0],
        agreement_day_and_month: protocolDate.dayAndMonth,
        agreement_year: parseInt(protocolDate.year),
        coop_offer_protocol: protocolDate.isoDate.split('T')[0],
        coop_offer_day_and_month: protocolDate.dayAndMonth,
        coop_offer_year: protocolDate.year,
    };
}
// Функция для обработки данных нового кооператива
function processNewCooperativeData(inputData) {
    const foundingDate = processDate(inputData.founding_date || new Date().toISOString());
    return {
        // Базовая информация
        name: inputData.name || '',
        website: inputData.website || '',
        city: inputData.city || '',
        short_abbr: inputData.short_abbr || 'ПК',
        full_abbr: inputData.full_abbr || 'Потребительский Кооператив',
        full_abbr_genitive: inputData.full_abbr_genitive || 'Потребительского Кооператива',
        full_abbr_dative: inputData.full_abbr_dative || 'Потребительском Кооперативе',
        big_full_abbr: inputData.big_full_abbr || 'ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ',
        full_abbr_eng: inputData.full_abbr_eng || 'Consumer Benefit Society',
        short_abbr_eng: inputData.short_abbr_eng || 'CBS',
        eng_name: inputData.eng_name || '',
        chairman_full_name: inputData.chairman_full_name || '',
        contact_email: inputData.contact_email || '',
        confidential_email: inputData.confidential_email || '',
        confidential_link: inputData.confidential_link || '',
        // Дата учредительного собрания
        founding_date: inputData.founding_date || '',
        fp_day: foundingDate.day,
        fp_month: foundingDate.month,
        fp_year: foundingDate.year,
        // Финансовые параметры с автоматическим переводом в текст
        initial_individuals_and_entprs: inputData.initial_individuals_and_entprs || 100,
        initial_individuals_and_entprs_text: capitalize(numberToText(inputData.initial_individuals_and_entprs || 100)),
        initial_organizations: inputData.initial_organizations || 1000,
        initial_organizations_text: capitalize(numberToText(inputData.initial_organizations || 1000)),
        minimum_individuals_and_entprs: inputData.minimum_individuals_and_entprs || 300,
        minimum_individuals_and_entprs_text: capitalize(numberToText(inputData.minimum_individuals_and_entprs || 300)),
        minimum_organizations: inputData.minimum_organizations || 3000,
        minimum_organizations_text: capitalize(numberToText(inputData.minimum_organizations || 3000)),
        // Данные учредителей
        member_1: inputData.member_1 || createEmptyMember(),
        member_2: inputData.member_2 || createEmptyMember(),
        member_3: inputData.member_3 || createEmptyMember(),
        member_4: inputData.member_4 || createEmptyMember(),
        member_5: inputData.member_5 || createEmptyMember(),
        member_6: inputData.member_6 || createEmptyMember(),
        // Протокол №1
        protocol_1_date: inputData.protocol_1_date || '',
        index_and_full_address: inputData.index_and_full_address || '',
        protocol_1_open_time: inputData.protocol_1_open_time || '',
        protocol_1_close_time: inputData.protocol_1_close_time || '',
    };
}
// Функция для создания пустого учредителя
function createEmptyMember() {
    return {
        full_name: '',
        birthday: '',
        passport_series: '',
        passport_number: '',
        passport_issue_date: '',
        passport_issued_by: '',
        passport_code: '',
        passport_address: '',
        inn: '',
    };
}
// Функция для валидации ИНН
function validateINN(inn) {
    if (!/^\d{10}$/.test(inn) && !/^\d{12}$/.test(inn)) {
        return false;
    }
    const digits = inn.split('').map(Number);
    if (inn.length === 10) {
        const checksum = (digits[0] * 2 + digits[1] * 4 + digits[2] * 10 + digits[3] * 3 +
            digits[4] * 5 + digits[5] * 9 + digits[6] * 4 + digits[7] * 6 +
            digits[8] * 8) % 11;
        return digits[9] === (checksum < 10 ? checksum : checksum % 10);
    }
    if (inn.length === 12) {
        const checksum1 = (digits[0] * 7 + digits[1] * 2 + digits[2] * 4 + digits[3] * 10 +
            digits[4] * 3 + digits[5] * 5 + digits[6] * 9 + digits[7] * 4 +
            digits[8] * 6 + digits[9] * 8) % 11;
        const checksum2 = (digits[0] * 3 + digits[1] * 7 + digits[2] * 2 + digits[3] * 4 +
            digits[4] * 10 + digits[5] * 3 + digits[6] * 5 + digits[7] * 9 +
            digits[8] * 4 + digits[9] * 6 + digits[10] * 8) % 11;
        return digits[10] === (checksum1 < 10 ? checksum1 : checksum1 % 10) &&
            digits[11] === (checksum2 < 10 ? checksum2 : checksum2 % 10);
    }
    return false;
}
// Функция для валидации паспорта
function validatePassport(series, number) {
    return /^\d{4}$/.test(series) && /^\d{6}$/.test(number);
}
//# sourceMappingURL=utils.js.map