import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { managerAIService } from '@/lib/ai-services';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized. Manager or Admin access required.' },
        { status: 403 }
      );
    }

    const { teamMembers, teamSize, period } = await req.json();

    if (!teamMembers || !teamSize || !period) {
      return NextResponse.json(
        { error: 'Team members, team size, and period are required' },
        { status: 400 }
      );
    }

    const result = await managerAIService.analyzeTeamPerformance({
      teamMembers,
      teamSize,
      period,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Team Performance Analysis Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze team performance' },
      { status: 500 }
    );
  }
}
