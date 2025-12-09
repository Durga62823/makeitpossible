'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';

interface FormData {
  sprintNumber: string;
  sprintGoals: string;
  completedTasks: string;
  incompleteTasks: string;
  teamFeedback: string;
  metrics: string;
}

interface RetrospectiveResult {
  summary: string;
  wentWell: string[];
  needsImprovement: string[];
  actionItems: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    owner: string;
  }>;
  metrics: Array<{
    name: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }>;
  recommendations: string[];
}

export function SprintRetrospective() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RetrospectiveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    sprintNumber: '',
    sprintGoals: '',
    completedTasks: '',
    incompleteTasks: '',
    teamFeedback: '',
    metrics: ''
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/lead/retrospective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate retrospective');
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
        <h2 className="text-2xl font-bold mb-4">Sprint Retrospective</h2>
        <p className="text-gray-600 mb-6">
          AI-powered sprint retrospective analysis and improvement recommendations
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sprintNumber">Sprint Number</Label>
            <Input
              id="sprintNumber"
              value={formData.sprintNumber}
              onChange={(e) => setFormData({ ...formData, sprintNumber: e.target.value })}
              placeholder="e.g., Sprint 23"
            />
          </div>
          <div>
            <Label htmlFor="sprintGoals">Sprint Goals</Label>
            <Input
              id="sprintGoals"
              value={formData.sprintGoals}
              onChange={(e) => setFormData({ ...formData, sprintGoals: e.target.value })}
              placeholder="e.g., Complete user dashboard"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="completedTasks">Completed Tasks</Label>
          <textarea
            id="completedTasks"
            value={formData.completedTasks}
            onChange={(e) => setFormData({ ...formData, completedTasks: e.target.value })}
            placeholder="List all completed tasks and features"
            className="w-full p-2 border rounded-md min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="incompleteTasks">Incomplete Tasks</Label>
          <textarea
            id="incompleteTasks"
            value={formData.incompleteTasks}
            onChange={(e) => setFormData({ ...formData, incompleteTasks: e.target.value })}
            placeholder="List incomplete or carried-over tasks"
            className="w-full p-2 border rounded-md min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="teamFeedback">Team Feedback</Label>
          <textarea
            id="teamFeedback"
            value={formData.teamFeedback}
            onChange={(e) => setFormData({ ...formData, teamFeedback: e.target.value })}
            placeholder="What went well? What needs improvement? Any blockers or challenges?"
            className="w-full p-2 border rounded-md min-h-28"
          />
        </div>

        <div>
          <Label htmlFor="metrics">Sprint Metrics</Label>
          <textarea
            id="metrics"
            value={formData.metrics}
            onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
            placeholder="e.g., Velocity: 45 points, Bugs: 3, Code reviews: 12"
            className="w-full p-2 border rounded-md min-h-20"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !formData.sprintNumber || !formData.sprintGoals}
          className="w-full"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Retrospective
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
          <h3 className="text-xl font-bold">Retrospective Analysis</h3>

          {/* Summary */}
          <div className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Sprint Summary</h4>
            <p className="text-gray-700">{result.summary}</p>
          </div>

          {/* Metrics */}
          {result.metrics.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Sprint Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {result.metrics.map((metric, index) => (
                  <div key={index} className="p-4 bg-white border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{metric.name}</p>
                      {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Went Well */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              What Went Well
            </h4>
            <div className="space-y-2">
              {result.wentWell.map((item, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-gray-700">✓ {item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Improvement */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              Needs Improvement
            </h4>
            <div className="space-y-2">
              {result.needsImprovement.map((item, index) => (
                <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-gray-700">⚠ {item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div>
            <h4 className="font-semibold mb-3">Action Items</h4>
            <div className="space-y-3">
              {result.actionItems.map((item, index) => (
                <div key={index} className="p-4 bg-white border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm flex-1">{item.action}</p>
                    <Badge
                      variant={
                        item.priority === 'high'
                          ? 'destructive'
                          : item.priority === 'medium'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {item.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Owner: {item.owner}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              AI Recommendations
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span className="text-sm text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
