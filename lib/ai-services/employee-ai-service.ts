/**
 * AI Service for Employee Role
 * Uses dedicated API keys for employee-specific features
 */

const EMPLOYEE_PERPLEXITY_API_KEY = process.env.EMPLOYEE_PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY;

export interface AITaskSuggestions {
  suggestions: Array<{
    task: string;
    priority: 'low' | 'medium' | 'high';
    estimatedTime: string;
    reasoning: string;
  }>;
  focusAreas: string[];
}

export interface AIProductivityTips {
  tips: string[];
  timeManagement: string[];
  skillDevelopment: string[];
  resources: Array<{
    title: string;
    type: 'article' | 'video' | 'course';
    url?: string;
  }>;
}

export interface AIReportGeneration {
  report: string;
  summary: string;
  metrics: Array<{
    name: string;
    value: string | number;
    trend?: 'up' | 'down' | 'stable';
  }>;
  highlights: string[];
}

async function callAI(prompt: string): Promise<string> {
  if (!EMPLOYEE_PERPLEXITY_API_KEY) {
    throw new Error('Employee Perplexity API key not configured');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${EMPLOYEE_PERPLEXITY_API_KEY}`,
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
    throw new Error(`Employee Perplexity API error: ${response.statusText}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content || '';
  
  // Remove <think> tags if present
  content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  
  return content;
}

export const employeeAIService = {
  async getTaskSuggestions(userData: any): Promise<AITaskSuggestions> {
    const prompt = `Based on this employee's work data, suggest tasks:

User Data: ${JSON.stringify(userData, null, 2)}

Provide a JSON response with:
{
  "suggestions": [
    {
      "task": "task description",
      "priority": "low" | "medium" | "high",
      "estimatedTime": "time estimate",
      "reasoning": "why this task"
    }
  ],
  "focusAreas": ["area1", "area2"]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async getProductivityTips(performanceData: any): Promise<AIProductivityTips> {
    const prompt = `Provide productivity tips for this employee:

Performance Data: ${JSON.stringify(performanceData, null, 2)}

Provide a JSON response with:
{
  "tips": ["tip1", "tip2"],
  "timeManagement": ["time tip1"],
  "skillDevelopment": ["skill tip1"],
  "resources": [
    {
      "title": "resource title",
      "type": "article" | "video" | "course",
      "url": "optional url"
    }
  ]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async generateReport(reportData: any): Promise<AIReportGeneration> {
    const prompt = `Generate a work report for this employee:

Report Data: ${JSON.stringify(reportData, null, 2)}

Provide a JSON response with:
{
  "report": "full report text",
  "summary": "brief summary",
  "metrics": [
    {
      "name": "metric name",
      "value": "value",
      "trend": "up" | "down" | "stable"
    }
  ],
  "highlights": ["highlight1", "highlight2"]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },
};
