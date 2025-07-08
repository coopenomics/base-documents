import { NextResponse } from 'next/server'

export async function GET() {
  // Читаем переменные в runtime!
  console.log('\n🚀 === КОНФИГУРАЦИЯ ФРОНТЕНДА (RUNTIME) ===')
  console.log('📍 Переменные окружения:')
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'не установлено')
  console.log('  API_URL:', process.env.API_URL || 'не установлено')
  console.log('  SHOW_TEST_BUTTON:', process.env.SHOW_TEST_BUTTON || 'не установлено')
  console.log('  DOMAIN:', process.env.DOMAIN || 'не установлено')
  console.log('  BACKEND_PORT:', process.env.BACKEND_PORT || 'не установлено')
  console.log('  FRONTEND_PORT:', process.env.FRONTEND_PORT || 'не установлено')
  console.log('  PORT:', process.env.PORT || 'не установлено')
  console.log('  NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'не установлено')
  console.log('================================\n')

  const config = {
    API_URL: process.env.API_URL || 'http://localhost:3542',
    SHOW_TEST_BUTTON: process.env.SHOW_TEST_BUTTON === 'true',
    DOMAIN: process.env.DOMAIN || 'localhost',
    BACKEND_PORT: process.env.BACKEND_PORT || '3542',
    FRONTEND_PORT: process.env.FRONTEND_PORT || '3001',
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Дополнительная информация для отладки
    _debug: {
      timestamp: new Date().toISOString(),
      allEnvVars: Object.keys(process.env).filter(key => 
        key.startsWith('NEXT_PUBLIC_') || 
        ['API_URL', 'SHOW_TEST_BUTTON', 'DOMAIN', 'BACKEND_PORT', 'FRONTEND_PORT', 'NODE_ENV'].includes(key)
      ).reduce((acc, key) => {
        acc[key] = process.env[key]
        return acc
      }, {} as Record<string, string | undefined>)
    }
  }

  console.log('🔍 API Config запрошен:', config)
  
  return NextResponse.json(config)
} 