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

    const { tasks, teamMembers } = await req.json();

    if (!tasks || !teamMembers) {
      return NextResponse.json(
        { error: 'Tasks and team members data are required' },
        { status: 400 }
      );
    }

    const result = await leadAIService.prioritizeTasks({
      tasks,
      teamMembers,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Task Prioritization Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to prioritize tasks' },
      { status: 500 }
    );
  }
}
