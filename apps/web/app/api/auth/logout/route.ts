import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_token');
  return response;
}
