import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceInfo, calculateTrustScore } from '@/lib/device-fingerprint';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Shield, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrustScoreCard from '@/components/dashboard/TrustScoreCard';
import LoginHistoryCard from '@/components/dashboard/LoginHistoryCard';
import DevicesCard from '@/components/dashboard/DevicesCard';
import ActiveSessionsCard from '@/components/dashboard/ActiveSessionsCard';
import SecurityOverview from '@/components/dashboard/SecurityOverview';
import MFAToggleCard from '@/components/dashboard/MFAToggleCard';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [trustScore, setTrustScore] = useState<{ score: number; level: 'low' | 'medium' | 'high' | 'critical' }>({ score: 50, level: 'medium' });

  const loadData = useCallback(async () => {
    if (!user) return;

    const [profileRes, devicesRes, loginsRes, sessionsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('devices').select('*').eq('user_id', user.id).order('last_seen', { ascending: false }),
      supabase.from('login_attempts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('user_sessions').select('*').eq('user_id', user.id).order('last_active', { ascending: false }),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (devicesRes.data) setDevices(devicesRes.data);
    if (loginsRes.data) setLoginAttempts(loginsRes.data);
    if (sessionsRes.data) setSessions(sessionsRes.data);

    // Calculate trust score
    const deviceInfo = getDeviceInfo();
    const knownDevice = devicesRes.data?.some(d => d.device_fingerprint === deviceInfo.fingerprint);
    const recentFails = loginsRes.data?.filter(a => !a.success && new Date(a.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length || 0;
    const accountAge = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

    const score = calculateTrustScore({
      isKnownDevice: !!knownDevice,
      loginSuccess: true,
      failedAttemptsRecent: recentFails,
      accountAge,
    });
    setTrustScore(score);
  }, [user]);

  // Register current device on login
  useEffect(() => {
    if (!user) return;

    const registerDevice = async () => {
      const deviceInfo = getDeviceInfo();
      const { data: existing } = await supabase
        .from('devices')
        .select('id')
        .eq('user_id', user.id)
        .eq('device_fingerprint', deviceInfo.fingerprint)
        .maybeSingle();

      if (existing) {
        await supabase.from('devices').update({ last_seen: new Date().toISOString() }).eq('id', existing.id);
      } else {
        await supabase.from('devices').insert({
          user_id: user.id,
          device_fingerprint: deviceInfo.fingerprint,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          trust_score: 50,
        });
        toast.info('New device detected and registered');
      }

      // Log successful login
      await supabase.from('login_attempts').insert({
        user_id: user.id,
        email: user.email || '',
        success: true,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        risk_level: 'low',
      });

      // Create session
      await supabase.from('user_sessions').insert({
        user_id: user.id,
        session_token: crypto.randomUUID(),
        browser: deviceInfo.browser,
        os: deviceInfo.os,
      });
    };

    registerDevice();
    loadData();
  }, [user, loadData]);

  // Realtime: listen for failed login attempts
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('failed-login-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'login_attempts',
          filter: `email=eq.${user.email}`,
        },
        (payload) => {
          const attempt = payload.new as any;
          if (!attempt.success) {
            toast.error('⚠️ Failed Login Attempt Detected!', {
              description: `${attempt.browser || 'Unknown browser'} / ${attempt.os || 'Unknown OS'} — ${attempt.failure_reason || 'Invalid credentials'}`,
              duration: 8000,
            });
            // Add to local state immediately
            setLoginAttempts(prev => [attempt, ...prev]);
          } else {
            setLoginAttempts(prev => [attempt, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleToggleMFA = async (enabled: boolean) => {
    if (!user) return;
    await supabase.from('profiles').update({ mfa_enabled: enabled }).eq('user_id', user.id);
    setProfile((prev: any) => ({ ...prev, mfa_enabled: enabled }));
    toast.success(enabled ? 'MFA enabled' : 'MFA disabled');
  };

  const handleGenerateBackupCodes = async () => {
    if (!user) return;
    const codes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    );
    await supabase.from('profiles').update({ backup_codes: codes }).eq('user_id', user.id);
    setProfile((prev: any) => ({ ...prev, backup_codes: codes }));
    toast.success('Backup codes generated. Store them securely!');
  };

  const handleRemoveDevice = async (id: string) => {
    await supabase.from('devices').delete().eq('id', id);
    setDevices(prev => prev.filter(d => d.id !== id));
    toast.success('Device removed');
  };

  const handleToggleDeviceTrust = async (id: string, trusted: boolean) => {
    await supabase.from('devices').update({ is_trusted: trusted }).eq('id', id);
    setDevices(prev => prev.map(d => d.id === id ? { ...d, is_trusted: trusted } : d));
    toast.success(trusted ? 'Device marked as trusted' : 'Device trust revoked');
  };

  const handleEndSession = async (id: string) => {
    await supabase.from('user_sessions').update({ is_active: false }).eq('id', id);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, is_active: false } : s));
    toast.success('Session ended');
  };

  const failedLogins = loginAttempts.filter(a => !a.success).length;
  const recentAlerts = loginAttempts.filter(a => a.risk_level !== 'low' && new Date(a.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="min-h-screen bg-background scan-line">
      {/* Background */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(hsl(160 84% 39% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">SecureGuard</h1>
              <p className="text-xs text-muted-foreground">Security Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{profile?.display_name || user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <SecurityOverview
            mfaEnabled={profile?.mfa_enabled || false}
            totalDevices={devices.length}
            recentAlerts={recentAlerts}
            totalLogins={loginAttempts.length}
            failedLogins={failedLogins}
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <TrustScoreCard score={trustScore.score} level={trustScore.level} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <MFAToggleCard
              enabled={profile?.mfa_enabled || false}
              backupCodes={profile?.backup_codes || []}
              onToggle={handleToggleMFA}
              onGenerateBackupCodes={handleGenerateBackupCodes}
            />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <LoginHistoryCard attempts={loginAttempts} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <DevicesCard
              devices={devices}
              onRemoveDevice={handleRemoveDevice}
              onToggleTrust={handleToggleDeviceTrust}
            />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <ActiveSessionsCard
            sessions={sessions}
            onEndSession={handleEndSession}
          />
        </motion.div>

        {/* Footer */}
        <div className="text-center py-6 text-xs text-muted-foreground">
          <p>SecureGuard MFA · Multi-Factor Authentication Cloud Security System</p>
          <p className="mt-1">B.Tech Final Year Project · {new Date().getFullYear()}</p>
        </div>
      </main>
    </div>
  );
}
