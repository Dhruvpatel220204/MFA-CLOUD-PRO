import { motion } from 'framer-motion';
import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react';

interface FailedAttempt {
  id: string;
  browser: string | null;
  os: string | null;
  failure_reason?: string | null;
  created_at: string;
}

interface FailedAttemptsCardProps {
  attempts: FailedAttempt[];
}

export default function FailedAttemptsCard({ attempts }: FailedAttemptsCardProps) {
  const latestAttempt = attempts[0] ?? null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Failed Attempts
          </h3>
          <p className="text-3xl font-bold text-destructive mt-2">{attempts.length}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
      </div>

      {latestAttempt ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Latest failed login</p>
              <p className="text-xs text-muted-foreground mt-1 break-words">
                {latestAttempt.failure_reason || 'Login failed'}
              </p>
            </div>
          </div>

          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <div>
              <span className="text-foreground">Device:</span>{' '}
              {latestAttempt.browser || 'Unknown'} / {latestAttempt.os || 'Unknown'}
            </div>
            <div className="flex items-center gap-1 sm:justify-end">
              <Clock className="w-3 h-3" />
              {new Date(latestAttempt.created_at).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          No failed login attempts recorded.
        </div>
      )}
    </div>
  );
}
