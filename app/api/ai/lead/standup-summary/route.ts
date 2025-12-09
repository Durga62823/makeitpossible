import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { aiService } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'LEAD' && session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized. Lead, Manager, or Admin access required.' },
        { status: 403 }
      );
    }

    const { teamUpdates } = await req.json();

    if (!teamUpdates) {
      return NextResponse.json(
        { error: 'Team updates are required' },
        { status: 400 }
      );
    }

    const result = await aiService.summarizeStandup({ teamUpdates });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Standup Summary Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to summarize standup' },
      { status: 500 }
    );
  }
}
