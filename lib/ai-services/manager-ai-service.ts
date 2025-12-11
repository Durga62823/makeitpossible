/**
 * AI Service for Manager Role
 * Uses dedicated API keys for manager-specific features
 */

const MANAGER_PERPLEXITY_API_KEY = process.env.MANAGER_PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY;

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
}

export interface AIResourceOptimization {
  currentUtilization: number;
  optimalAllocation: Array<{
    employee: string;
    currentHours: number;
    recommendedHours: number;
    projects: string[];
  }>;
  suggestions: string[];
  potentialSavings: {
    hours: number;
    cost?: number;
  };
}

export interface AIApprovalAssistant {
  recommendation: 'approve' | 'reject' | 'request_changes';
  confidence: number;
  reasoning: string[];
  riskFactors: string[];
  alternatives?: string[];
}

async function callAI(prompt: string): Promise<string> {
  if (!MANAGER_PERPLEXITY_API_KEY) {
    throw new Error('Manager Perplexity API key not configured');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MANAGER_PERPLEXITY_API_KEY}`,
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
    throw new Error(`Manager Perplexity API error: ${response.statusText}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content || '';
  
  // Remove <think> tags if present
  content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  
  return content;
}

export const managerAIService = {
  async analyzeTeamPerformance(teamData: any): Promise<AITeamPerformance> {
    const prompt = `Analyze team performance as a manager:

Team Data: ${JSON.stringify(teamData, null, 2)}

Provide a JSON response with:
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
      "strengths": ["strength1"],
      "concerns": ["concern1"]
    }
  ],
  "recommendations": ["recommendation1"]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async optimizeResources(resourceData: any): Promise<AIResourceOptimization> {
    const prompt = `Optimize resource allocation for the team:

Resource Data: ${JSON.stringify(resourceData, null, 2)}

Provide a JSON response with:
{
  "currentUtilization": number (0-100),
  "optimalAllocation": [
    {
      "employee": "name",
      "currentHours": number,
      "recommendedHours": number,
      "projects": ["project1"]
    }
  ],
  "suggestions": ["suggestion1"],
  "potentialSavings": {
    "hours": number,
    "cost": number
  }
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },

  async analyzeApproval(approvalData: any): Promise<AIApprovalAssistant> {
    const prompt = `Analyze this approval request as a manager:

Request Data: ${JSON.stringify(approvalData, null, 2)}

Provide a JSON response with:
{
  "recommendation": "approve" | "reject" | "request_changes",
  "confidence": number (0-100),
  "reasoning": ["reason1", "reason2"],
  "riskFactors": ["risk1"],
  "alternatives": ["alternative1"]
}`;

    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    return JSON.parse(jsonMatch[0]);
  },
};
