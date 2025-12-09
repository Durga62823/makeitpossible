'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react';

interface TeamUpdate {
  memberName: string;
  yesterday: string;
  today: string;
  blockers: string;
}

interface FormData {
  teamUpdates: TeamUpdate[];
  sprintGoals: string;
}

interface StandupSummary {
  summary: string;
  keyAchievements: string[];
  blockers: Array<{
    blocker: string;
    severity: 'high' | 'medium' | 'low';
    suggestion: string;
  }>;
  teamMorale: {
    score: number;
    assessment: string;
  };
  actionItems: string[];
}

export function StandupSummary() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StandupSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    teamUpdates: [{ memberName: '', yesterday: '', today: '', blockers: '' }],
    sprintGoals: ''
  });

  const addUpdate = () => {
    setFormData({
      ...formData,
      teamUpdates: [...formData.teamUpdates, { memberName: '', yesterday: '', today: '', blockers: '' }]
    });
  };

  const removeUpdate = (index: number) => {
    const newUpdates = formData.teamUpdates.filter((_, i) => i !== index);
    setFormData({ ...formData, teamUpdates: newUpdates });
  };

  const updateTeamUpdate = (index: number, field: keyof TeamUpdate, value: string) => {
    const newUpdates = [...formData.teamUpdates];
    newUpdates[index][field] = value;
    setFormData({ ...formData, teamUpdates: newUpdates });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/lead/standup-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate standup summary');
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
        <h2 className="text-2xl font-bold mb-4">Daily Standup Summary</h2>
        <p className="text-gray-600 mb-6">
          Generate AI-powered summaries and insights from daily standup meetings
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="sprintGoals">Current Sprint Goals</Label>
          <Input
            id="sprintGoals"
            value={formData.sprintGoals}
            onChange={(e) => setFormData({ ...formData, sprintGoals: e.target.value })}
            placeholder="e.g., Complete user authentication, Deploy API v2"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-lg">Team Updates</Label>
            <Button onClick={addUpdate} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          {formData.teamUpdates.map((update, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Member {index + 1}</span>
                {formData.teamUpdates.length > 1 && (
                  <Button
                    onClick={() => removeUpdate(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Member Name</Label>
                  <Input
                    value={update.memberName}
                    onChange={(e) => updateTeamUpdate(index, 'memberName', e.target.value)}
                    placeholder="Team member name"
                  />
                </div>
                <div>
                  <Label>What did you do yesterday?</Label>
                  <textarea
                    value={update.yesterday}
                    onChange={(e) => updateTeamUpdate(index, 'yesterday', e.target.value)}
                    placeholder="Yesterday's accomplishments"
                    className="w-full p-2 border rounded-md min-h-20"
                  />
                </div>
                <div>
                  <Label>What will you do today?</Label>
                  <textarea
                    value={update.today}
                    onChange={(e) => updateTeamUpdate(index, 'today', e.target.value)}
                    placeholder="Today's planned work"
                    className="w-full p-2 border rounded-md min-h-20"
                  />
                </div>
                <div>
                  <Label>Any blockers?</Label>
                  <textarea
                    value={update.blockers}
                    onChange={(e) => updateTeamUpdate(index, 'blockers', e.target.value)}
                    placeholder="Blockers or challenges (optional)"
                    className="w-full p-2 border rounded-md min-h-16"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={loading || formData.teamUpdates.some(u => !u.memberName || !u.yesterday || !u.today)}
          className="w-full"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Generating Summary...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Generate Summary
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
          <h3 className="text-xl font-bold">Standup Summary</h3>

          {/* Summary */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold mb-2">Meeting Summary</h4>
            <p className="text-gray-700">{result.summary}</p>
          </div>

          {/* Team Morale */}
          <div className="bg-gradient-to-r from-green-50 to-blue-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Team Morale Score</p>
                <p className="text-4xl font-bold text-green-900">{result.teamMorale.score}/100</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-sm text-gray-700 mt-3">{result.teamMorale.assessment}</p>
          </div>

          {/* Key Achievements */}
          <div>
            <h4 className="font-semibold mb-3">Key Achievements</h4>
            <div className="grid gap-2">
              {result.keyAchievements.map((achievement, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-gray-700">✓ {achievement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Blockers */}
          {result.blockers.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Blockers & Suggestions
              </h4>
              <div className="space-y-3">
                {result.blockers.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      item.severity === 'high'
                        ? 'bg-red-50 border-red-200'
                        : item.severity === 'medium'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm">{item.blocker}</p>
                      <Badge variant={item.severity === 'high' ? 'destructive' : 'secondary'}>
                        {item.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Suggestion:</span> {item.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          <div>
            <h4 className="font-semibold mb-3">Action Items</h4>
            <ul className="space-y-2">
              {result.actionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold mt-0.5">{index + 1}.</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
