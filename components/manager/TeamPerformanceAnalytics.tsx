'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function TeamPerformanceAnalytics() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    teamSize: '',
    period: '',
    members: [{ name: '', tasksCompleted: '', averageTaskTime: '', overtimeHours: '' }],
  });

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: '', tasksCompleted: '', averageTaskTime: '', overtimeHours: '' }],
    });
  };

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, members: newMembers });
  };

  const removeMember = (index: number) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const teamMembers = formData.members.map((m) => ({
        name: m.name,
        tasksCompleted: parseInt(m.tasksCompleted),
        averageTaskTime: parseFloat(m.averageTaskTime),
        overtimeHours: parseFloat(m.overtimeHours),
      }));

      const response = await fetch('/api/ai/manager/team-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamMembers,
          teamSize: parseInt(formData.teamSize),
          period: formData.period,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze team performance');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Team Performance Analytics</h2>
        <p className="text-gray-600">Analyze team productivity, identify trends, and detect burnout risks</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              type="number"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              placeholder="e.g., 5"
              required
            />
          </div>
          <div>
            <Label htmlFor="period">Analysis Period</Label>
            <Input
              id="period"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              placeholder="e.g., Last Month, Q4 2024"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <Label>Team Members Data</Label>
            <Button type="button" onClick={addMember} size="sm" variant="outline">
              + Add Member
            </Button>
          </div>

          {formData.members.map((member, index) => (
            <Card key={index} className="p-4 mb-3">
              <div className="grid grid-cols-5 gap-3">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Tasks Completed</Label>
                  <Input
                    type="number"
                    value={member.tasksCompleted}
                    onChange={(e) => updateMember(index, 'tasksCompleted', e.target.value)}
                    placeholder="15"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Avg Task Time (hrs)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={member.averageTaskTime}
                    onChange={(e) => updateMember(index, 'averageTaskTime', e.target.value)}
                    placeholder="4.5"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Overtime (hrs)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={member.overtimeHours}
                    onChange={(e) => updateMember(index, 'overtimeHours', e.target.value)}
                    placeholder="10"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={() => removeMember(index)}
                    size="sm"
                    variant="destructive"
                    disabled={formData.members.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Analyze Team Performance
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-xl font-bold mb-4">Performance Analysis Results</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-3xl font-bold text-blue-600">{result.overallScore}/100</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Productivity Trend</p>
                <div className="flex items-center gap-2 mt-1">
                  {result.trends.productivity === 'increasing' && <TrendingUp className="h-6 w-6 text-green-600" />}
                  {result.trends.productivity === 'decreasing' && <TrendingDown className="h-6 w-6 text-red-600" />}
                  {result.trends.productivity === 'stable' && <Minus className="h-6 w-6 text-gray-600" />}
                  <p className="text-xl font-semibold capitalize">{result.trends.productivity}</p>
                </div>
              </div>
            </div>

            {result.teamMembers && result.teamMembers.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Team Member Analysis</h4>
                <div className="space-y-3">
                  {result.teamMembers.map((member: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{member.name}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          member.performance === 'high' ? 'bg-green-100 text-green-800' :
                          member.performance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.performance.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-green-700 mb-1">Strengths:</p>
                          <ul className="list-disc list-inside text-gray-700">
                            {member.strengths.map((s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-orange-700 mb-1">Concerns:</p>
                          <ul className="list-disc list-inside text-gray-700">
                            {member.concerns.map((c: string, i: number) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {result.burnoutRisks && result.burnoutRisks.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-red-700">⚠️ Burnout Risk Alerts</h4>
                <div className="space-y-2">
                  {result.burnoutRisks.map((risk: any, index: number) => (
                    <Card key={index} className="p-4 border-red-200 bg-red-50">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{risk.member}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          risk.riskLevel === 'high' ? 'bg-red-600 text-white' :
                          risk.riskLevel === 'medium' ? 'bg-orange-500 text-white' :
                          'bg-yellow-500 text-white'
                        }`}>
                          {risk.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {risk.indicators.map((indicator: string, i: number) => (
                          <li key={i}>{indicator}</li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">💡 Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
