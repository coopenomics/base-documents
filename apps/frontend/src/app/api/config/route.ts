import { NextResponse } from 'next/server'

export async function GET() {
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