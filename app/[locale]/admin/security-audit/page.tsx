import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import SecurityAuditDashboard from './SecurityAuditDashboard';

export const metadata = {
  title: 'Security Audit Report | PPG Admin',
  description: 'Security and quality audit findings across PPG systems',
};

export default async function SecurityAuditPage() {
  const session = await getSession();

  if (!session || !['superadmin', 'admin', 'chainadmin'].includes(session.role)) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SecurityAuditDashboard />
    </div>
  );
}
