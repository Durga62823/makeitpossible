/**
 * AI Service for Admin Role
 * Uses dedicated API keys for admin-specific features
 */

const ADMIN_PERPLEXITY_API_KEY = process.env.ADMIN_PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY;

export interface AITaskBreakdown {
  subtasks: Array<{
    title: string;
    description: string;
    estimatedHours: number;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export interface AITimelineEstimate {
  estimatedDays: number;
  complexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
  factors: string[];
  milestones: Array<{
    title: string;
    daysFromStart: number;
  }>;
}

export interface AITestCases {
  testCases: Array<{
    scenario: string;
    steps: string[];
    expectedResult: string;
    type: 'unit' | 'integration' | 'e2e';
  }>;
}

export interface AIRiskAssessment {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  bottlenecks: Array<{
    area: string;
    severity: string;
    impact: string;
    mitigation: string;
  }>;
  resourceSuggestions: Array<{
    role: string;
    hours: number;
    reasoning: string;
  }>;
}

export interface AIPerformanceReview {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  accomplishments: string[];
  recommendations: string[];
  summary: string;
}

export interface AIMeetingSummary {
  summary: string;
  keyPoints: string[];
  actionItems: Array<{
    task: string;
    assignee?: string;
    deadline?: string;
  }>;
  decisions: string[];
}

export interface AISprintPlan {
  sprintGoal: string;
  capacity: {
    totalHours: number;
    allocatedHours: number;
    bufferHours: number;
  };
  taskAllocation: Array<{
    taskId?: string;
    taskName: string;
    assignee: string;
    estimatedHours: number;
    priority: number;
  }>;
  risks: string[];
  recommendations: string[];
}

async function callAI(prompt: string): Promise<string> {
  if (!ADMIN_PERPLEXITY_API_KEY) {
    throw new Error('Admin Perplexity API key not configured');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'sonar-reasoning',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Admin Perplexity API error: ${response.statusText}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content || '';
  
  // Remove <think> tags if present
  content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  
  return content;
}

export const adminAIService = {
  async breakdownTask(taskData: { title: string; description: string }): Promise<AITaskBreakdown> {
    const prompt = `As a project management AI, break down this task into subtasks:

Task: ${taskData.title}
Description: ${taskData.description}

Provide a JSON response with:
{
  "subtasks": [
    {
      "title": "subtask name",
      "description": "detailed description",
      "estimatedHours": number,
      "priority": "low" | "medium" | "high"
    }
  ]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async estimateTimeline(taskData: { title: string; description: string; complexity?: string }): Promise<AITimelineEstimate> {
    const prompt = `Estimate the timeline for this task:

Task: ${taskData.title}
Description: ${taskData.description}
${taskData.complexity ? `Known Complexity: ${taskData.complexity}` : ''}

Provide a JSON response with:
{
  "estimatedDays": number,
  "complexity": "simple" | "moderate" | "complex" | "very_complex",
  "factors": ["factor1", "factor2"],
  "milestones": [{"title": "milestone", "daysFromStart": number}]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async generateTestCases(taskData: { title: string; description: string; acceptanceCriteria?: string }): Promise<AITestCases> {
    const prompt = `Generate test cases for this task:

Task: ${taskData.title}
Description: ${taskData.description}
${taskData.acceptanceCriteria ? `Acceptance Criteria: ${taskData.acceptanceCriteria}` : ''}

Provide a JSON response with:
{
  "testCases": [
    {
      "scenario": "test scenario",
      "steps": ["step1", "step2"],
      "expectedResult": "expected outcome",
      "type": "unit" | "integration" | "e2e"
    }
  ]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async assessRisk(projectData: any): Promise<AIRiskAssessment> {
    const prompt = `Assess risks for this project:

Project Data: ${JSON.stringify(projectData, null, 2)}

Provide a JSON response with:
{
  "riskScore": number (1-10),
  "riskLevel": "low" | "medium" | "high" | "critical",
  "bottlenecks": [{"area": "", "severity": "", "impact": "", "mitigation": ""}],
  "resourceSuggestions": [{"role": "", "hours": number, "reasoning": ""}]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async reviewPerformance(performanceData: any): Promise<AIPerformanceReview> {
    const prompt = `Review employee performance:

Performance Data: ${JSON.stringify(performanceData, null, 2)}

Provide a JSON response with:
{
  "overallScore": number (0-100),
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "accomplishments": ["accomplishment1"],
  "recommendations": ["recommendation1"],
  "summary": "overall summary"
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async summarizeMeeting(meetingData: { transcript?: string; notes?: string; attendees?: string[] }): Promise<AIMeetingSummary> {
    const prompt = `Summarize this meeting:

${meetingData.transcript ? `Transcript: ${meetingData.transcript}` : ''}
${meetingData.notes ? `Notes: ${meetingData.notes}` : ''}
${meetingData.attendees ? `Attendees: ${meetingData.attendees.join(', ')}` : ''}

Provide a JSON response with:
{
  "summary": "meeting summary",
  "keyPoints": ["point1", "point2"],
  "actionItems": [{"task": "", "assignee": "", "deadline": ""}],
  "decisions": ["decision1"]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async planSprint(sprintData: any): Promise<AISprintPlan> {
    const prompt = `Plan this sprint:

Sprint Data: ${JSON.stringify(sprintData, null, 2)}

Provide a JSON response with:
{
  "sprintGoal": "goal",
  "capacity": {"totalHours": number, "allocatedHours": number, "bufferHours": number},
  "taskAllocation": [{"taskName": "", "assignee": "", "estimatedHours": number, "priority": number}],
  "risks": ["risk1"],
  "recommendations": ["recommendation1"]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },
};
