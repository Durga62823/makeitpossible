'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
import { TeamPerformanceAnalytics } from '@/components/manager/TeamPerformanceAnalytics';
import { ResourceOptimization } from '@/components/manager/ResourceOptimization';
import { ApprovalAssistant } from '@/components/manager/ApprovalAssistant';
import { ReportGeneration } from '@/components/shared/ReportGeneration';

type AIFeature = 'team-performance' | 'resource-optimization' | 'approval-assistant' | 'report-generation' | null;

export default function ManagerAIFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<AIFeature>(null);

  const features = [
    {
      id: 'team-performance' as const,
      title: 'Team Performance Analytics',
      description: 'Analyze team productivity, identify trends, and detect burnout risks',
      icon: Users,
      color: 'blue',
    },
    {
      id: 'resource-optimization' as const,
      title: 'Resource Optimization',
      description: 'Optimize team allocation, identify conflicts, and predict hiring needs',
      icon: TrendingUp,
      color: 'green',
    },
    {
      id: 'approval-assistant' as const,
      title: 'Approval Assistant',
      description: 'Get AI recommendations for timesheet and PTO approvals',
      icon: CheckCircle,
      color: 'purple',
    },
    {
      id: 'report-generation' as const,
      title: 'Smart Report Generator',
      description: 'Generate comprehensive project reports with insights',
      icon: Sparkles,
      color: 'orange',
    },
  ];

  const renderFeature = () => {
    switch (activeFeature) {
      case 'team-performance':
        return <TeamPerformanceAnalytics />;
      case 'resource-optimization':
        return <ResourceOptimization />;
      case 'approval-assistant':
        return <ApprovalAssistant />;
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
          <Sparkles className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Manager AI Features</h1>
        </div>
        <p className="text-gray-600">
          AI-powered tools to enhance team management and decision-making
        </p>
      </div>

      {!activeFeature ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
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
