import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { aiService } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized. Manager or Admin access required.' },
        { status: 403 }
      );
    }

    const { projects, teamMembers } = await req.json();

    if (!projects || !teamMembers) {
      return NextResponse.json(
        { error: 'Projects and team members data are required' },
        { status: 400 }
      );
    }

    const result = await aiService.optimizeResources({
      projects,
      teamMembers,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Resource Optimization Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to optimize resources' },
      { status: 500 }
    );
  }
}
