import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, Mail, User, KeyRound, RefreshCw, ShieldAlert } from 'lucide-react';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // OTP state
  const [showOTP, setShowOTP] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(60);
  const [otpVerifying, setOtpVerifying] = useState(false);

  // Recovery code state
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryVerifying, setRecoveryVerifying] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    if (!showOTP || otpExpiry <= 0) return;
    const timer = setInterval(() => setOtpExpiry(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [showOTP, otpExpiry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          // Password correct → show OTP step
          const otp = generateOTP();
          setGeneratedOTP(otp);
          setEnteredOTP('');
          setOtpExpiry(60);
          setShowOTP(true);
          toast.success('Credentials verified. Enter the OTP to continue.');
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Check your email to verify.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = () => {
    if (enteredOTP === generatedOTP) {
      setOtpVerifying(true);
      setTimeout(() => {
        toast.success('OTP verified! Logging in…');
        navigate('/');
      }, 800);
    } else {
      toast.error('Invalid OTP. Please try again.');
      setEnteredOTP('');
    }
  };

  const handleResendOTP = () => {
    const otp = generateOTP();
    setGeneratedOTP(otp);
    setEnteredOTP('');
    setOtpExpiry(60);
    toast.info('New OTP generated.');
  };

  const handleRecoveryCodeVerify = async () => {
    setRecoveryVerifying(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (!userId) {
        toast.error('Session expired. Please log in again.');
        setShowOTP(false);
        setUseRecoveryCode(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('backup_codes')
        .eq('user_id', userId)
        .single();

      const codes: string[] = profile?.backup_codes || [];
      const normalizedInput = recoveryCode.trim().toUpperCase();
      const matchIndex = codes.findIndex(c => c === normalizedInput);

      if (matchIndex === -1) {
        toast.error('Invalid recovery code. Please try again.');
        setRecoveryCode('');
        return;
      }

      // Remove used code
      const updatedCodes = codes.filter((_, i) => i !== matchIndex);
      await supabase
        .from('profiles')
        .update({ backup_codes: updatedCodes })
        .eq('user_id', userId);

      toast.success(`Recovery code accepted! ${updatedCodes.length} codes remaining.`);
      setTimeout(() => navigate('/'), 800);
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setRecoveryVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 scan-line">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(160 84% 39% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4"
            animate={{ boxShadow: ['0 0 20px hsl(160 84% 39% / 0.1)', '0 0 40px hsl(160 84% 39% / 0.2)', '0 0 20px hsl(160 84% 39% / 0.1)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">Multi Factor Cloud Authentication</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Adaptive Cloud Authentication Platform
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            {!showOTP ? (
              <motion.div key="login-form" initial={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
                {/* Tab toggle */}
                <div className="flex rounded-lg bg-muted p-1 mb-6">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      !isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <Label htmlFor="name" className="text-foreground">Display Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="pl-10 bg-muted border-border"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-muted border-border"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-muted border-border"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>{isLogin ? 'Sign In' : 'Create Account'}</>
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Protected by multi-factor authentication
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  {!useRecoveryCode ? (
                    <motion.div key="otp-input" initial={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      {/* OTP Header */}
                      <div className="text-center space-y-2">
                        <motion.div
                          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          <KeyRound className="w-6 h-6 text-primary" />
                        </motion.div>
                        <h2 className="text-lg font-bold text-foreground">OTP Verification</h2>
                        <p className="text-xs text-muted-foreground">
                          Enter the 6-digit code displayed below to verify your identity
                        </p>
                      </div>

                      {/* Generated OTP Display */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="relative rounded-xl border border-primary/30 bg-primary/5 p-4 text-center overflow-hidden"
                      >
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(160 84% 39% / 0.1) 10px, hsl(160 84% 39% / 0.1) 20px)',
                        }} />
                        <p className="text-xs text-muted-foreground mb-1 relative z-10">Your OTP Code</p>
                        <motion.p
                          className="text-3xl font-mono font-bold tracking-[0.4em] text-primary relative z-10"
                          animate={{ opacity: otpExpiry <= 10 ? [1, 0.4, 1] : 1 }}
                          transition={{ duration: 0.8, repeat: otpExpiry <= 10 ? Infinity : 0 }}
                        >
                          {generatedOTP}
                        </motion.p>
                        <div className="flex items-center justify-center gap-1 mt-2 relative z-10">
                          <div className={`w-2 h-2 rounded-full ${otpExpiry > 0 ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
                          <span className={`text-xs font-mono ${otpExpiry <= 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {otpExpiry > 0 ? `Expires in ${otpExpiry}s` : 'Expired'}
                          </span>
                        </div>
                      </motion.div>

                      {/* OTP Input */}
                      <div className="flex flex-col items-center gap-4">
                        <InputOTP maxLength={6} value={enteredOTP} onChange={setEnteredOTP}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>

                        <Button variant="hero" className="w-full" onClick={handleOTPVerify} disabled={enteredOTP.length !== 6 || otpExpiry <= 0 || otpVerifying}>
                          {otpVerifying ? (
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          ) : 'Verify OTP'}
                        </Button>

                        <div className="flex flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => { setUseRecoveryCode(true); setRecoveryCode(''); }}
                            className="text-xs text-warning hover:text-warning/80 flex items-center gap-1 transition-colors"
                          >
                            <ShieldAlert className="w-3 h-3" /> Use recovery code instead
                          </button>
                          <div className="flex items-center gap-4">
                            <button type="button" onClick={handleResendOTP} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                              <RefreshCw className="w-3 h-3" /> Regenerate Code
                            </button>
                            <button type="button" onClick={() => { setShowOTP(false); setEnteredOTP(''); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                              ← Back to login
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">
                          This is a simulated OTP for demonstration purposes
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="recovery-input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                      {/* Recovery Header */}
                      <div className="text-center space-y-2">
                        <motion.div
                          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-warning/10 border border-warning/20"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ShieldAlert className="w-6 h-6 text-warning" />
                        </motion.div>
                        <h2 className="text-lg font-bold text-foreground">Recovery Code</h2>
                        <p className="text-xs text-muted-foreground">
                          Enter one of your backup recovery codes (e.g. ABCD-EF12)
                        </p>
                      </div>

                      {/* Recovery Code Input */}
                      <div className="flex flex-col items-center gap-4">
                        <Input
                          type="text"
                          placeholder="XXXX-XXXX"
                          value={recoveryCode}
                          onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                          className="text-center text-lg font-mono tracking-widest bg-muted border-border"
                          maxLength={9}
                        />

                        <Button variant="hero" className="w-full" onClick={handleRecoveryCodeVerify} disabled={recoveryCode.length < 9 || recoveryVerifying}>
                          {recoveryVerifying ? (
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          ) : 'Verify Recovery Code'}
                        </Button>

                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => { setUseRecoveryCode(false); setRecoveryCode(''); }}
                            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                          >
                            <KeyRound className="w-3 h-3" /> Back to OTP
                          </button>
                          <button type="button" onClick={() => { setShowOTP(false); setUseRecoveryCode(false); setEnteredOTP(''); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            ← Back to login
                          </button>
                        </div>
                      </div>

                      <div className="rounded-lg border border-warning/20 bg-warning/5 p-3 text-center">
                        <p className="text-[10px] text-warning">
                          ⚠ Each recovery code can only be used once. Generate new codes from the dashboard after use.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security badges */}
        <div className="flex justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> 256-bit SSL
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> MFA Protected
          </span>
        </div>
      </motion.div>
    </div>
  );
}
