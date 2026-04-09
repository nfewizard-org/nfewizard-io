import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    // For MVP, simple hardcoded password from env or default
    const validPassword = process.env.ADMIN_PASSWORD || 'wizard123';
    
    if (password === validPassword) {
      const response = NextResponse.json({ success: true }, { status: 200 });
      
      response.cookies.set('auth_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    }
    
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
