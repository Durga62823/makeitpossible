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

    const approvalData = await req.json();

    if (!approvalData.type || !approvalData.submitter || !approvalData.description) {
      return NextResponse.json(
        { error: 'Type, submitter, and description are required' },
        { status: 400 }
      );
    }

    const result = await managerAIService.analyzeApproval(approvalData);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Approval Analysis Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze approval request' },
      { status: 500 }
    );
  }
}
