'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import axios from 'axios'
import { NewCooperativeData, Member } from '../../../../../packages/shared/src'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3542'
const SHOW_TEST_BUTTON = process.env.NEXT_PUBLIC_SHOW_TEST_BUTTON === 'true'

export default function NewCooperativePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  // Убираем activeMembers state - теперь всегда 6 учредителей

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<NewCooperativeData>({
    defaultValues: {
      name: '',
      city: '',
      website: '',
      short_abbr: 'ПК',
      full_abbr: 'Потребительский Кооператив',
      full_abbr_genitive: 'Потребительского Кооператива',
      full_abbr_dative: 'Потребительском Кооперативе',
      big_full_abbr: 'ПОТРЕБИТЕЛЬСКИЙ КООПЕРАТИВ',
      full_abbr_eng: 'Consumer Benefit Society',
      short_abbr_eng: 'CBS',
      eng_name: '',
      chairman_full_name: '',
      contact_email: '',
      confidential_email: '',
      confidential_link: '',
      founding_date: new Date().toISOString().split('T')[0],
      initial_individuals_and_entprs: 100,
      initial_individuals_and_entprs_text: 'Сто',
      initial_organizations: 1000,
      initial_organizations_text: 'Одна тысяча',
      minimum_individuals_and_entprs: 300,
      minimum_individuals_and_entprs_text: 'Триста',
      minimum_organizations: 3000,
      minimum_organizations_text: 'Три тысячи',
      protocol_1_date: new Date().toISOString().split('T')[0],
      index_and_full_address: '',
      protocol_1_open_time: '10:00',
      protocol_1_close_time: '11:00',
      member_1: {
        full_name: '',
        birthday: '',
        passport_series: '',
        passport_number: '',
        passport_issue_date: '',
        passport_issued_by: '',
        passport_code: '',
        passport_address: '',
        inn: ''
      },
      member_2: {
        full_name: '',
        birthday: '',
        passport_series: '',
        passport_number: '',
        passport_issue_date: '',
        passport_issued_by: '',
        passport_code: '',
        passport_address: '',
        inn: ''
      },
      member_3: {
        full_name: '',
        birthday: '',
        passport_series: '',
        passport_number: '',
        passport_issue_date: '',
        passport_issued_by: '',
        passport_code: '',
        passport_address: '',
        inn: ''
      },
      member_4: {
        full_name: '',
        birthday: '',
        passport_series: '',
        passport_number: '',
        passport_issue_date: '',
        passport_issued_by: '',
        passport_code: '',
        passport_address: '',
        inn: ''
      },
      member_5: {
        full_name: '',
        birthday: '',
        passport_series: '',
        passport_number: '',
        passport_issue_date: '',
        passport_issued_by: '',
        passport_code: '',
        passport_address: '',
        inn: ''
      },
      member_6: {
        full_name: '',
        birthday: '',
        passport_series: '',
        passport_number: '',
        passport_issue_date: '',
        passport_issued_by: '',
        passport_code: '',
        passport_address: '',
        inn: ''
      }
    }
  })

  const onSubmit = async (data: NewCooperativeData) => {
    setIsGenerating(true)
    setError(null)
    setGenerationResult(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/api/cooperative/new-cooperative`, data, {
        timeout: 60000
      })

      if (response.data.success) {
        setGenerationResult(response.data)
      } else {
        setError(response.data.message || 'Ошибка при генерации документов')
      }
    } catch (err: any) {
      console.error('Ошибка генерации:', err)
      setError(
        err.response?.data?.message || 
        err.message || 
        'Произошла ошибка при генерации документов'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadFiles = () => {
    if (generationResult?.downloadUrl && generationResult?.downloadCode) {
      const url = `${API_BASE_URL}${generationResult.downloadUrl}?code=${generationResult.downloadCode}`
      window.open(url, '_blank')
    }
  }

  // Убираем функции addMember и removeMember
  
  const fillTestData = () => {
    // Основная информация
    setValue('name', 'ТЕСТ')
    setValue('city', 'Москва')
    setValue('website', 'https://test.coop')
    setValue('chairman_full_name', 'Иванов Иван Иванович')
    setValue('contact_email', 'info@test.coop')
    setValue('confidential_email', 'privacy@test.coop')
    setValue('confidential_link', 'https://test.coop/privacy')
    setValue('founding_date', '2024-01-15')
    
    // Финансовые параметры
    setValue('initial_individuals_and_entprs', 100)
    setValue('initial_individuals_and_entprs_text', 'Сто')
    setValue('initial_organizations', 1000)
    setValue('initial_organizations_text', 'Одна тысяча')
    setValue('minimum_individuals_and_entprs', 300)
    setValue('minimum_individuals_and_entprs_text', 'Триста')
    setValue('minimum_organizations', 3000)
    setValue('minimum_organizations_text', 'Три тысячи')
    
    // Данные протокола
    setValue('protocol_1_date', '2024-01-15')
    setValue('index_and_full_address', '123456, г. Москва, ул. Тестовая, д. 1, оф. 101')
    setValue('protocol_1_open_time', '10:00')
    setValue('protocol_1_close_time', '11:00')
    
    // Учредитель 1 (член совета)
    setValue('member_1.full_name', 'Иванов Иван Иванович')
    setValue('member_1.birthday', '1980-05-15')
    setValue('member_1.passport_series', '1234')
    setValue('member_1.passport_number', '567890')
    setValue('member_1.passport_issue_date', '2010-05-20')
    setValue('member_1.passport_issued_by', 'ОУФМС России по г. Москва')
    setValue('member_1.passport_code', '123-456')
    setValue('member_1.passport_address', 'г. Москва, ул. Тестовая, д. 1, кв. 1')
    setValue('member_1.inn', '123456789012')
    
    // Учредитель 2 (председатель совета)
    setValue('member_2.full_name', 'Петров Петр Петрович')
    setValue('member_2.birthday', '1975-08-22')
    setValue('member_2.passport_series', '2345')
    setValue('member_2.passport_number', '678901')
    setValue('member_2.passport_issue_date', '2015-08-25')
    setValue('member_2.passport_issued_by', 'ОУФМС России по г. Москва')
    setValue('member_2.passport_code', '234-567')
    setValue('member_2.passport_address', 'г. Москва, ул. Тестовая, д. 2, кв. 2')
    setValue('member_2.inn', '234567890123')
    
    // Учредитель 3 (член совета)
    setValue('member_3.full_name', 'Сидоров Сидор Сидорович')
    setValue('member_3.birthday', '1982-12-10')
    setValue('member_3.passport_series', '3456')
    setValue('member_3.passport_number', '789012')
    setValue('member_3.passport_issue_date', '2012-12-15')
    setValue('member_3.passport_issued_by', 'ОУФМС России по г. Москва')
    setValue('member_3.passport_code', '345-678')
    setValue('member_3.passport_address', 'г. Москва, ул. Тестовая, д. 3, кв. 3')
    setValue('member_3.inn', '345678901234')
    
    // Учредитель 4 (член совета)
    setValue('member_4.full_name', 'Козлов Козел Козелович')
    setValue('member_4.birthday', '1978-03-05')
    setValue('member_4.passport_series', '4567')
    setValue('member_4.passport_number', '890123')
    setValue('member_4.passport_issue_date', '2018-03-10')
    setValue('member_4.passport_issued_by', 'ОУФМС России по г. Москва')
    setValue('member_4.passport_code', '456-789')
    setValue('member_4.passport_address', 'г. Москва, ул. Тестовая, д. 4, кв. 4')
    setValue('member_4.inn', '456789012345')
    
    // Учредитель 5 (член совета)
    setValue('member_5.full_name', 'Волков Волк Волкович')
    setValue('member_5.birthday', '1985-07-18')
    setValue('member_5.passport_series', '5678')
    setValue('member_5.passport_number', '901234')
    setValue('member_5.passport_issue_date', '2020-07-20')
    setValue('member_5.passport_issued_by', 'ОУФМС России по г. Москва')
    setValue('member_5.passport_code', '567-890')
    setValue('member_5.passport_address', 'г. Москва, ул. Тестовая, д. 5, кв. 5')
    setValue('member_5.inn', '567890123456')
    
    // Учредитель 6 (ревизор)
    setValue('member_6.full_name', 'Медведев Медведь Медведевич')
    setValue('member_6.birthday', '1983-11-30')
    setValue('member_6.passport_series', '6789')
    setValue('member_6.passport_number', '012345')
    setValue('member_6.passport_issue_date', '2016-12-01')
    setValue('member_6.passport_issued_by', 'ОУФМС России по г. Москва')
    setValue('member_6.passport_code', '678-901')
    setValue('member_6.passport_address', 'г. Москва, ул. Тестовая, д. 6, кв. 6')
    setValue('member_6.inn', '678901234567')
  }
  
  const getRoleText = (index: number) => {
    switch (index) {
      case 0: return 'член совета'
      case 1: return 'председатель совета'
      case 2: return 'член совета'
      case 3: return 'член совета'
      case 4: return 'член совета'
      case 5: return 'ревизор'
      default: return ''
    }
  }

  const renderMemberForm = (index: number) => {
    const memberKey = `member_${index + 1}` as keyof NewCooperativeData
    
    return (
      <div key={index} className="card border-gray-200">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              Учредитель {index + 1} ({getRoleText(index)})
            </h4>
            {/* Убираем кнопку удаления */}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="form-label">
                ФИО полностью {index === 0 ? '*' : ''}
              </label>
              <input
                type="text"
                className="form-input"
                {...register(`${memberKey}.full_name` as any, index === 0 ? { 
                  required: 'ФИО первого учредителя обязательно'
                } : {})}
                placeholder="Иванов Иван Иванович"
              />
              {errors[memberKey] && (errors[memberKey] as any)?.full_name && (
                <p className="form-error">{(errors[memberKey] as any)?.full_name?.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Дата рождения</label>
              <input
                type="date"
                className="form-input"
                {...register(`${memberKey}.birthday` as any)}
              />
            </div>

            <div>
              <label className="form-label">ИНН</label>
              <input
                type="text"
                className="form-input"
                {...register(`${memberKey}.inn` as any)}
                placeholder="123456789012"
              />
            </div>

            <div>
              <label className="form-label">Серия паспорта</label>
              <input
                type="text"
                className="form-input"
                {...register(`${memberKey}.passport_series` as any)}
                placeholder="1234"
              />
            </div>

            <div>
              <label className="form-label">Номер паспорта</label>
              <input
                type="text"
                className="form-input"
                {...register(`${memberKey}.passport_number` as any)}
                placeholder="567890"
              />
            </div>

            <div>
              <label className="form-label">Дата выдачи паспорта</label>
              <input
                type="date"
                className="form-input"
                {...register(`${memberKey}.passport_issue_date` as any)}
              />
            </div>

            <div>
              <label className="form-label">Код подразделения</label>
              <input
                type="text"
                className="form-input"
                {...register(`${memberKey}.passport_code` as any)}
                placeholder="123-456"
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Кем выдан паспорт</label>
              <input
                type="text"
                className="form-input"
                {...register(`${memberKey}.passport_issued_by` as any)}
                placeholder="ОУФМС России по г. Москва"
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Адрес регистрации</label>
              <input
                type="text"
                className="form-input"
                {...register(`${memberKey}.passport_address` as any)}
                placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      {/* Навигация */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Вернуться к выбору
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Тестовая кнопка для загрузки данных */}
        {SHOW_TEST_BUTTON && (
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={fillTestData}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              🧪 Загрузить тестовые данные
            </button>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Основная информация */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Основная информация
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="form-label">Название кооператива *</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('name', { required: 'Название обязательно' })}
                    placeholder="ТЕСТ"
                  />
                  {errors.name && (
                    <p className="form-error">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Город *</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('city', { required: 'Город обязателен' })}
                    placeholder="Москва"
                  />
                  {errors.city && (
                    <p className="form-error">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Сайт</label>
                  <input
                    type="url"
                    className="form-input"
                    {...register('website')}
                    placeholder="https://test.coop"
                  />
                </div>

                <div>
                  <label className="form-label">Дата учредительного собрания *</label>
                  <input
                    type="date"
                    className="form-input"
                    {...register('founding_date', { required: 'Дата обязательна' })}
                  />
                  {errors.founding_date && (
                    <p className="form-error">{errors.founding_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">ФИО председателя *</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('chairman_full_name', { required: 'ФИО председателя обязательно' })}
                    placeholder="Иванов Иван Иванович"
                  />
                  {errors.chairman_full_name && (
                    <p className="form-error">{errors.chairman_full_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Email для связи</label>
                  <input
                    type="email"
                    className="form-input"
                    {...register('contact_email')}
                    placeholder="info@test.coop"
                  />
                </div>

                <div>
                  <label className="form-label">Email конфиденциальности</label>
                  <input
                    type="email"
                    className="form-input"
                    {...register('confidential_email')}
                    placeholder="privacy@test.coop"
                  />
                </div>

                <div>
                  <label className="form-label">Ссылка на политику конфиденциальности</label>
                  <input
                    type="url"
                    className="form-input"
                    {...register('confidential_link')}
                    placeholder="https://test.coop/privacy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Финансовые параметры */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Финансовые параметры
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="form-label">Первоначальный взнос физ. лиц (руб.)</label>
                  <input
                    type="number"
                    className="form-input"
                    {...register('initial_individuals_and_entprs', { 
                      required: 'Размер взноса обязателен',
                      min: { value: 0, message: 'Размер взноса не может быть отрицательным' }
                    })}
                  />
                  {errors.initial_individuals_and_entprs && (
                    <p className="form-error">{errors.initial_individuals_and_entprs.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Размер взноса физ. лиц (прописью)</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('initial_individuals_and_entprs_text')}
                    placeholder="Сто"
                  />
                </div>

                <div>
                  <label className="form-label">Первоначальный взнос юр. лиц (руб.)</label>
                  <input
                    type="number"
                    className="form-input"
                    {...register('initial_organizations', { 
                      required: 'Размер взноса обязателен',
                      min: { value: 0, message: 'Размер взноса не может быть отрицательным' }
                    })}
                  />
                  {errors.initial_organizations && (
                    <p className="form-error">{errors.initial_organizations.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Размер взноса юр. лиц (прописью)</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('initial_organizations_text')}
                    placeholder="Одна тысяча"
                  />
                </div>

                <div>
                  <label className="form-label">Минимальный взнос физ. лиц (руб.)</label>
                  <input
                    type="number"
                    className="form-input"
                    {...register('minimum_individuals_and_entprs')}
                  />
                </div>

                <div>
                  <label className="form-label">Минимальный взнос физ. лиц (прописью)</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('minimum_individuals_and_entprs_text')}
                    placeholder="Триста"
                  />
                </div>

                <div>
                  <label className="form-label">Минимальный взнос юр. лиц (руб.)</label>
                  <input
                    type="number"
                    className="form-input"
                    {...register('minimum_organizations')}
                  />
                </div>

                <div>
                  <label className="form-label">Минимальный взнос юр. лиц (прописью)</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('minimum_organizations_text')}
                    placeholder="Три тысячи"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Данные протокола */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Данные протокола №1
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="form-label">Дата проведения</label>
                  <input
                    type="date"
                    className="form-input"
                    {...register('protocol_1_date')}
                  />
                </div>

                <div>
                  <label className="form-label">Адрес проведения</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('index_and_full_address')}
                    placeholder="123456, г. Москва, ул. Примерная, д. 1"
                  />
                </div>

                <div>
                  <label className="form-label">Время начала</label>
                  <input
                    type="time"
                    className="form-input"
                    {...register('protocol_1_open_time')}
                  />
                </div>

                <div>
                  <label className="form-label">Время окончания</label>
                  <input
                    type="time"
                    className="form-input"
                    {...register('protocol_1_close_time')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Учредители */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Учредители
              </h3>
              {/* Убираем кнопку добавления */}
            </div>

            {Array.from({ length: 6 }).map((_, index) => 
              renderMemberForm(index)
            )}
          </div>

          {/* Кнопка отправки */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isGenerating}
              className="btn-success px-8 py-3 text-lg"
            >
              {isGenerating ? 'Генерация...' : 'Сгенерировать документы'}
            </button>
          </div>
        </form>

        {/* Результат генерации */}
        {generationResult && (
          <div className="card mt-6 border-success-200 bg-success-50">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <DocumentArrowDownIcon className="h-12 w-12 text-success-600" />
              </div>
              <h3 className="text-lg font-medium text-success-800 mb-2">
                Документы успешно сгенерированы!
              </h3>
              <p className="text-success-700 mb-4">
                Сгенерировано {generationResult.files?.length || 0} документов
              </p>
              <button
                onClick={downloadFiles}
                className="btn-success"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Скачать документы
              </button>
            </div>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="card mt-6 border-error-200 bg-error-50">
            <div className="card-body">
              <h3 className="text-lg font-medium text-error-800 mb-2">
                Ошибка генерации
              </h3>
              <p className="text-error-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 