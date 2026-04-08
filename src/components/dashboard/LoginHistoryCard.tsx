import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Globe, Monitor } from 'lucide-react';

interface LoginAttempt {
  id: string;
  success: boolean;
  ip_address: string | null;
  browser: string | null;
  os: string | null;
  location: string | null;
  risk_level: string;
  failure_reason?: string | null;
  created_at: string;
}

interface LoginHistoryCardProps {
  attempts: LoginAttempt[];
}

export default function LoginHistoryCard({ attempts }: LoginHistoryCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Login History</h3>
        <span className="text-xs text-muted-foreground font-mono">{attempts.length} events</span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {attempts.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No login attempts recorded</p>
        ) : (
          attempts.map((attempt, index) => (
            <motion.div
              key={attempt.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                attempt.success
                  ? 'bg-success/5 border-success/10'
                  : 'bg-destructive/5 border-destructive/10'
              }`}
            >
              {attempt.success ? (
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-foreground font-medium">
                    {attempt.success ? 'Successful Login' : 'Failed Attempt'}
                  </span>
                  <RiskBadge level={attempt.risk_level} />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    {attempt.browser || 'Unknown'} / {attempt.os || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {attempt.ip_address || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Clock className="w-3 h-3" />
                {new Date(attempt.created_at).toLocaleString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const config: Record<string, string> = {
    low: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    high: 'bg-destructive/10 text-destructive',
    critical: 'bg-destructive/20 text-destructive',
  };

  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${config[level] || config.low}`}>
      {level}
    </span>
  );
}
