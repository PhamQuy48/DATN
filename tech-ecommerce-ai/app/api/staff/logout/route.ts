import { NextResponse } from 'next/server'

// POST /api/staff/logout - Staff logout
export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear staff session cookie
  response.cookies.set('staff_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}
