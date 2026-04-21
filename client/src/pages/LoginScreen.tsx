import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBiteTheme } from '@/contexts/BiteThemeContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginScreen() {
  const { login } = useApp();
  const { c } = useBiteTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="px-5 pt-16 pb-8 flex flex-col min-h-[760px]">
      <div className="text-center mb-10">
        <h1 className="font-display text-5xl font-extrabold tracking-tight mb-2"
          style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Bites
        </h1>
        <p className="text-sm" style={{ color: c.textMuted }}>
          Discover, review & share your favourite restaurants
        </p>
      </div>

      <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <button onClick={() => setIsSignUp(false)}
          className="flex-1 py-3 text-sm font-semibold transition-all"
          style={{ background: !isSignUp ? c.accent : 'transparent', color: !isSignUp ? '#fff' : c.textDim }}>
          Sign In
        </button>
        <button onClick={() => setIsSignUp(true)}
          className="flex-1 py-3 text-sm font-semibold transition-all"
          style={{ background: isSignUp ? c.accent : 'transparent', color: isSignUp ? '#fff' : c.textDim }}>
          Sign Up
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {isSignUp && (
          <>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              <span className="text-lg">👤</span>
              <input type="text" placeholder="Full name"
                className="bg-transparent border-none outline-none text-sm w-full"
                style={{ color: c.text, fontFamily: "'DM Sans', sans-serif" }} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              <span className="text-lg">@</span>
              <input type="text" placeholder="Username"
                className="bg-transparent border-none outline-none text-sm w-full"
                style={{ color: c.text, fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          </>
        )}
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <Mail size={18} style={{ color: c.textDim }} />
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: c.text, fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <Lock size={18} style={{ color: c.textDim }} />
          <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: c.text, fontFamily: "'DM Sans', sans-serif" }} />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} style={{ color: c.textDim }} /> : <Eye size={18} style={{ color: c.textDim }} />}
          </button>
        </div>
      </div>

      {!isSignUp && (
        <div className="text-right mb-6">
          <span className="text-xs font-medium cursor-pointer" style={{ color: c.accent }}>Forgot password?</span>
        </div>
      )}

      <button onClick={login}
        className="w-full py-4 rounded-xl text-base font-semibold mb-4 transition-all hover:opacity-90"
        style={{ background: c.accent, color: '#fff' }}>
        {isSignUp ? 'Create Account' : 'Sign In'}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: c.divider }} />
        <span className="text-xs" style={{ color: c.textDim }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: c.divider }} />
      </div>

      <div className="flex gap-3 mb-8">
        {[
          { icon: '🍎', label: 'Apple' },
          { icon: '🔵', label: 'Google' },
        ].map(s => (
          <button key={s.label} onClick={login}
            className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.textMuted }}>
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="text-center mt-auto">
        <p className="text-[11px]" style={{ color: c.textDim }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
