"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface AnalyticsData {
  summary: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalProjects: number;
    completedProjects: number;
    ongoingProjects: number;
    totalAppraisals: number;
    averageRating: number;
  };
  usersByRole: Array<{ role: string; count: number }>;
  projectsByStatus: Array<{ status: string; count: number }>;
  ptoStats: Array<{ status: string; count: number }>;
  timesheetStats: Array<{ status: string; count: number; totalHours: number }>;
}

// Premium Animated Counter Component
function AnimatedCounter({
  value,
  duration = 1200,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(value * easeOut));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

// Animated Progress Bar with Premium Effects
function AnimatedProgressBar({
  percentage,
  color = "bg-blue-600",
}: {
  percentage: number;
  color?: string;
}) {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercentage(percentage);
    }, 150);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
      <div
        className={`${color} h-3 rounded-full transition-all duration-1200 ease-out shadow-lg`}
        style={{
          width: `${displayPercentage}%`,
          boxShadow: `0 0 10px ${
            color === "bg-blue-600"
              ? "rgba(59, 130, 246, 0.5)"
              : "rgba(34, 197, 94, 0.5)"
          }`,
        }}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  const engagementPercentage =
    analytics.summary.totalUsers > 0
      ? Math.round(
          (analytics.summary.activeUsers / analytics.summary.totalUsers) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Premium Animation */}
        <div
          className="mb-12 animate-slide-in-down"
          style={{ animationDelay: "0s" }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="text-5xl animate-bounce"
              style={{ animationDelay: "0s" }}
            >
              📊
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-gray-300 text-lg font-light ml-20">
            Real-time organization performance metrics
          </p>
        </div>

        {/* Summary Cards with Premium Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Users Card */}
          <div
            className="group animate-slide-in-up hover-lift"
            style={{ animationDelay: "0.1s" }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 border-0 text-white shadow-2xl hover-glow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="text-5xl animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  👥
                </div>
                <div className="text-xs font-bold bg-blue-500 bg-opacity-50 px-3 py-1 rounded-full">
                  Users
                </div>
              </div>
              <p className="text-blue-100 text-sm font-semibold mb-2">
                Total Users
              </p>
              <p className="text-4xl font-black">
                <AnimatedCounter
                  value={analytics.summary.totalUsers}
                  duration={1200}
                />
              </p>
              <p className="text-xs text-blue-200 mt-2">
                Active: {analytics.summary.activeUsers}
              </p>
            </Card>
          </div>

          {/* Projects Card */}
          <div
            className="group animate-slide-in-up hover-lift"
            style={{ animationDelay: "0.2s" }}
          >
            <Card className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 border-0 text-white shadow-2xl hover-glow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="text-5xl animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                >
                  📁
                </div>
                <div className="text-xs font-bold bg-emerald-500 bg-opacity-50 px-3 py-1 rounded-full">
                  Projects
                </div>
              </div>
              <p className="text-emerald-100 text-sm font-semibold mb-2">
                Total Projects
              </p>
              <p className="text-4xl font-black">
                <AnimatedCounter
                  value={analytics.summary.totalProjects}
                  duration={1200}
                />
              </p>
              <p className="text-xs text-emerald-200 mt-2">
                Completed: {analytics.summary.completedProjects}
              </p>
            </Card>
          </div>

          {/* Appraisals Card */}
          <div
            className="group animate-slide-in-up hover-lift"
            style={{ animationDelay: "0.3s" }}
          >
            <Card className="p-6 bg-gradient-to-br from-amber-600 to-amber-800 border-0 text-white shadow-2xl hover-glow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="text-5xl animate-bounce"
                  style={{ animationDelay: "0.6s" }}
                >
                  ⭐
                </div>
                <div className="text-xs font-bold bg-amber-500 bg-opacity-50 px-3 py-1 rounded-full">
                  Reviews
                </div>
              </div>
              <p className="text-amber-100 text-sm font-semibold mb-2">
                Appraisals
              </p>
              <p className="text-4xl font-black">
                <AnimatedCounter
                  value={analytics.summary.totalAppraisals}
                  duration={1200}
                />
              </p>
              <p className="text-xs text-amber-200 mt-2">
                Avg Rating: {analytics.summary.averageRating.toFixed(1)}
              </p>
            </Card>
          </div>

          {/* Engagement Card */}
          <div
            className="group animate-slide-in-up hover-lift"
            style={{ animationDelay: "0.4s" }}
          >
            <Card className="p-6 bg-gradient-to-br from-pink-600 to-pink-800 border-0 text-white shadow-2xl hover-glow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="text-5xl animate-bounce"
                  style={{ animationDelay: "0.8s" }}
                >
                  📈
                </div>
                <div className="text-xs font-bold bg-pink-500 bg-opacity-50 px-3 py-1 rounded-full">
                  Metric
                </div>
              </div>
              <p className="text-pink-100 text-sm font-semibold mb-2">
                Engagement
              </p>
              <p className="text-4xl font-black">
                <AnimatedCounter
                  value={Math.round(
                    (analytics.summary.activeUsers /
                      analytics.summary.totalUsers) *
                      100
                  )}
                  duration={1200}
                />
                %
              </p>
              <p className="text-xs text-pink-200 mt-2">Active participation</p>
            </Card>
          </div>
        </div>

        {/* Users by Role & Projects by Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Users by Role */}
          <div
            className="group animate-slide-in-left"
            style={{ animationDelay: "0.5s" }}
          >
            <Card className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border-0 text-white shadow-2xl hover-glow h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl animate-float">👤</span>
                <h3 className="text-2xl font-bold">Users by Role</h3>
              </div>
              <div className="space-y-6">
                {analytics.usersByRole.map((item, idx) => (
                  <div
                    key={item.role}
                    className="group/item animate-fade-in"
                    style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                        {item.role}
                      </span>
                      <span className="text-sm font-black text-blue-400">
                        {item.count} users
                      </span>
                    </div>
                    <AnimatedProgressBar
                      percentage={
                        analytics.summary.totalUsers > 0
                          ? (item.count / analytics.summary.totalUsers) * 100
                          : 0
                      }
                      color="bg-blue-600"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Projects by Status */}
          <div
            className="group animate-slide-in-right"
            style={{ animationDelay: "0.5s" }}
          >
            <Card className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border-0 text-white shadow-2xl hover-glow h-full">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="text-4xl animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  📊
                </span>
                <h3 className="text-2xl font-bold">Projects by Status</h3>
              </div>
              <div className="space-y-6">
                {analytics.projectsByStatus.map((item, idx) => (
                  <div
                    key={item.status}
                    className="group/item animate-fade-in"
                    style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                        {item.status}
                      </span>
                      <span className="text-sm font-black text-emerald-400">
                        {item.count} projects
                      </span>
                    </div>
                    <AnimatedProgressBar
                      percentage={
                        analytics.summary.totalProjects > 0
                          ? (item.count / analytics.summary.totalProjects) * 100
                          : 0
                      }
                      color="bg-emerald-600"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* PTO Statistics */}
        <div
          className="mb-12 animate-slide-in-up"
          style={{ animationDelay: "0.9s" }}
        >
          <Card className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border-0 text-white shadow-2xl hover-glow">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="text-4xl animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                🏖️
              </span>
              <h3 className="text-2xl font-bold">PTO Requests</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics.ptoStats.map((item, idx) => (
                <div
                  key={item.status}
                  className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-scale-in cursor-pointer group/pto"
                  style={{ animationDelay: `${1.0 + idx * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-3xl animate-bounce"
                      style={{ animationDelay: `${1.2 + idx * 0.1}s` }}
                    >
                      ✈️
                    </span>
                    <span className="text-xs font-bold bg-blue-600 px-2 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-4xl font-black mb-1">
                    <AnimatedCounter value={item.count} duration={1200} />
                  </p>
                  <p className="text-xs text-blue-100 font-semibold">
                    requests
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Timesheet Statistics */}
        <div className="animate-slide-in-up" style={{ animationDelay: "1.2s" }}>
          <Card className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border-0 text-white shadow-2xl hover-glow">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="text-4xl animate-float"
                style={{ animationDelay: "2s" }}
              >
                ⏱️
              </span>
              <h3 className="text-2xl font-bold">Timesheet Status</h3>
            </div>
            <div className="space-y-4">
              {analytics.timesheetStats.map((item, idx) => (
                <div
                  key={item.status}
                  className="p-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-between transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:shadow-lg hover:translate-x-2 animate-fade-in group/ts cursor-pointer"
                  style={{ animationDelay: `${1.3 + idx * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-2xl animate-bounce"
                      style={{ animationDelay: `${1.4 + idx * 0.1}s` }}
                    >
                      📋
                    </span>
                    <div>
                      <p className="font-bold text-gray-100">{item.status}</p>
                      <p className="text-sm text-gray-400 font-semibold">
                        <span className="text-emerald-400 font-black">
                          <AnimatedCounter value={item.count} duration={1200} />
                        </span>{" "}
                        submitted
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Hours</p>
                    <p className="text-2xl font-black text-purple-400">
                      {item.totalHours}h
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
