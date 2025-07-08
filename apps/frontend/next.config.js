/** @type {import('next').NextConfig} */
const nextConfig = {
  // Выводим конфигурацию при запуске
  webpack: (config, { isServer }) => {
    if (isServer) {
      console.log('\n🚀 === КОНФИГУРАЦИЯ ФРОНТЕНДА ===')
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
    }
    return config
  },
  
  // Показываем переменные окружения во время dev сборки
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Логирование при запуске
  generateBuildId: async () => {
    const buildId = `build-${Date.now()}`
    console.log('🔧 Build ID:', buildId)
    return buildId
  }
}

module.exports = nextConfig 