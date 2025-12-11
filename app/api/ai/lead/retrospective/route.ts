import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { leadAIService } from '@/lib/ai-services';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'LEAD' && session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized. Lead, Manager, or Admin access required.' },
        { status: 403 }
      );
    }

    const sprintData = await req.json();

    if (!sprintData.sprintNumber || !sprintData.duration || !sprintData.tasksPlanned || !sprintData.tasksCompleted) {
      return NextResponse.json(
        { error: 'Sprint number, duration, tasks planned, and tasks completed are required' },
        { status: 400 }
      );
    }

    const result = await leadAIService.generateRetrospective(sprintData);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Retrospective Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate retrospective' },
      { status: 500 }
    );
  }
}
