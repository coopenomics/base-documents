import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    API_URL: process.env.API_URL || 'http://localhost:3542',
    SHOW_TEST_BUTTON: process.env.SHOW_TEST_BUTTON === 'true',
  })
} 