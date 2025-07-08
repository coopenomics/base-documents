import { useState, useEffect } from 'react'

interface Config {
  API_URL: string
  SHOW_TEST_BUTTON: boolean
}

const defaultConfig: Config = {
  API_URL: 'http://localhost:3542',
  SHOW_TEST_BUTTON: false,
}

export function useConfig() {
  const [config, setConfig] = useState<Config>(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 useConfig: Запрос конфигурации...')
    
    fetch('/frontend-api/config')
      .then(res => {
        console.log('🔍 useConfig: Ответ получен, status:', res.status)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log('🔍 useConfig: Данные получены:', data)
        setConfig(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('❌ useConfig: Ошибка при загрузке конфигурации:', error)
        console.error('❌ useConfig: Используется defaultConfig:', defaultConfig)
        setConfig(defaultConfig)
        setLoading(false)
      })
  }, [])

  return { config, loading }
} 