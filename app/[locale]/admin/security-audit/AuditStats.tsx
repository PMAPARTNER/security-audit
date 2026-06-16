'use client';

import { AlertTriangle, AlertCircle, AlertOctagon, CheckCircle } from 'lucide-react';

interface AuditStatsProps {
  counts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  severityColors: Record<string, any>;
}

export default function AuditStats({ counts, severityColors }: AuditStatsProps) {
  const stats = [
    {
      severity: 'critical' as const,
      label: 'Critical',
      count: counts.critical,
      icon: AlertOctagon,
      description: 'Immediate action required',
    },
    {
      severity: 'high' as const,
      label: 'High',
      count: counts.high,
      icon: AlertTriangle,
      description: 'High priority fixes',
    },
    {
      severity: 'medium' as const,
      label: 'Medium',
      count: counts.medium,
      icon: AlertCircle,
      description: 'Should be fixed soon',
    },
    {
      severity: 'low' as const,
      label: 'Low',
      count: counts.low,
      icon: CheckCircle,
      description: 'Nice to have improvements',
    },
  ];

  const total = counts.critical + counts.high + counts.medium + counts.low;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colors = severityColors[stat.severity];
        const percentage = ((stat.count / total) * 100).toFixed(1);

        return (
          <div
            key={stat.severity}
            className={`rounded-lg border-2 p-6 ${colors.border} ${colors.bg}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className={`text-sm font-medium ${colors.text}`}>{stat.label} Severity</p>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              </div>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-gray-900">{stat.count}</div>
              <div className="text-sm text-gray-600 mb-1">{percentage}%</div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  stat.severity === 'critical'
                    ? 'bg-red-500'
                    : stat.severity === 'high'
                    ? 'bg-orange-500'
                    : stat.severity === 'medium'
                    ? 'bg-amber-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
