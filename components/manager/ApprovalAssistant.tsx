'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Calendar, Clock } from 'lucide-react';

interface FormData {
  requestType: 'timesheet' | 'pto';
  employeeName: string;
  requestDetails: string;
  historicalData: string;
  projectDeadlines: string;
}

interface ApprovalRecommendation {
  decision: 'approve' | 'reject' | 'review';
  confidence: number;
  reasoning: string[];
  risks: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }>;
  alternatives: string[];
  impactAnalysis: string;
}

export function ApprovalAssistant() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApprovalRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    requestType: 'timesheet',
    employeeName: '',
    requestDetails: '',
    historicalData: '',
    projectDeadlines: ''
  });

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/manager/approval-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze approval request');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Approval Assistant</h2>
        <p className="text-gray-600 mb-6">
          Get AI-powered recommendations for timesheet and PTO approval decisions
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="requestType">Request Type</Label>
          <select
            id="requestType"
            value={formData.requestType}
            onChange={(e) => setFormData({ ...formData, requestType: e.target.value as 'timesheet' | 'pto' })}
            className="w-full p-2 border rounded-md"
          >
            <option value="timesheet">Timesheet</option>
            <option value="pto">PTO Request</option>
          </select>
        </div>

        <div>
          <Label htmlFor="employeeName">Employee Name</Label>
          <Input
            id="employeeName"
            value={formData.employeeName}
            onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
            placeholder="Enter employee name"
          />
        </div>

        <div>
          <Label htmlFor="requestDetails">Request Details</Label>
          <textarea
            id="requestDetails"
            value={formData.requestDetails}
            onChange={(e) => setFormData({ ...formData, requestDetails: e.target.value })}
            placeholder={formData.requestType === 'timesheet' 
              ? "e.g., 45 hours logged for Project X, including 10 hours overtime"
              : "e.g., Requesting 5 days off from Dec 20-24 for holidays"}
            className="w-full p-2 border rounded-md min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="historicalData">Historical Data</Label>
          <textarea
            id="historicalData"
            value={formData.historicalData}
            onChange={(e) => setFormData({ ...formData, historicalData: e.target.value })}
            placeholder="e.g., Average 40 hours/week, 2 PTO requests in last 6 months"
            className="w-full p-2 border rounded-md min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="projectDeadlines">Project Deadlines & Team Context</Label>
          <textarea
            id="projectDeadlines"
            value={formData.projectDeadlines}
            onChange={(e) => setFormData({ ...formData, projectDeadlines: e.target.value })}
            placeholder="e.g., Sprint ends Dec 15, Team at 80% capacity"
            className="w-full p-2 border rounded-md min-h-20"
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={loading || !formData.employeeName || !formData.requestDetails}
          className="w-full"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Analyze Request
            </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 border-t pt-6">
          <h3 className="text-xl font-bold">Recommendation</h3>

          {/* Decision Badge */}
          <div className={`p-6 rounded-lg border-2 ${
            result.decision === 'approve' 
              ? 'bg-green-50 border-green-300'
              : result.decision === 'reject'
              ? 'bg-red-50 border-red-300'
              : 'bg-orange-50 border-orange-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {result.decision === 'approve' && <CheckCircle className="h-8 w-8 text-green-600" />}
                {result.decision === 'reject' && <XCircle className="h-8 w-8 text-red-600" />}
                {result.decision === 'review' && <AlertCircle className="h-8 w-8 text-orange-600" />}
                <div>
                  <p className="text-2xl font-bold capitalize">{result.decision}</p>
                  <p className="text-sm text-gray-600">Confidence: {result.confidence}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div>
            <h4 className="font-semibold mb-3">Analysis Reasoning</h4>
            <ul className="space-y-2">
              {result.reasoning.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold mt-0.5">{index + 1}.</span>
                  <span className="text-sm text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          {result.risks.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Identified Risks
              </h4>
              <div className="space-y-2">
                {result.risks.map((risk, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      risk.severity === 'high'
                        ? 'bg-red-50 border-red-200'
                        : risk.severity === 'medium'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{risk.type}</p>
                      <Badge
                        variant={risk.severity === 'high' ? 'destructive' : 'secondary'}
                      >
                        {risk.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impact Analysis */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold mb-2">Impact Analysis</h4>
            <p className="text-sm text-gray-700">{result.impactAnalysis}</p>
          </div>

          {/* Alternatives */}
          {result.alternatives.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Alternative Solutions</h4>
              <ul className="space-y-2">
                {result.alternatives.map((alt, index) => (
                  <li key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-bold mt-0.5">•</span>
                    <span className="text-sm text-gray-700">{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
