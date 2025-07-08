'use client'

import { DocumentTextIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="px-4 sm:px-0">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Генерация документов для кооперативов
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Заполните простую форму с основными данными, и система автоматически 
          сгенерирует все необходимые документы в формате Word.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {/* Новый кооператив */}
        <Link href="/new-cooperative" className="group">
          <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="card-body flex flex-col">
              <div className="flex justify-center mb-4">
                <BuildingOfficeIcon className="h-12 w-12 text-success-600 group-hover:text-success-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Регистрация нового кооператива
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Учредительные документы для юридической регистрации потребительского кооператива
              </p>
              <div className="flex-1 flex flex-col">
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• Типовой Устав кооператива</li>
                  <li>• Протокол №1 учредительного собрания</li>
                </ul>
                <div className="flex-grow"></div>
              </div>
              <div className="mt-6 text-center">
                <span className="btn-success">
                  Создать пакет
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Пакет подключения */}
        <Link href="/connection-package" className="group">
          <div className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="card-body flex flex-col">
              <div className="flex justify-center mb-4">
                <DocumentTextIcon className="h-12 w-12 text-primary-600 group-hover:text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Пакет подключения к платформе
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Документы для подключения к платформе Кооперативной Экономики
              </p>
              <div className="flex-1 flex flex-col">
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• Положение о ЦПП "Цифровой Кошелек"</li>
                  <li>• Положение о простой электронной подписи</li>
                  <li>• Политика конфиденциальности</li>
                  <li>• Пользовательское соглашение</li>
                  <li>• Формы заявлений на вступление для физлиц, юрлиц и индивидуальных предпринимателей</li>
                </ul>
                <div className="flex-grow"></div>
              </div>
              <div className="mt-6 text-center">
                <span className="btn-primary">
                  Создать пакет
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
} 