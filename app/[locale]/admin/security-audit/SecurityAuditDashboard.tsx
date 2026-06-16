'use client';

import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Shield,
  Code2,
  Database,
  Lock,
  GitBranch,
  Download,
  Search,
  Filter,
  ExternalLink,
} from 'lucide-react';
import AuditFindings from './AuditFindings';
import AuditStats from './AuditStats';

const AUDIT_DATA = {
  summary: 'Çok-ajanlı PPG sistem denetimi: 180 admin bölümü + API + lib, 4 boyutta hata avı',
  agentCount: 111,
  timestamp: '2026-06-16T00:00:00Z',
  counts: {
    critical: 1,
    high: 28,
    medium: 85,
    low: 31,
  },
  totalConfirmed: 145,
  totalRaw: 189,
};

type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';
type DimensionFilter = 'all' | 'security' | 'data-connection' | 'logic-kurgu' | 'code-build';

export default function SecurityAuditDashboard() {
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityFilter>('all');
  const [selectedDimension, setSelectedDimension] = useState<DimensionFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'severity' | 'date'>('severity');

  const severityColors = {
    critical: { bg: 'bg-red-50', text: 'text-red-900', badge: 'bg-red-100 text-red-800', border: 'border-red-200' },
    high: { bg: 'bg-orange-50', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-800', border: 'border-orange-200' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800', border: 'border-amber-200' },
    low: { bg: 'bg-green-50', text: 'text-green-900', badge: 'bg-green-100 text-green-800', border: 'border-green-200' },
  };

  const dimensionIcons = {
    security: <Lock className="w-4 h-4" />,
    'data-connection': <Database className="w-4 h-4" />,
    'logic-kurgu': <Code2 className="w-4 h-4" />,
    'code-build': <AlertTriangle className="w-4 h-4" />,
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(AUDIT_DATA, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ppg-security-audit-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleExportCSV = () => {
    const headers = ['Severity', 'Dimension', 'Title', 'File', 'Line', 'Cluster', 'Status'];
    const csv = [
      headers.join(','),
      `Critical,Security,Hosting API RCE,"app/api/admin/hosting/files/route.ts","4-44","hosting-mgr","CONFIRMED"`,
      `High,Security,PMS Resync Auth Bypass,"app/api/admin/pms/resync/route.ts","25-29","pms-core","CONFIRMED"`,
      // ... daha fazla satır
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ppg-security-audit-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-indigo-600" />
                PPG Security Audit Report
              </h1>
              <p className="text-lg text-gray-600">{AUDIT_DATA.summary}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <a
                href="https://github.com/sserdarb/antigravity/issues?labels=security-audit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
              >
                <GitBranch className="w-4 h-4" />
                Track on GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Audit Agents</p>
              <p className="text-2xl font-bold text-gray-900">{AUDIT_DATA.agentCount}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Findings Reviewed</p>
              <p className="text-2xl font-bold text-gray-900">{AUDIT_DATA.totalRaw}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{AUDIT_DATA.totalConfirmed}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Confirmation Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((AUDIT_DATA.totalConfirmed / AUDIT_DATA.totalRaw) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <AuditStats counts={AUDIT_DATA.counts} severityColors={severityColors} />

        {/* Filters & Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Search Findings
              </label>
              <input
                type="text"
                placeholder="Search by title, file, or cluster..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Severity
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as SeverityFilter)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            {/* Dimension Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Category
              </label>
              <select
                value={selectedDimension}
                onChange={(e) => setSelectedDimension(e.target.value as DimensionFilter)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="security">🔒 Security</option>
                <option value="data-connection">📊 Data Integrity</option>
                <option value="logic-kurgu">⚙️ Logic Error</option>
                <option value="code-build">🛠️ Code Quality</option>
              </select>
            </div>
          </div>
        </div>

        {/* Findings List */}
        <AuditFindings
          searchTerm={searchTerm}
          selectedSeverity={selectedSeverity}
          selectedDimension={selectedDimension}
          severityColors={severityColors}
          dimensionIcons={dimensionIcons}
        />

        {/* GitHub Integration Section */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 text-white">
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
              GitHub Tracking
            </h3>
            <p className="text-gray-300 mb-4">
              All findings are tracked as GitHub issues with priority labels. Each issue includes:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 text-gray-300">
              <li>✓ Detailed evidence and reproduction steps</li>
              <li>✓ Severity classification (Critical/High/Medium/Low)</li>
              <li>✓ Actionable fix recommendations</li>
              <li>✓ Affected cluster and file references</li>
              <li>✓ Impact assessment and urgency</li>
              <li>✓ Related issue cross-linking</li>
            </ul>
            <a
              href="https://github.com/sserdarb/antigravity/projects?query=security-audit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <GitBranch className="w-5 h-5" />
              View Project Board on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Report generated: {new Date(AUDIT_DATA.timestamp).toLocaleString()}
          </p>
          <p className="mt-2">
            For questions or to report issues, visit{' '}
            <a
              href="https://github.com/sserdarb/antigravity/issues/new?labels=security-audit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              GitHub Issues
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
