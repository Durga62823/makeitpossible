'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListTodo, MessageSquare, BarChart, FileText, Sparkles } from 'lucide-react';
import { TaskPrioritization } from '@/components/lead/TaskPrioritization';
import { StandupSummary } from '@/components/lead/StandupSummary';
import { SprintRetrospective } from '@/components/lead/SprintRetrospective';
import { ReportGeneration } from '@/components/shared/ReportGeneration';

type AIFeature = 'task-prioritization' | 'standup-summary' | 'retrospective' | 'report-generation' | null;

export default function LeadAIFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<AIFeature>(null);

  const features = [
    {
      id: 'task-prioritization' as const,
      title: 'Smart Task Prioritization',
      description: 'Auto-prioritize backlog, suggest assignments, and identify dependencies',
      icon: ListTodo,
      color: 'purple',
    },
    {
      id: 'standup-summary' as const,
      title: 'Daily Standup Summary',
      description: 'Analyze team updates, identify blockers, and generate action items',
      icon: MessageSquare,
      color: 'teal',
    },
    {
      id: 'retrospective' as const,
      title: 'Sprint Retrospective Assistant',
      description: 'Analyze sprint metrics and generate improvement suggestions',
      icon: BarChart,
      color: 'indigo',
    },
    {
      id: 'report-generation' as const,
      title: 'Smart Report Generator',
      description: 'Generate comprehensive project reports with insights',
      icon: FileText,
      color: 'orange',
    },
  ];

  const renderFeature = () => {
    switch (activeFeature) {
      case 'task-prioritization':
        return <TaskPrioritization />;
      case 'standup-summary':
        return <StandupSummary />;
      case 'retrospective':
        return <SprintRetrospective />;
      case 'report-generation':
        return <ReportGeneration />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Lead AI Features</h1>
        </div>
        <p className="text-gray-600">
          AI-powered tools to enhance team leadership and sprint management
        </p>
      </div>

      {!activeFeature ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300"
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className="flex flex-col">
                  <div className={`p-4 rounded-full bg-${feature.color}-100 w-fit mb-4`}>
                    <Icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  <Button className="w-full" variant="outline">
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
