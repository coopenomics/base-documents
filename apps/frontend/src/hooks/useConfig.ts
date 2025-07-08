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
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(() => {
        setConfig(defaultConfig)
        setLoading(false)
      })
  }, [])

  return { config, loading }
} 