// Базовые интерфейсы для документов

// Интерфейс для данных учредителя
export interface Member {
  full_name: string;
  birthday: string;
  passport_series: string;
  passport_number: string;
  passport_issue_date: string;
  passport_issued_by: string;
  passport_code: string;
  passport_address: string;
  inn: string;
}

// Базовая информация о кооперативе
export interface BaseCooperativeInfo {
  name: string;
  website: string;
  city: string;
  short_abbr: string;
  full_abbr: string;
  full_abbr_genitive: string;
  full_abbr_dative: string;
  big_full_abbr: string;
  full_abbr_eng: string;
  short_abbr_eng: string;
  eng_name: string;
  chairman_full_name: string;
  contact_email: string;
  confidential_email: string;
  confidential_link: string;
}

// Интерфейс для пакета подключения (документы 1-100, 50)
export interface ConnectionPackageData extends BaseCooperativeInfo {
  // Данные протокола - все документы используют одну дату
  protocol_date: string; // Исходная дата
  
  // Автоматически генерируемые из protocol_date:
  wallet_protocol_number: string;
  wallet_protocol_day_and_month: string;
  wallet_protocol_year: number;
  
  pep_protocol: string;
  pep_date_and_month: string;
  pep_year: number;
  
  confidential_protocol_number: string;
  confidential_protocol_day_and_month: string;
  confidential_protocol_year: number;
  
  agreement_protocol: string;
  agreement_day_and_month: string;
  agreement_year: number;
  
  coop_offer_protocol: string;
  coop_offer_day_and_month: string;
  coop_offer_year: string;
}

// Интерфейс для нового кооператива (ustav.docx, protocol_1.docx)
export interface NewCooperativeData extends BaseCooperativeInfo {
  // Дата учредительного собрания
  founding_date: string; // Исходная дата
  
  // Автоматически генерируемые из founding_date:
  fp_day: string;
  fp_month: string;
  fp_year: string;
  
  // Финансовые параметры
  initial_individuals_and_entprs: number;
  initial_individuals_and_entprs_text: string;
  initial_organizations: number;
  initial_organizations_text: string;
  minimum_individuals_and_entprs: number;
  minimum_individuals_and_entprs_text: string;
  minimum_organizations: number;
  minimum_organizations_text: string;
  
  // Данные учредителей
  member_1: Member;
  member_2: Member;
  member_3: Member;
  member_4: Member;
  member_5: Member;
  member_6: Member;
  
  // Протокол №1
  protocol_1_date: string;
  index_and_full_address: string;
  protocol_1_open_time: string;
  protocol_1_close_time: string;
}

// Интерфейс для ответа API
export interface DocumentGenerationResponse {
  success: boolean;
  message: string;
  files?: string[];
  downloadUrl?: string;
}

// Интерфейс для статуса генерации
export interface GenerationStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  files?: string[];
  error?: string;
}

// Маппинг документов для пакета подключения
export const CONNECTION_PACKAGE_DOCUMENTS = [
  '1_regulation_on_the_cpp_wallet.docx',
  '2_regulation_simple_electronic_signature.docx', 
  '3_privacy_policy.docx',
  '4_user_agreement.docx',
  '50_coop_agreement.docx',
  '100_individual_application_form.docx',
  '100_entrepreneur_application_form.docx',
  '100_organization_application_form.docx'
] as const;

// Маппинг документов для нового кооператива
export const NEW_COOPERATIVE_DOCUMENTS = [
  'ustav.docx',
  'protocol_1.docx'
] as const;

// Типы документов для генерации
export type DocumentType = 'connection_package' | 'new_cooperative';

// Входные данные для генерации
export type GenerationData = ConnectionPackageData | NewCooperativeData;

// Интерфейс для валидации
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
} 