/**
 * AI Service for Lead Role
 * Uses dedicated API keys for lead-specific features
 */

const LEAD_PERPLEXITY_API_KEY = process.env.LEAD_PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY;

export interface AITaskPrioritization {
  prioritizedTasks: Array<{
    taskId?: string;
    taskName: string;
    priority: number;
    reasoning: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    dependencies?: string[];
  }>;
  suggestions: string[];
}

export interface AIStandupSummary {
  summary: string;
  teamProgress: {
    completed: number;
    inProgress: number;
    blocked: number;
  };
  blockers: Array<{
    member: string;
    issue: string;
    suggestion?: string;
  }>;
  achievements: string[];
  nextSteps: string[];
}

export interface AIRetrospective {
  positives: string[];
  negatives: string[];
  actionItems: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
    owner?: string;
  }>;
  insights: string[];
  teamMorale: 'low' | 'medium' | 'high';
}

async function callAI(prompt: string): Promise<string> {
  if (!LEAD_PERPLEXITY_API_KEY) {
    throw new Error('Lead Perplexity API key not configured');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LEAD_PERPLEXITY_API_KEY}`,
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
    throw new Error(`Lead Perplexity API error: ${response.statusText}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content || '';
  
  // Remove <think> tags if present
  content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  
  return content;
}

export const leadAIService = {
  async prioritizeTasks(tasksData: any): Promise<AITaskPrioritization> {
    const prompt = `As a team lead, prioritize these tasks:

Tasks Data: ${JSON.stringify(tasksData, null, 2)}

Provide a JSON response with:
{
  "prioritizedTasks": [
    {
      "taskName": "task name",
      "priority": number (1-10),
      "reasoning": "why this priority",
      "urgency": "low" | "medium" | "high" | "critical",
      "dependencies": ["task1"]
    }
  ],
  "suggestions": ["suggestion1"]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async summarizeStandup(standupData: any): Promise<AIStandupSummary> {
    const prompt = `Summarize this standup meeting as a team lead:

Standup Data: ${JSON.stringify(standupData, null, 2)}

Provide a JSON response with:
{
  "summary": "overall summary",
  "teamProgress": {
    "completed": number,
    "inProgress": number,
    "blocked": number
  },
  "blockers": [
    {
      "member": "name",
      "issue": "blocker description",
      "suggestion": "how to resolve"
    }
  ],
  "achievements": ["achievement1"],
  "nextSteps": ["step1"]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async generateRetrospective(retrospectiveData: any): Promise<AIRetrospective> {
    const prompt = `Generate a retrospective analysis as a team lead:

Retrospective Data: ${JSON.stringify(retrospectiveData, null, 2)}

Provide a JSON response with:
{
  "positives": ["positive1", "positive2"],
  "negatives": ["negative1", "negative2"],
  "actionItems": [
    {
      "action": "what to do",
      "priority": "low" | "medium" | "high",
      "owner": "who owns it"
    }
  ],
  "insights": ["insight1"],
  "teamMorale": "low" | "medium" | "high"
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },
};
