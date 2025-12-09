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

    const reportData = await req.json();

    if (!reportData.period || !reportData.projectName || !reportData.metrics) {
      return NextResponse.json(
        { error: 'Period, project name, and metrics are required' },
        { status: 400 }
      );
    }

    const result = await aiService.generateReport(reportData);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Report Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
