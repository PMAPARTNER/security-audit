'use client';

import { useState } from 'react';
import { ChevronDown, Code2, Database, AlertTriangle, Lock } from 'lucide-react';

const SAMPLE_FINDINGS = [
  {
    id: 1,
    title: 'Tüm hosting API rotaları rol-gate\'siz: herhangi bir admin root SSH komutu çalıştırabiliyor (privilege escalation / RCE)',
    file: 'app/api/admin/hosting/files/route.ts',
    line: '4-44',
    severity: 'critical',
    dimension: 'security',
    cluster: 'hosting-mgr',
    evidence:
      'Bu rotaların hiçbiri requireSuperadmin/requireAuthenticatedAdmin çağrırmıyor. middleware.ts sadece admin_session cookie\'sinin VARLIĞINI kontrol eder, ROL kontrolü yapmaz.',
    fix: 'Her hosting/* route.ts\'in başına `const g = await requireSuperadmin()` ekle.',
    status: 'Confirmed',
  },
  {
    id: 2,
    title: 'resync endpoint auth bypass: force=blue herkese açık ağır full PMS resync (DoS / CPU peg)',
    file: 'app/api/admin/pms/resync/route.ts',
    line: '25-29',
    severity: 'high',
    dimension: 'security',
    cluster: 'pms-core',
    evidence:
      'isForced = secret===\'blue\' || body.force===\'blue\' ile auth tamamen atlanıyor; kimliksiz POST tüm aktif Sedna+Veboni otelleri için full refresh tetikler.',
    fix: 'force=blue kısa-yolunu kaldır; sadece CRON_SECRET eşleşmesi kabul et.',
    status: 'Confirmed',
  },
  {
    id: 3,
    title: 'Hardcoded ENCRYPTION_KEY fallback encrypts all stored API credentials with a public default',
    file: 'lib/utils/encryption.ts',
    line: '5',
    severity: 'critical',
    dimension: 'security',
    cluster: 'ai-agents',
    evidence:
      'const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || \'default-secret-key-must-be-32-chars!\'. Env var unset olursa tüm credentials bilinen constant ile şifrelenir.',
    fix: 'Throw at startup if ENCRYPTION_KEY unset/short. Don\'t use literal default. Make encrypt() throw on failure instead of returning plaintext.',
    status: 'Confirmed',
  },
  {
    id: 4,
    title: 'RMS Hub fetches 60-day reservations but divides occupancy/RevPAR by 30 days → ~2x inflation',
    file: 'app/api/admin/rms/hub/route.ts',
    line: '79-99, 139-140',
    severity: 'high',
    dimension: 'data-connection',
    cluster: 'revenue-rms',
    evidence:
      'in60 = today+60; r1 çağrısı 60 gün çeker ama occ = nights/(totalRooms*30) 30 gün denominator kullanır. ~2x inflation sonucu.',
    fix: 'Fetch reservations for today→in30 (matching denominator) OR change denominator to totalRooms*60.',
    status: 'Confirmed',
  },
  {
    id: 5,
    title: 'Group Comparison fabricates KPIs from invented multipliers (bed nights=2.3x, ARB=0.52x, EBITDA=-30.5%)',
    file: 'app/[locale]/admin/group-comparison/GroupComparisonClient.tsx',
    line: '303,306,308',
    severity: 'high',
    dimension: 'data-connection',
    cluster: 'analytics',
    evidence:
      'bedNights = Math.round(roomNights * 2.3); arb = Math.round(adr * 0.52); ebitda = rev * -0.305. Bunlar "estimated" olmak yerine real data gibi gösteriliyor.',
    fix: 'Render "—" when real KPI missing. Never synthesize EBITDA; show actual data or empty.',
    status: 'Confirmed',
  },
  {
    id: 6,
    title: 'Order-taker module trusts client hotelId — cross-tenant IDOR (read/write/delete)',
    file: 'app/api/admin/order-taker/orders/route.ts',
    line: '14-19, 41-48',
    severity: 'high',
    dimension: 'security',
    cluster: 'ops-frontdesk',
    evidence:
      'GET/POST only call requireAuthenticatedAdmin() then pass raw hotelId query/body param straight into listOrders/createOrder. No requireHotelAccessById check.',
    fix: 'After requireAuthenticatedAdmin, call `const g = await requireHotelAccessById(hotelId)` and use g.hotelId.',
    status: 'Confirmed',
  },
  {
    id: 7,
    title: 'Order-taker storage is read-modify-write on single JSON blob — lost-update race condition',
    file: 'lib/services/order-taker.ts',
    line: '151-167, 245-295',
    severity: 'high',
    dimension: 'logic-kurgu',
    cluster: 'ops-frontdesk',
    evidence:
      'loadBag() → mutate → saveBag() without locking. Concurrent calls overwrite each other (last-write-wins), silently dropping orders.',
    fix: 'Move orders to real table OR add version field to SiteSetting + compare-and-set.',
    status: 'Confirmed',
  },
  {
    id: 8,
    title: 'CRM müşteri PUT/DELETE tamamen kimliksiz ve scope\'suz — IDOR/auth bypass',
    file: 'app/api/admin/crm/customers/route.ts',
    line: '112-149',
    severity: 'high',
    dimension: 'security',
    cluster: 'marketing-crm',
    evidence:
      'PUT (113) ve DELETE (137) hiçbir auth/scope çağrısı içermiyor. Herhangi bir istek id ile delete çalıştırabiliyor.',
    fix: 'PUT ve DELETE başına getHotelScope() ekle ve hotelId scope.hotelIds\'e karşı doğrula.',
    status: 'Confirmed',
  },
];

