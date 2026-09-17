import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const cleanEmail = email.trim();
      const loggedInUser = await login(cleanEmail, password);
      if (loggedInUser) {
        const redirectParam = searchParams.get('redirect');
        if (redirectParam && !redirectParam.startsWith('/login') && !redirectParam.startsWith('/register')) {
          navigate(redirectParam);
        } else if (loggedInUser.role === 'STUDENT') {
          navigate('/student/dashboard');
        } else if (loggedInUser.role === 'MENTOR') {
          navigate('/mentor/dashboard');
        } else if (loggedInUser.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
          <span className="font-display text-2xl font-extrabold text-primary tracking-tight">ERE-TN</span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-primary">Sign In to ERE-TN</h1>
        <p className="text-xs text-on-surface-variant">
          Access your unified student, mentor, or administrator workspace
        </p>
      </div>

      {/* Login Card */}
      <Card className="p-6 md:p-8 space-y-6 border border-surface-variant shadow-[0px_10px_30px_rgba(26,35,126,0.08)]">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2.5 animate-fade-in">
            <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('auth.email')}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. student@edunova.in"
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label={t('auth.password')}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant select-none">
              <input type="checkbox" className="rounded text-primary focus:ring-primary w-3.5 h-3.5" defaultChecked />
              <span>Remember me</span>
            </label>
            <a href="#" className="font-semibold text-secondary hover:underline">
              {t('auth.forgotPassword')}
            </a>
          </div>

          <Button
            size="lg"
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center shadow-md text-white font-bold"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Quick Demo Credentials Reminder */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[12px] text-slate-600 space-y-2">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-600" /> Default Credentials:</span>
            <span className="text-[10px] text-slate-400 font-normal">Click to auto-fill</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setEmail('student@edunova.in'); setPassword('Student@12345'); }}
              className="px-2.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-colors shadow-xs group cursor-pointer"
            >
              <div className="font-bold text-blue-700 text-[11px] group-hover:text-blue-800">Student</div>
              <div className="text-[9px] text-slate-400 truncate">student@edunova.in</div>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('mentor.karthik@edunova.in'); setPassword('Mentor@12345'); }}
              className="px-2.5 py-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-left transition-colors shadow-xs group cursor-pointer"
            >
              <div className="font-bold text-indigo-700 text-[11px] group-hover:text-indigo-800">Mentor</div>
              <div className="text-[9px] text-slate-400 truncate">mentor.karthik@...</div>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@edunova.in'); setPassword('Admin@12345'); }}
              className="px-2.5 py-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-left transition-colors shadow-xs group cursor-pointer"
            >
              <div className="font-bold text-purple-700 text-[11px] group-hover:text-purple-800">Admin</div>
              <div className="text-[9px] text-slate-400 truncate">admin@edunova.in</div>
            </button>
          </div>
        </div>

        {/* Unified Registration Links */}
        <div className="pt-3 text-center text-xs text-on-surface-variant border-t border-surface-variant space-y-2">
          <div>
            <span>New to ERE-TN? </span>
            <Link
              to="/register/student"
              className="font-bold text-primary hover:text-secondary underline ml-1"
            >
              Create Student Account
            </Link>
          </div>
          <div>
            <span>Are you an industry expert? </span>
            <Link
              to="/register/mentor"
              className="font-bold text-secondary hover:text-primary underline ml-1"
            >
              Apply as Mentor
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default LoginPage;
