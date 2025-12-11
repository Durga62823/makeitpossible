/**
 * Centralized AI Services Export
 * Each role has its own dedicated AI service with separate API keys
 */

export { adminAIService } from './admin-ai-service';
export { managerAIService } from './manager-ai-service';
export { leadAIService } from './lead-ai-service';
export { employeeAIService } from './employee-ai-service';

// Re-export types
export type {
  AITaskBreakdown,
  AITimelineEstimate,
  AITestCases,
  AIRiskAssessment,
  AIPerformanceReview,
  AIMeetingSummary,
  AISprintPlan,
} from './admin-ai-service';

export type {
  AITeamPerformance,
  AIResourceOptimization,
  AIApprovalAssistant,
} from './manager-ai-service';

export type {
  AITaskPrioritization,
  AIStandupSummary,
  AIRetrospective,
} from './lead-ai-service';

export type {
  AITaskSuggestions,
  AIProductivityTips,
  AIReportGeneration,
} from './employee-ai-service';