interface AuditFindingsProps {
  searchTerm: string;
  selectedSeverity: string;
  selectedDimension: string;
  severityColors: Record<string, any>;
  dimensionIcons: Record<string, any>;
}

export default function AuditFindings({
  searchTerm,
  selectedSeverity,
  selectedDimension,
  severityColors,
  dimensionIcons,
}: AuditFindingsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredFindings = SAMPLE_FINDINGS.filter((finding) => {
    const matchesSeverity = selectedSeverity === 'all' || finding.severity === selectedSeverity;
    const matchesDimension = selectedDimension === 'all' || finding.dimension === selectedDimension;
    const matchesSearch =
      !searchTerm ||
      finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.cluster.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSeverity && matchesDimension && matchesSearch;
  });

  const dimensionLabels = {
    security: '🔒 Security',
    'data-connection': '📊 Data Integrity',
    'logic-kurgu': '⚙️ Logic Error',
    'code-build': '🛠️ Code Quality',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Detailed Findings
          <span className="ml-3 inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {filteredFindings.length} results
          </span>
        </h2>
      </div>

      {filteredFindings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No findings match your filters. Try adjusting your search.</p>
        </div>
      ) : (
        filteredFindings.map((finding, index) => {
          const colors = severityColors[finding.severity];
          const isExpanded = expandedId === finding.id;
          const dimensionLabel = dimensionLabels[finding.dimension as keyof typeof dimensionLabels];

          return (
            <div
              key={finding.id}
              className={`bg-white border-2 rounded-lg overflow-hidden transition-all ${colors.border} hover:shadow-lg`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                className={`w-full px-6 py-4 text-left hover:${colors.bg} transition`}
              >
                <div className="flex items-start gap-4">
                  {/* Index */}
                  <div className="flex-shrink-0 pt-1">
                    <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                  </div>

                  {/* Title & Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${colors.badge}`}>
                        {finding.severity === 'critical'
                          ? '🔴 CRITICAL'
                          : finding.severity === 'high'
                          ? '🟠 HIGH'
                          : finding.severity === 'medium'
                          ? '🟡 MEDIUM'
                          : '🟢 LOW'}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {dimensionLabel}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {finding.cluster}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{finding.title}</h3>
                    <p className="text-sm text-gray-600 font-mono">
                      {finding.file}:{finding.line}
                    </p>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0 pt-1">
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
              </button>

              {/* Details */}
              {isExpanded && (
                <div className={`border-t-2 ${colors.border} px-6 py-4 space-y-4 bg-gray-50`}>
                  {/* Evidence */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📋 Evidence</h4>
                    <p className="text-sm text-gray-700 bg-white p-4 rounded border border-gray-200">
                      {finding.evidence}
                    </p>
                  </div>

                  {/* Fix Recommendation */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">✅ Recommended Fix</h4>
                    <p className="text-sm text-gray-700 bg-green-50 p-4 rounded border border-green-200">
                      {finding.fix}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">FILE</p>
                      <p className="text-sm font-mono text-gray-900 mt-1">{finding.file}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">LINES</p>
                      <p className="text-sm font-mono text-gray-900 mt-1">{finding.line}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">CLUSTER</p>
                      <p className="text-sm font-mono text-gray-900 mt-1">{finding.cluster}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">STATUS</p>
                      <p className="text-sm font-mono text-green-700 mt-1">✓ {finding.status}</p>
                    </div>
                  </div>

                  {/* GitHub Link */}
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={`https://github.com/sserdarb/antigravity/issues?labels=security-audit,${finding.severity}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Track on GitHub →
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
