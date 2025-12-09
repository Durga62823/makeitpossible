/**
 * AI Service for Admin Features
 * Uses OpenAI/Gemini API for various AI-powered features
 */

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
  riskScore: number; // 1-10
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

// Manager AI Features
export interface AITeamPerformance {
  overallScore: number;
  trends: {
    productivity: 'increasing' | 'stable' | 'decreasing';
    velocity: number;
  };
  teamMembers: Array<{
    name: string;
    performance: 'high' | 'medium' | 'low';
    strengths: string[];
    concerns: string[];
  }>;
  recommendations: string[];
  burnoutRisks: Array<{
    member: string;
    riskLevel: 'low' | 'medium' | 'high';
    indicators: string[];
  }>;
}

export interface AIResourceOptimization {
  currentAllocation: string;
  optimizationScore: number;
  suggestions: Array<{
    action: string;
    impact: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  conflicts: Array<{
    resource: string;
    issue: string;
    resolution: string;
  }>;
  hiringNeeds: Array<{
    role: string;
    reason: string;
    urgency: 'low' | 'medium' | 'high';
  }>;
}

export interface AIApprovalAssistant {
  recommendation: 'approve' | 'reject' | 'review';
  confidence: number;
  reasoning: string[];
  flags: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  suggestions: string[];
}

// Lead AI Features
export interface AITaskPrioritization {
  prioritizedTasks: Array<{
    taskName: string;
    priority: number;
    reasoning: string;
    suggestedAssignee?: string;
    estimatedHours?: number;
  }>;
  dependencies: Array<{
    task: string;
    dependsOn: string[];
  }>;
  recommendations: string[];
}

export interface AIStandupSummary {
  summary: string;
  blockers: Array<{
    member: string;
    blocker: string;
    severity: 'low' | 'medium' | 'high';
    suggestedAction: string;
  }>;
  achievements: string[];
  concerns: string[];
  followUpActions: Array<{
    action: string;
    assignee?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export interface AIRetrospectiveInsights {
  sprintSummary: string;
  metrics: {
    velocityTrend: string;
    completionRate: number;
    averageTaskTime: number;
  };
  positives: string[];
  improvements: string[];
  actionItems: Array<{
    action: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  patterns: string[];
}

export interface AIReportGeneration {
  executiveSummary: string;
  keyMetrics: Array<{
    metric: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }>;
  highlights: string[];
  risks: string[];
  recommendations: string[];
  nextSteps: string[];
}

class AIService {
  private apiKey: string;
  private apiEndpoint: string;
  private provider: 'perplexity' | 'gemini' | 'openai';

  constructor() {
    // Priority: Perplexity > Gemini > OpenAI
    if (process.env.PERPLEXITY_API_KEY) {
      this.apiKey = process.env.PERPLEXITY_API_KEY;
      this.apiEndpoint = 'https://api.perplexity.ai/chat/completions';
      this.provider = 'perplexity';
    } else if (process.env.GEMINI_API_KEY) {
      this.apiKey = process.env.GEMINI_API_KEY;
      this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
      this.provider = 'gemini';
    } else {
      this.apiKey = process.env.OPENAI_API_KEY || '';
      this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
      this.provider = 'openai';
    }
  }

  private async callAI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AI API key not configured. Please set PERPLEXITY_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY in environment variables.');
    }

    try {
      if (this.provider === 'perplexity') {
        // Use Perplexity API with reasoning model
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'sonar-reasoning',
            messages: [
              {
                role: 'system',
                content: 'You are an expert AI assistant specialized in project management, software development, and team coordination. Provide structured JSON responses as requested.',
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 2048,
            temperature: 0.7,
            top_p: 0.9,
            stream: false,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Perplexity API error response:', errorText);
          throw new Error(`Perplexity API error (${response.status}): ${response.statusText}. ${errorText}`);
        }

        const data = await response.json();
        const fullResponse = data.choices?.[0]?.message?.content || '';
        
        // Remove <think> tags if present (reasoning model output)
        return fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      } else if (this.provider === 'gemini') {
        // Use Gemini API
        const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API error response:', errorText);
          throw new Error(`Gemini API error (${response.status}): ${response.statusText}. ${errorText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } else {
        // Use OpenAI API
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch (error) {
      console.error('AI API call failed:', error);
      throw error;
    }
  }

  async breakdownTask(taskDescription: string): Promise<AITaskBreakdown> {
    const prompt = `You are a project management expert. Break down the following task into detailed subtasks.
    
Task: "${taskDescription}"

Provide a JSON response with this exact structure:
{
  "subtasks": [
    {
      "title": "Subtask title",
      "description": "Detailed description",
      "estimatedHours": number,
      "priority": "low" | "medium" | "high"
    }
  ]
}

Make it practical and actionable. Include 3-7 subtasks.`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async estimateTimeline(taskDescription: string, teamSize?: number): Promise<AITimelineEstimate> {
    const prompt = `You are a project management expert. Estimate the timeline for this task/feature.

Task: "${taskDescription}"
Team Size: ${teamSize || 'Unknown'}

Provide a JSON response with this exact structure:
{
  "estimatedDays": number,
  "complexity": "simple" | "moderate" | "complex" | "very_complex",
  "factors": ["factor1", "factor2"],
  "milestones": [
    {
      "title": "Milestone name",
      "daysFromStart": number
    }
  ]
}

Be realistic and consider potential challenges.`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async generateTestCases(taskDescription: string): Promise<AITestCases> {
    const prompt = `You are a QA expert. Generate comprehensive test cases for this feature/task.

Task: "${taskDescription}"

Provide a JSON response with this exact structure:
{
  "testCases": [
    {
      "scenario": "Test scenario description",
      "steps": ["step1", "step2"],
      "expectedResult": "Expected outcome",
      "type": "unit" | "integration" | "e2e"
    }
  ]
}

Include 5-10 test cases covering different scenarios.`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async assessRisk(projectData: {
    name: string;
    deadline?: string;
    teamSize: number;
    tasksCompleted: number;
    totalTasks: number;
    blockers?: string[];
  }): Promise<AIRiskAssessment> {
    const prompt = `You are a project risk management expert. Assess the risks for this project.

Project: "${projectData.name}"
Deadline: ${projectData.deadline || 'Not set'}
Team Size: ${projectData.teamSize}
Progress: ${projectData.tasksCompleted}/${projectData.totalTasks} tasks completed
Known Blockers: ${projectData.blockers?.join(', ') || 'None'}

Provide a JSON response with this exact structure:
{
  "riskScore": number (1-10),
  "riskLevel": "low" | "medium" | "high" | "critical",
  "bottlenecks": [
    {
      "area": "Area name",
      "severity": "Severity level",
      "impact": "Impact description",
      "mitigation": "Mitigation strategy"
    }
  ],
  "resourceSuggestions": [
    {
      "role": "Role needed",
      "hours": number,
      "reasoning": "Why needed"
    }
  ]
}

Be thorough and actionable.`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async generatePerformanceReview(employeeData: {
    name: string;
    role: string;
    projectsCompleted: number;
    tasksCompleted: number;
    onTimeDelivery: number; // percentage
    collaborationScore?: number;
    achievements?: string[];
  }): Promise<AIPerformanceReview> {
    const prompt = `You are an HR and performance management expert. Generate a comprehensive performance review.

Employee: ${employeeData.name}
Role: ${employeeData.role}
Projects Completed: ${employeeData.projectsCompleted}
Tasks Completed: ${employeeData.tasksCompleted}
On-Time Delivery: ${employeeData.onTimeDelivery}%
Achievements: ${employeeData.achievements?.join(', ') || 'None recorded'}

Provide a JSON response with this exact structure:
{
  "overallScore": number (1-10),
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "accomplishments": ["accomplishment1", "accomplishment2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "summary": "Detailed summary paragraph"
}

Be constructive, balanced, and professional.`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async summarizeMeeting(meetingTranscript: string): Promise<AIMeetingSummary> {
    const prompt = `You are a meeting notes expert. Summarize this meeting and extract key information.

Meeting Transcript:
${meetingTranscript}

Provide a JSON response with this exact structure:
{
  "summary": "Brief overall summary",
  "keyPoints": ["point1", "point2"],
  "actionItems": [
    {
      "task": "Task description",
      "assignee": "Name or null",
      "deadline": "Date or null"
    }
  ],
  "decisions": ["decision1", "decision2"]
}

Be concise and capture all important details.`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async planSprint(sprintData: {
    teamMembers: Array<{ name: string; capacity: number }>;
    tasks: Array<{ id?: string; name: string; estimatedHours: number; priority: number }>;
    sprintDuration: number; // in days
  }): Promise<AISprintPlan> {
    const prompt = `You are an agile sprint planning expert. Create an optimal sprint plan.

Team Members: ${JSON.stringify(sprintData.teamMembers)}
Available Tasks: ${JSON.stringify(sprintData.tasks)}
Sprint Duration: ${sprintData.sprintDuration} days

Provide a JSON response with this exact structure:
{
  "sprintGoal": "Clear sprint goal statement",
  "capacity": {
    "totalHours": number,
    "allocatedHours": number,
    "bufferHours": number
  },
  "taskAllocation": [
    {
      "taskName": "Task name",
      "assignee": "Team member name",
      "estimatedHours": number,
      "priority": number
    }
  ],
  "risks": ["risk1", "risk2"],
  "recommendations": ["recommendation1", "recommendation2"]
}

Optimize for balanced workload and realistic commitments.`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  // Manager AI Features
  async analyzeTeamPerformance(performanceData: {
    teamMembers: Array<{
      name: string;
      tasksCompleted: number;
      averageTaskTime: number;
      overtimeHours: number;
    }>;
    teamSize: number;
    period: string;
  }): Promise<AITeamPerformance> {
    const prompt = `You are a team performance analyst. Analyze the following team performance data:

Team Size: ${performanceData.teamSize}
Period: ${performanceData.period}
Team Members Data: ${JSON.stringify(performanceData.teamMembers, null, 2)}

Provide a JSON response with this exact structure:
{
  "overallScore": number (0-100),
  "trends": {
    "productivity": "increasing" | "stable" | "decreasing",
    "velocity": number
  },
  "teamMembers": [
    {
      "name": "member name",
      "performance": "high" | "medium" | "low",
      "strengths": ["strength1", "strength2"],
      "concerns": ["concern1", "concern2"]
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "burnoutRisks": [
    {
      "member": "member name",
      "riskLevel": "low" | "medium" | "high",
      "indicators": ["indicator1", "indicator2"]
    }
  ]
}`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async optimizeResources(resourceData: {
    projects: Array<{ name: string; priority: number; requiredHours: number }>;
    teamMembers: Array<{ name: string; skills: string[]; availableHours: number; currentProjects: string[] }>;
  }): Promise<AIResourceOptimization> {
    const prompt = `You are a resource optimization specialist. Analyze and optimize the following resource allocation:

Projects: ${JSON.stringify(resourceData.projects, null, 2)}
Team Members: ${JSON.stringify(resourceData.teamMembers, null, 2)}

Provide a JSON response with this exact structure:
{
  "currentAllocation": "brief summary",
  "optimizationScore": number (0-100),
  "suggestions": [
    {
      "action": "specific action",
      "impact": "expected impact",
      "priority": "low" | "medium" | "high"
    }
  ],
  "conflicts": [
    {
      "resource": "resource name",
      "issue": "conflict description",
      "resolution": "suggested resolution"
    }
  ],
  "hiringNeeds": [
    {
      "role": "role name",
      "reason": "why needed",
      "urgency": "low" | "medium" | "high"
    }
  ]
}`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async analyzeApproval(approvalData: {
    type: 'timesheet' | 'pto' | 'expense';
    submitter: string;
    amount?: number;
    hours?: number;
    dates?: string[];
    description: string;
    historicalData?: any;
  }): Promise<AIApprovalAssistant> {
    const prompt = `You are an approval assistant. Analyze the following ${approvalData.type} request:

Submitter: ${approvalData.submitter}
${approvalData.hours ? `Hours: ${approvalData.hours}` : ''}
${approvalData.amount ? `Amount: ${approvalData.amount}` : ''}
${approvalData.dates ? `Dates: ${approvalData.dates.join(', ')}` : ''}
Description: ${approvalData.description}
${approvalData.historicalData ? `Historical Data: ${JSON.stringify(approvalData.historicalData)}` : ''}

Provide a JSON response with this exact structure:
{
  "recommendation": "approve" | "reject" | "review",
  "confidence": number (0-100),
  "reasoning": ["reason1", "reason2"],
  "flags": [
    {
      "type": "flag type",
      "severity": "low" | "medium" | "high",
      "description": "flag description"
    }
  ],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  // Lead AI Features
  async prioritizeTasks(taskData: {
    tasks: Array<{
      name: string;
      description: string;
      estimatedHours?: number;
      deadline?: string;
      dependencies?: string[];
    }>;
    teamMembers: Array<{ name: string; skills: string[]; currentLoad: number }>;
  }): Promise<AITaskPrioritization> {
    const prompt = `You are a task prioritization expert. Analyze and prioritize the following tasks:

Tasks: ${JSON.stringify(taskData.tasks, null, 2)}
Team Members: ${JSON.stringify(taskData.teamMembers, null, 2)}

Provide a JSON response with this exact structure:
{
  "prioritizedTasks": [
    {
      "taskName": "task name",
      "priority": number (1-10),
      "reasoning": "why this priority",
      "suggestedAssignee": "team member name",
      "estimatedHours": number
    }
  ],
  "dependencies": [
    {
      "task": "task name",
      "dependsOn": ["dependency1", "dependency2"]
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async summarizeStandup(standupData: {
    teamUpdates: Array<{
      member: string;
      yesterday: string;
      today: string;
      blockers: string;
    }>;
  }): Promise<AIStandupSummary> {
    const prompt = `You are a standup meeting analyst. Summarize the following daily standup:

Team Updates: ${JSON.stringify(standupData.teamUpdates, null, 2)}

Provide a JSON response with this exact structure:
{
  "summary": "brief overall summary",
  "blockers": [
    {
      "member": "member name",
      "blocker": "blocker description",
      "severity": "low" | "medium" | "high",
      "suggestedAction": "suggested action"
    }
  ],
  "achievements": ["achievement1", "achievement2"],
  "concerns": ["concern1", "concern2"],
  "followUpActions": [
    {
      "action": "action description",
      "assignee": "person responsible",
      "priority": "low" | "medium" | "high"
    }
  ]
}`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async generateRetrospective(sprintData: {
    sprintNumber: number;
    duration: number;
    tasksPlanned: number;
    tasksCompleted: number;
    velocity: number;
    previousVelocity?: number;
    teamFeedback?: string[];
  }): Promise<AIRetrospectiveInsights> {
    const prompt = `You are a sprint retrospective facilitator. Analyze the following sprint:

Sprint #${sprintData.sprintNumber}
Duration: ${sprintData.duration} days
Tasks Planned: ${sprintData.tasksPlanned}
Tasks Completed: ${sprintData.tasksCompleted}
Current Velocity: ${sprintData.velocity}
${sprintData.previousVelocity ? `Previous Velocity: ${sprintData.previousVelocity}` : ''}
${sprintData.teamFeedback ? `Team Feedback: ${JSON.stringify(sprintData.teamFeedback)}` : ''}

Provide a JSON response with this exact structure:
{
  "sprintSummary": "overall sprint summary",
  "metrics": {
    "velocityTrend": "trend description",
    "completionRate": number (0-100),
    "averageTaskTime": number
  },
  "positives": ["positive1", "positive2"],
  "improvements": ["improvement1", "improvement2"],
  "actionItems": [
    {
      "action": "action description",
      "category": "process|technical|team",
      "priority": "low" | "medium" | "high"
    }
  ],
  "patterns": ["pattern1", "pattern2"]
}`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }

  async generateReport(reportData: {
    period: string;
    projectName: string;
    metrics: Array<{ name: string; value: string; previousValue?: string }>;
    milestones: Array<{ name: string; status: string; dueDate: string }>;
    issues?: string[];
  }): Promise<AIReportGeneration> {
    const prompt = `You are a project reporting specialist. Generate a comprehensive report:

Period: ${reportData.period}
Project: ${reportData.projectName}
Metrics: ${JSON.stringify(reportData.metrics, null, 2)}
Milestones: ${JSON.stringify(reportData.milestones, null, 2)}
${reportData.issues ? `Issues: ${JSON.stringify(reportData.issues)}` : ''}

Provide a JSON response with this exact structure:
{
  "executiveSummary": "concise executive summary",
  "keyMetrics": [
    {
      "metric": "metric name",
      "value": "current value",
      "trend": "up" | "down" | "stable"
    }
  ],
  "highlights": ["highlight1", "highlight2"],
  "risks": ["risk1", "risk2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "nextSteps": ["step1", "step2"]
}`;

    const response = await this.callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  }
}

export const aiService = new AIService();
