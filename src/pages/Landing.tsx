import { motion } from 'framer-motion';
import { Shield, Lock, Fingerprint, Smartphone, Eye, Globe, Server, Zap, ChevronRight, ShieldCheck, KeyRound, ScanFace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const features = [
  {
    icon: Fingerprint,
    title: 'Device Fingerprinting',
    desc: 'Unique device identification using browser, OS, screen resolution and hardware signatures for precise recognition.',
  },
  {
    icon: ShieldCheck,
    title: 'Adaptive Trust Scoring',
    desc: 'AI-driven trust scores that dynamically evaluate device reputation, login patterns, and behavioral anomalies.',
  },
  {
    icon: KeyRound,
    title: 'TOTP / Authenticator MFA',
    desc: 'Time-based one-time passwords compatible with Google Authenticator, Authy, and all TOTP-compliant apps.',
  },
  {
    icon: Smartphone,
    title: 'SMS & Email OTP',
    desc: 'Fallback verification via SMS or email one-time codes with configurable expiry and retry limits.',
  },
  {
    icon: ScanFace,
    title: 'Biometric Authentication',
    desc: 'WebAuthn / FIDO2 support for fingerprint and face recognition on compatible devices and browsers.',
  },
  {
    icon: Globe,
    title: 'Geo-Location Monitoring',
    desc: 'Real-time IP geolocation tracking to flag impossible travel and suspicious login locations instantly.',
  },
];

const stats = [
  { value: '99.97%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'Auth Latency' },
  { value: '256-bit', label: 'AES Encryption' },
  { value: '10M+', label: 'Auth Events/Day' },
];

const steps = [
  { num: '01', title: 'User Initiates Login', desc: 'Credentials submitted over TLS 1.3 encrypted channel.' },
  { num: '02', title: 'Device Fingerprint Check', desc: 'Browser & hardware signals matched against trusted device registry.' },
  { num: '03', title: 'Risk Assessment', desc: 'Trust score computed from location, device age, and login history.' },
  { num: '04', title: 'MFA Challenge', desc: 'Secondary factor required if risk threshold exceeded or new device detected.' },
  { num: '05', title: 'Session Granted', desc: 'Secure session token issued with continuous monitoring active.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden scan-line">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(hsl(160 84% 39% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-text">MFCA</span>
            <span className="text-muted-foreground text-xs ml-1 font-mono">v2.0</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#security" className="hover:text-foreground transition-colors">Security</a>
        </div>
        <Button variant="hero" size="sm" onClick={() => navigate('/auth')} className="gap-2">
          Get Started <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 pt-16 pb-24 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-8"
            animate={{ boxShadow: ['0 0 15px hsl(160 84% 39% / 0.1)', '0 0 30px hsl(160 84% 39% / 0.2)', '0 0 15px hsl(160 84% 39% / 0.1)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Lock className="w-3 h-3" /> Enterprise-Grade Security
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Multi Factor Cloud
            <br />
            <span className="gradient-text">Authentication</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Next-generation adaptive authentication platform with device fingerprinting, 
            real-time risk analysis, and seamless multi-factor verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" onClick={() => navigate('/auth')} className="gap-2 text-base px-8">
              Launch Dashboard <Zap className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-base px-8 border-border hover:bg-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Features <Eye className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Floating shield animation */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border border-primary/20 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={deg}
                className="absolute w-3 h-3 rounded-full bg-primary/40"
                style={{
                  top: `${50 - 45 * Math.cos((deg * Math.PI) / 180)}%`,
                  left: `${50 + 45 * Math.sin((deg * Math.PI) / 180)}%`,
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
            <motion.div
              className="absolute inset-8 rounded-full border border-accent/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            <Shield className="w-16 h-16 md:w-20 md:h-20 text-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 md:px-12 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card p-6 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold gradient-text font-mono">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-xs font-mono uppercase tracking-widest">Authentication Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Comprehensive Security Suite</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every layer of authentication designed to protect identities while maintaining a frictionless user experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow duration-300">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-12 py-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-xs font-mono uppercase tracking-widest">Authentication Flow</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A five-step adaptive pipeline that balances security with speed.
          </p>
        </motion.div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card p-6 flex items-start gap-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="text-3xl font-bold gradient-text font-mono shrink-0">{step.num}</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative z-10 px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12 text-center"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6"
            animate={{ boxShadow: ['0 0 20px hsl(160 84% 39% / 0.1)', '0 0 40px hsl(160 84% 39% / 0.25)', '0 0 20px hsl(160 84% 39% / 0.1)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Server className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise Security Standards</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Built on zero-trust architecture with end-to-end encryption, SOC 2 Type II compliance, 
            and continuous threat monitoring. Your authentication infrastructure, fortified.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-mono text-muted-foreground">
            {['TLS 1.3', 'AES-256', 'FIDO2', 'OAuth 2.0', 'OpenID Connect', 'SAML 2.0', 'Zero Trust', 'SOC 2'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-lg bg-secondary border border-border">{tag}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 py-20 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Secure Your Platform?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Deploy multi-factor cloud authentication in minutes. No infrastructure overhead.
          </p>
          <Button variant="hero" size="lg" onClick={() => navigate('/auth')} className="gap-2 text-base px-10">
            Get Started Now <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 md:px-12 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">Multi Factor Cloud Authentication</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 MFCA. All rights reserved.</span>
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> 256-bit SSL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
