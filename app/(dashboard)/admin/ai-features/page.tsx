'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Shield, FileText, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import { AITaskAssistant } from '@/components/admin/AITaskAssistant';
import { AIRiskAssessment } from '@/components/admin/AIRiskAssessment';
import { AIPerformanceReview } from '@/components/admin/AIPerformanceReview';
import { AIMeetingSummary } from '@/components/admin/AIMeetingSummary';
import { AISprintPlanning } from '@/components/admin/AISprintPlanning';

type AIFeature = 'task-assistant' | 'risk-assessment' | 'performance-review' | 'meeting-summary' | 'sprint-planning' | null;

export default function AIFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<AIFeature>(null);

  const features = [
    {
      id: 'task-assistant' as const,
      title: 'AI Task Assistant',
      description: 'Break down tasks, estimate timelines, and generate test cases',
      icon: Bot,
      color: 'purple',
    },
    {
      id: 'risk-assessment' as const,
      title: 'Smart Risk Assessment',
      description: 'Identify bottlenecks and get resource allocation suggestions',
      icon: Shield,
      color: 'blue',
    },
    {
      id: 'performance-review' as const,
      title: 'Performance Review Assistant',
      description: 'Generate comprehensive performance reviews for team members',
      icon: FileText,
      color: 'indigo',
    },
    {
      id: 'meeting-summary' as const,
      title: 'Meeting Summary Generator',
      description: 'Transform meeting transcripts into actionable summaries',
      icon: MessageSquare,
      color: 'teal',
    },
    {
      id: 'sprint-planning' as const,
      title: 'Smart Sprint Planning',
      description: 'AI-powered sprint planning with capacity analysis',
      icon: Calendar,
      color: 'purple',
    },
  ];

  const renderFeature = () => {
    switch (activeFeature) {
      case 'task-assistant':
        return <AITaskAssistant />;
      case 'risk-assessment':
        return <AIRiskAssessment />;
      case 'performance-review':
        return <AIPerformanceReview />;
      case 'meeting-summary':
        return <AIMeetingSummary />;
      case 'sprint-planning':
        return <AISprintPlanning />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">AI-Powered Features</h1>
        </div>
        <p className="text-gray-600">
          Leverage artificial intelligence to enhance project management efficiency
        </p>
      </div>

      {!activeFeature ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300"
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-4 rounded-full bg-${feature.color}-100 mb-4`}>
                    <Icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                  <Button className="mt-4 w-full" variant="outline">
                    Open Feature
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div>
          <Button
            onClick={() => setActiveFeature(null)}
            variant="outline"
            className="mb-4"
          >
            ← Back to Features
          </Button>
          <Card className="p-6">
            {renderFeature()}
          </Card>
        </div>
      )}
    </div>
  );
}
