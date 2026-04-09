import { motion } from 'framer-motion';
import { Shield, Fingerprint, Activity, Lock, Smartphone } from 'lucide-react';

interface SecurityOverviewProps {
  mfaEnabled: boolean;
  totalDevices: number;
  totalLogins: number;
  failedLogins: number;
}

export default function SecurityOverview({ mfaEnabled, totalDevices, totalLogins, failedLogins }: SecurityOverviewProps) {
  const stats = [
    {
      label: 'MFA Status',
      value: mfaEnabled ? 'Enabled' : 'Disabled',
      icon: Lock,
      color: mfaEnabled ? 'text-success' : 'text-warning',
      bg: mfaEnabled ? 'bg-success/10' : 'bg-warning/10',
    },
    {
      label: 'Devices',
      value: totalDevices.toString(),
      icon: Smartphone,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Login Success',
      value: totalLogins > 0 ? `${Math.round(((totalLogins - failedLogins) / totalLogins) * 100)}%` : 'N/A',
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
