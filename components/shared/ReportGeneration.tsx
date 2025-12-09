'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { FileText, Download } from 'lucide-react';

interface FormData {
  reportType: string;
  projectName: string;
  timeframe: string;
  metrics: string;
  teamMembers: string;
  additionalContext: string;
}

interface ReportResult {
  title: string;
  summary: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  keyMetrics: Array<{
    name: string;
    value: string;
  }>;
  recommendations: string[];
}

export function ReportGeneration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    reportType: 'project-status',
    projectName: '',
    timeframe: '',
    metrics: '',
    teamMembers: '',
    additionalContext: ''
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/shared/report-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    let reportText = `${result.title}\n${'='.repeat(result.title.length)}\n\n`;
    reportText += `${result.summary}\n\n`;
    
    reportText += `Key Metrics:\n`;
    result.keyMetrics.forEach(metric => {
      reportText += `- ${metric.name}: ${metric.value}\n`;
    });
    reportText += `\n`;

    result.sections.forEach(section => {
      reportText += `${section.heading}\n${'-'.repeat(section.heading.length)}\n`;
      reportText += `${section.content}\n\n`;
    });

    reportText += `Recommendations:\n`;
    result.recommendations.forEach((rec, index) => {
      reportText += `${index + 1}. ${rec}\n`;
    });

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Smart Report Generator</h2>
        <p className="text-gray-600 mb-6">
          Generate comprehensive project reports with AI-powered insights
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="reportType">Report Type</Label>
          <select
            id="reportType"
            value={formData.reportType}
            onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="project-status">Project Status Report</option>
            <option value="team-performance">Team Performance Report</option>
            <option value="sprint-summary">Sprint Summary</option>
            <option value="monthly-review">Monthly Review</option>
          </select>
        </div>

        <div>
          <Label htmlFor="projectName">Project/Team Name</Label>
          <Input
            id="projectName"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="Enter project or team name"
          />
        </div>

        <div>
          <Label htmlFor="timeframe">Timeframe</Label>
          <Input
            id="timeframe"
            value={formData.timeframe}
            onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
            placeholder="e.g., Q4 2024, Sprint 23, November 2024"
          />
        </div>

        <div>
          <Label htmlFor="metrics">Key Metrics</Label>
          <textarea
            id="metrics"
            value={formData.metrics}
            onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
            placeholder="e.g., 45 tasks completed, 90% on-time delivery, 3 bugs resolved"
            className="w-full p-2 border rounded-md min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="teamMembers">Team Members & Contributions</Label>
          <textarea
            id="teamMembers"
            value={formData.teamMembers}
            onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
            placeholder="e.g., John: 12 features, Sarah: 8 bugs fixed, Mike: Code reviews"
            className="w-full p-2 border rounded-md min-h-20"
          />
        </div>

        <div>
          <Label htmlFor="additionalContext">Additional Context</Label>
          <textarea
            id="additionalContext"
            value={formData.additionalContext}
            onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
            placeholder="Any challenges, blockers, achievements, or noteworthy events"
            className="w-full p-2 border rounded-md min-h-20"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !formData.projectName || !formData.timeframe}
          className="w-full"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Generating Report...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
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
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Generated Report</h3>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          {/* Report Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-3">{result.title}</h2>
            <p className="text-gray-700">{result.summary}</p>
          </div>

          {/* Key Metrics */}
          <div>
            <h4 className="font-semibold mb-3">Key Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {result.keyMetrics.map((metric, index) => (
                <div key={index} className="p-4 bg-white border rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
                  <p className="text-2xl font-bold text-blue-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Report Sections */}
          {result.sections.map((section, index) => (
            <div key={index} className="p-5 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-lg">{section.heading}</h4>
              <div className="text-gray-700 whitespace-pre-line">{section.content}</div>
            </div>
          ))}

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold mt-0.5">{index + 1}.</span>
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
