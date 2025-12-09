'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, Users, Plus, Trash2, Calendar } from 'lucide-react';

interface Project {
  name: string;
  priority: string;
  deadline: string;
  requiredSkills: string;
}

interface TeamMember {
  name: string;
  skills: string;
  currentLoad: string;
  availability: string;
}

interface FormData {
  projects: Project[];
  teamMembers: TeamMember[];
  planningPeriod: string;
}

interface ResourceOptimizationResult {
  allocation: Array<{
    project: string;
    assignedMembers: string[];
    capacityUtilization: number;
  }>;
  conflicts: Array<{
    type: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  hiringRecommendations: string[];
  efficiencyScore: number;
}

export function ResourceOptimization() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResourceOptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    projects: [{ name: '', priority: '', deadline: '', requiredSkills: '' }],
    teamMembers: [{ name: '', skills: '', currentLoad: '', availability: '' }],
    planningPeriod: '30'
  });

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', priority: '', deadline: '', requiredSkills: '' }]
    });
  };

  const removeProject = (index: number) => {
    const newProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: newProjects });
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData({ ...formData, projects: newProjects });
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: '', skills: '', currentLoad: '', availability: '' }]
    });
  };

  const removeTeamMember = (index: number) => {
    const newMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, teamMembers: newMembers });
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...formData.teamMembers];
    newMembers[index][field] = value;
    setFormData({ ...formData, teamMembers: newMembers });
  };

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/manager/resource-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to optimize resources');
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
        <h2 className="text-2xl font-bold mb-4">Resource Optimization</h2>
        <p className="text-gray-600 mb-6">
          Optimize team allocation, identify conflicts, and get hiring recommendations
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Planning Period */}
        <div>
          <Label htmlFor="planningPeriod">Planning Period (days)</Label>
          <Input
            id="planningPeriod"
            type="number"
            value={formData.planningPeriod}
            onChange={(e) => setFormData({ ...formData, planningPeriod: e.target.value })}
            placeholder="e.g., 30"
          />
        </div>

        {/* Projects Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-lg">Projects</Label>
            <Button onClick={addProject} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          {formData.projects.map((project, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Project {index + 1}</span>
                {formData.projects.length > 1 && (
                  <Button
                    onClick={() => removeProject(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                    placeholder="Project name"
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Input
                    value={project.priority}
                    onChange={(e) => updateProject(index, 'priority', e.target.value)}
                    placeholder="e.g., High, Medium, Low"
                  />
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input
                    value={project.deadline}
                    onChange={(e) => updateProject(index, 'deadline', e.target.value)}
                    placeholder="e.g., 2024-12-31"
                  />
                </div>
                <div>
                  <Label>Required Skills</Label>
                  <Input
                    value={project.requiredSkills}
                    onChange={(e) => updateProject(index, 'requiredSkills', e.target.value)}
                    placeholder="e.g., React, Node.js"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Members Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-lg">Team Members</Label>
            <Button onClick={addTeamMember} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          {formData.teamMembers.map((member, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Member {index + 1}</span>
                {formData.teamMembers.length > 1 && (
                  <Button
                    onClick={() => removeTeamMember(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                    placeholder="Member name"
                  />
                </div>
                <div>
                  <Label>Skills</Label>
                  <Input
                    value={member.skills}
                    onChange={(e) => updateTeamMember(index, 'skills', e.target.value)}
                    placeholder="e.g., React, Node.js"
                  />
                </div>
                <div>
                  <Label>Current Load (%)</Label>
                  <Input
                    type="number"
                    value={member.currentLoad}
                    onChange={(e) => updateTeamMember(index, 'currentLoad', e.target.value)}
                    placeholder="e.g., 80"
                  />
                </div>
                <div>
                  <Label>Availability (%)</Label>
                  <Input
                    type="number"
                    value={member.availability}
                    onChange={(e) => updateTeamMember(index, 'availability', e.target.value)}
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleOptimize}
          disabled={loading || formData.projects.some(p => !p.name) || formData.teamMembers.some(m => !m.name)}
          className="w-full"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Optimizing...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Optimize Resource Allocation
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
          <h3 className="text-xl font-bold">Optimization Results</h3>

          {/* Efficiency Score */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resource Efficiency Score</p>
                <p className="text-4xl font-bold text-green-900">{result.efficiencyScore}/100</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Resource Allocation */}
          <div>
            <h4 className="font-semibold mb-3">Recommended Allocation</h4>
            <div className="space-y-3">
              {result.allocation.map((alloc, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{alloc.project}</p>
                    <Badge variant={alloc.capacityUtilization <= 80 ? 'default' : 'destructive'}>
                      {alloc.capacityUtilization}% Capacity
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{alloc.assignedMembers.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conflicts */}
          {result.conflicts.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Resource Conflicts
              </h4>
              <div className="space-y-2">
                {result.conflicts.map((conflict, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      conflict.severity === 'high'
                        ? 'bg-red-50 border-red-200'
                        : conflict.severity === 'medium'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{conflict.type}</p>
                        <p className="text-sm text-gray-600 mt-1">{conflict.description}</p>
                      </div>
                      <Badge
                        variant={conflict.severity === 'high' ? 'destructive' : 'secondary'}
                      >
                        {conflict.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hiring Recommendations */}
          {result.hiringRecommendations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Hiring Recommendations</h4>
              <ul className="space-y-2">
                {result.hiringRecommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                    <span className="text-sm text-gray-700">{rec}</span>
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
