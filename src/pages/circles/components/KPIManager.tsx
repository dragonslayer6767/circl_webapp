import { useState } from 'react';
import { COLORS } from '../../../utils/colors';
import CreateKPIModal, { KPIFormData } from './CreateKPIModal';

interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  percentageChange: number;
}

interface KPIManagerProps {
  circleId: number;
  isModerator: boolean;
}

export default function KPIManager({ circleId: _circleId, isModerator }: KPIManagerProps) {
  const [kpis, setKpis] = useState<KPI[]>([
    {
      id: 'kpi-1',
      name: 'Monthly Revenue',
      value: 12500,
      target: 15000,
      unit: '$',
      trend: 'up',
      percentageChange: 8.5
    },
    {
      id: 'kpi-2',
      name: 'New Members',
      value: 24,
      target: 30,
      unit: '',
      trend: 'up',
      percentageChange: 12.3
    },
    {
      id: 'kpi-3',
      name: 'Event Attendance',
      value: 85,
      target: 90,
      unit: '%',
      trend: 'down',
      percentageChange: -3.2
    },
    {
      id: 'kpi-4',
      name: 'Tasks Completed',
      value: 42,
      target: 50,
      unit: '',
      trend: 'up',
      percentageChange: 15.7
    }
  ]);

  // Track view mode for each KPI (standard or chart)
  const [kpiViewModes, setKpiViewModes] = useState<Record<string, 'standard' | 'chart'>>(
    kpis.reduce((acc, kpi) => ({ ...acc, [kpi.id]: 'standard' }), {})
  );

  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleKpiView = (kpiId: string) => {
    setKpiViewModes(prev => ({
      ...prev,
      [kpiId]: prev[kpiId] === 'standard' ? 'chart' : 'standard'
    }));
  };

  const handleCreateKPI = (kpiData: KPIFormData) => {
    const newKPI: KPI = {
      id: `kpi-${Date.now()}`,
      ...kpiData,
      trend: 'neutral',
      percentageChange: 0
    };
    setKpis(prev => [...prev, newKPI]);
    setKpiViewModes(prev => ({ ...prev, [newKPI.id]: 'standard' }));
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  const getProgressPercentage = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  const renderCircularChart = (kpi: KPI) => {
    const progressPercentage = getProgressPercentage(kpi.value, kpi.target);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
    const strokeColor = progressPercentage >= 100 ? '#10B981' : COLORS.primary;

    return (
      <div className="flex items-center justify-center h-full py-4">
        <div className="relative">
          <svg className="transform -rotate-90" width="120" height="120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="10"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={strokeColor}
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {progressPercentage.toFixed(0)}%
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {kpi.unit === '$' ? kpi.unit : ''}{kpi.value.toLocaleString()}{kpi.unit !== '$' ? kpi.unit : ''}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Key Performance Indicators</h3>
        {isModerator && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: COLORS.primary }}
            title="Add KPI"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpis.map((kpi) => {
          const progressPercentage = getProgressPercentage(kpi.value, kpi.target);
          const isChartView = kpiViewModes[kpi.id] === 'chart';
          
          return (
            <div key={kpi.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-900">{kpi.name}</h4>
                <div className="flex items-center gap-2">
                  {/* View Toggle Button */}
                  <button
                    onClick={() => toggleKpiView(kpi.id)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 underline transition-colors"
                    title={isChartView ? 'Switch to standard view' : 'Switch to chart view'}
                  >
                    {isChartView ? 'Show Standard' : 'Show Chart'}
                  </button>
                  {!isChartView && (
                    <div className="flex items-center gap-1">
                      {getTrendIcon(kpi.trend)}
                      <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {kpi.percentageChange > 0 ? '+' : ''}{kpi.percentageChange}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isChartView ? (
                renderCircularChart(kpi)
              ) : (
                <>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {kpi.unit === '$' ? kpi.unit : ''}{kpi.value.toLocaleString()}{kpi.unit !== '$' ? kpi.unit : ''}
                    </span>
                    <span className="text-xs text-gray-500">/ {kpi.unit === '$' ? kpi.unit : ''}{kpi.target.toLocaleString()}{kpi.unit !== '$' ? kpi.unit : ''}</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${progressPercentage}%`,
                          backgroundColor: progressPercentage >= 100 ? '#10B981' : COLORS.primary
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <CreateKPIModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateKPI}
      />
    </div>
  );
}
