import { getSession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

const AUDIT_FINDINGS = {
  summary: 'Çok-ajanlı PPG sistem denetimi: 180 admin bölümü + API + lib, 4 boyutta hata avı',
  agentCount: 111,
  timestamp: new Date('2026-06-16T00:00:00Z').toISOString(),
  counts: {
    critical: 1,
    high: 28,
    medium: 85,
    low: 31,
  },
  totalConfirmed: 145,
  totalRaw: 189,
  findings: [
    {
      id: 1,
      title: 'Tüm hosting API rotaları rol-gate\'siz: herhangi bir admin root SSH komutu çalıştırabiliyor',
      file: 'app/api/admin/hosting/files/route.ts',
      line: '4-44',
      severity: 'critical',
      dimension: 'security',
      cluster: 'hosting-mgr',
      evidence:
        'Bu rotaların hiçbiri requireSuperadmin/requireAuthenticatedAdmin çağrımıyor. middleware.ts sadece admin_session cookie\'sinin VARLIĞINI kontrol eder.',
      fix: 'Her hosting/* route.ts\'in başına requireSuperadmin() ekle.',
      status: 'Confirmed',
      correctedSeverity: 'critical',
    },
    {
      id: 2,
      title: 'resync endpoint auth bypass: force=blue herkese açık full PMS resync',
      file: 'app/api/admin/pms/resync/route.ts',
      line: '25-29',
      severity: 'critical',
      dimension: 'security',
      cluster: 'pms-core',
      evidence: 'isForced = secret===\'blue\' ile auth tamamen atlanıyor.',
      fix: 'force=blue kısa-yolunu kaldır; sadece CRON_SECRET eşleşmesi kabul et.',
      status: 'Confirmed',
      correctedSeverity: 'high',
    },
    {
      id: 3,
      title: 'Hardcoded ENCRYPTION_KEY fallback encrypts with public default',
      file: 'lib/utils/encryption.ts',
      line: '5',
      severity: 'critical',
      dimension: 'security',
      cluster: 'ai-agents',
      evidence: 'ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || \'default-secret-key-must-be-32-chars!\'',
      fix: 'Throw at startup if ENCRYPTION_KEY unset. Never use literal default.',
      status: 'Confirmed',
      correctedSeverity: 'high',
    },
  ],
};

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (
    !session ||
    !['superadmin', 'admin', 'chainadmin', 'hoteladmin'].includes(session.role || '')
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const severity = request.nextUrl.searchParams.get('severity');
  const dimension = request.nextUrl.searchParams.get('dimension');

  let findings = AUDIT_FINDINGS.findings;

  if (severity && severity !== 'all') {
    findings = findings.filter((f) => f.severity === severity);
  }

  if (dimension && dimension !== 'all') {
    findings = findings.filter((f) => f.dimension === dimension);
  }

  return NextResponse.json({
    ...AUDIT_FINDINGS,
    findings,
    filteredCount: findings.length,
  });
}
