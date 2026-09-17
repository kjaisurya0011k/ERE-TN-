import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { ArrowRight, UserPlus } from 'lucide-react';

export const StudentRegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: 'Tamil Nadu',
    educationLevel: 'UNDERGRADUATE',
    socialCategory: 'BC',
    isGovtSchoolStudent: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'STUDENT',
        state: formData.state,
        educationLevel: formData.educationLevel,
        socialCategory: formData.socialCategory,
        isGovtSchoolStudent: formData.isGovtSchoolStudent,
      });
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 md:py-16 space-y-6">
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
          <span className="font-display text-2xl font-extrabold text-primary tracking-tight">ERE-TN</span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-primary">Create Free Student Account</h1>
        <p className="text-xs text-on-surface-variant">
          Unlock personalized scholarship matching, 1-on-1 career counselling, and NOVA AI
        </p>
      </div>

      <Card className="p-6 md:p-8 space-y-6 border border-surface-variant shadow-[0px_10px_30px_rgba(26,35,126,0.08)]">
        <div className="flex items-center justify-between pb-2 border-b border-surface-variant">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Student Registration Form
          </span>
          <Badge variant="primary" size="sm">
            STUDENT
          </Badge>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name (as per School / College ID)"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Kavitha Ramasamy"
            leftIcon={<span className="material-symbols-outlined text-[18px]">person</span>}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('auth.email')}
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="kavitha@gmail.com"
              leftIcon={<span className="material-symbols-outlined text-[18px]">mail</span>}
            />

            <Input
              label="Mobile Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              leftIcon={<span className="material-symbols-outlined text-[18px]">phone</span>}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="State of Domicile"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              options={[
                { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                { value: 'Karnataka', label: 'Karnataka' },
                { value: 'Kerala', label: 'Kerala' },
                { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
                { value: 'Other', label: 'Other State (All India)' },
              ]}
            />

            <Select
              label="Current Education Level"
              value={formData.educationLevel}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
              options={[
                { value: 'SCHOOL_12TH', label: '12th Standard' },
                { value: 'DIPLOMA_POLYTECHNIC', label: 'Diploma / Polytechnic' },
                { value: 'UNDERGRADUATE', label: 'Undergraduate (UG)' },
                { value: 'POSTGRADUATE', label: 'Postgraduate (PG)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('auth.password')}
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••••"
              leftIcon={<span className="material-symbols-outlined text-[18px]">lock</span>}
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••••••"
              leftIcon={<span className="material-symbols-outlined text-[18px]">lock</span>}
            />
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isGovtSchoolStudent}
                onChange={(e) => setFormData({ ...formData, isGovtSchoolStudent: e.target.checked })}
                className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4"
              />
              <span className="text-slate-800 font-semibold leading-relaxed">
                I studied from 6th to 12th in a Tamil Nadu Government School (Qualifies for 7.5% quota, Pudhumai Penn, and Tamil Pudhalvan).
              </span>
            </label>
          </div>

          <Button
            size="lg"
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center shadow-md font-bold"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-on-surface-variant border-t border-surface-variant space-y-1">
          <div>
            <span>{t('auth.alreadyHaveAccount')} </span>
            <Link to="/login" className="font-bold text-primary hover:text-secondary underline ml-1">
              Sign In Here
            </Link>
          </div>
          <div>
            <span>Are you a working professional? </span>
            <Link to="/register/mentor" className="font-bold text-secondary hover:text-primary underline ml-1">
              Apply as Mentor
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default StudentRegisterPage;
