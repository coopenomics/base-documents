'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import axios from 'axios'
import { ConnectionPackageData } from '../../../../../packages/shared/src'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3542'
const SHOW_TEST_BUTTON = process.env.NEXT_PUBLIC_SHOW_TEST_BUTTON === 'true'

export default function ConnectionPackagePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<ConnectionPackageData>({
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
      protocol_date: new Date().toISOString().split('T')[0],
    }
  })

  const watchedName = watch('name')

  const onSubmit = async (data: ConnectionPackageData) => {
    setIsGenerating(true)
    setError(null)
    setGenerationResult(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/api/cooperative/connection-package`, data, {
        timeout: 60000 // 60 секунд таймаут
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

  const fillTestData = () => {
    setValue('name', 'ТЕСТ')
    setValue('city', 'Москва')
    setValue('website', 'https://test.coop')
    setValue('chairman_full_name', 'Иванов Иван Иванович')
    setValue('contact_email', 'info@test.coop')
    setValue('confidential_email', 'privacy@test.coop')
    setValue('confidential_link', 'https://test.coop/privacy')
    setValue('protocol_date', '2024-01-15')
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

      <div className="max-w-2xl mx-auto">
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
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body space-y-6">
              {/* Основная информация */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Основная информация
                </h3>
                
                <div className="grid gap-4">
                  <div>
                    <label className="form-label">
                      Название кооператива *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('name', { 
                        required: 'Название обязательно'
                      })}
                      placeholder="ТЕСТ"
                    />
                    {errors.name && (
                      <p className="form-error">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      Город *
                    </label>
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
                    <label className="form-label">
                      Сайт
                    </label>
                    <input
                      type="url"
                      className="form-input"
                      {...register('website')}
                      placeholder="https://test.coop"
                    />
                  </div>
                </div>
              </div>

              {/* Дата протокола */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Протокол совета
                </h3>
                
                <div className="grid gap-4">
                  <div>
                    <label className="form-label">
                      Дата протокола *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      {...register('protocol_date', { required: 'Дата протокола обязательна' })}
                    />
                    {errors.protocol_date && (
                      <p className="form-error">{errors.protocol_date.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Контактная информация */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Контактная информация
                </h3>
                
                <div className="grid gap-4">
                  <div>
                    <label className="form-label">
                      ФИО председателя *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('chairman_full_name', { required: 'ФИО председателя обязательно' })}
                      placeholder="Фамилия Имя Отчество"
                    />
                    {errors.chairman_full_name && (
                      <p className="form-error">{errors.chairman_full_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      Email для связи
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      {...register('contact_email')}
                      placeholder="info@test.coop"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Email для вопросов конфиденциальности
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      {...register('confidential_email')}
                      placeholder="privacy@test.coop"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Ссылка на политику конфиденциальности
                    </label>
                    <input
                      type="url"
                      className="form-input"
                      {...register('confidential_link')}
                      placeholder="https://test.coop/privacy"
                    />
                  </div>
                </div>
              </div>

              {/* Дополнительные аббревиатуры */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Дополнительные параметры
                </h3>
                
                <div className="grid gap-4">
                  <div>
                    <label className="form-label">
                      Краткая аббревиатура
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('short_abbr')}
                      placeholder="ПК"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Полная аббревиатура
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('full_abbr')}
                      placeholder="Потребительский Кооператив"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Полная аббревиатура (родительный падеж)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('full_abbr_genitive')}
                      placeholder="Потребительского Кооператива"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Полная аббревиатура (дательный падеж)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('full_abbr_dative')}
                      placeholder="Потребительском Кооперативе"
                    />
                  </div>
                </div>
              </div>

              {/* Кнопка отправки */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  {isGenerating ? 'Генерация...' : 'Сгенерировать документы'}
                </button>
              </div>
            </div>
          </form>
        </div>

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