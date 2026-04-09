import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getRecentSyncJobs } from '@/lib/db/queries';

// GET /api/dashboard
export async function GET() {
  const stats = getDashboardStats();
  const recentJobs = getRecentSyncJobs(10);

  // Parse JSON fields
  const jobs = (recentJobs as Record<string, unknown>[]).map((j) => ({
    ...j,
    modelos: typeof j.modelos === 'string' ? JSON.parse(j.modelos as string) : j.modelos,
    tipos: typeof j.tipos === 'string' ? JSON.parse(j.tipos as string) : j.tipos,
  }));

  return NextResponse.json({ stats, recentJobs: jobs });
}
