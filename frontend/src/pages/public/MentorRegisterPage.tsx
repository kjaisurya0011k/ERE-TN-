import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

export const MentorRegisterPage: React.FC = () => {
  const { registerMentor } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    titleRole: '',
    companyOrInstitution: '',
    yearsOfExperience: 5,
    qualification: 'B.E / M.Tech',
    expertiseTags: 'Cloud Computing, AWS, System Design',
    languagesSpoken: 'English, Tamil',
    linkedinUrl: '',
    password: '',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        titleRole: formData.titleRole.trim(),
        companyOrInstitution: formData.companyOrInstitution.trim(),
        yearsOfExperience: Number(formData.yearsOfExperience),
        qualification: formData.qualification,
        bio: formData.bio || `Professional with ${formData.yearsOfExperience} years experience in ${formData.companyOrInstitution}`,
        specialization: formData.titleRole,
        expertiseTags: formData.expertiseTags.split(',').map((s) => s.trim()).filter(Boolean),
        languagesSpoken: formData.languagesSpoken.split(',').map((s) => s.trim()).filter(Boolean),
        linkedinUrl: formData.linkedinUrl,
      };

      await registerMentor(payload);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 md:py-16 space-y-6">
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
          <span className="font-display text-2xl font-extrabold text-primary">ERE-TN</span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-primary">Apply as an ERE-TN Mentor</h1>
        <p className="text-xs text-on-surface-variant">
          Guide students across Tamil Nadu and India to achieve their highest educational and career potential
        </p>
      </div>

      <Card className="p-6 md:p-8 space-y-6 border border-surface-variant shadow-[0px_10px_30px_rgba(26,35,126,0.08)]">
        <div className="flex items-center justify-between pb-2 border-b border-surface-variant">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Mentor Application Form
          </span>
          <Badge variant="secondary" size="sm">
            STATUS: PENDING REVIEW
          </Badge>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px] filled">check_circle</span>
            </div>
            <h3 className="font-display text-xl font-bold text-primary">Application Submitted!</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your mentor account is created with <strong>PENDING</strong> status. ERE-TN administrators review all mentor profiles within 24–48 hours to maintain strict student trust and safety standards.
            </p>
            <Button size="md" onClick={() => navigate('/mentor/dashboard')} className="w-full justify-center">
              Go to Mentor Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name & Designation"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Dr. S. Karthikeyan"
              leftIcon={<span className="material-symbols-outlined text-[18px]">person</span>}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Professional Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="karthik@aws.com"
                leftIcon={<span className="material-symbols-outlined text-[18px]">mail</span>}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                leftIcon={<span className="material-symbols-outlined text-[18px]">phone</span>}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Company / Institution"
                required
                value={formData.companyOrInstitution}
                onChange={(e) => setFormData({ ...formData, companyOrInstitution: e.target.value })}
                placeholder="e.g. Amazon Web Services / IIT Madras"
              />
              <Input
                label="Years of Experience"
                type="number"
                min="1"
                required
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
              />
            </div>

            <Input
              label="Title / Role in Company"
              required
              value={formData.titleRole}
              onChange={(e) => setFormData({ ...formData, titleRole: e.target.value })}
              placeholder="e.g. Senior Solutions Architect"
            />

            <Input
              label="Domains of Expertise (Comma Separated)"
              required
              value={formData.expertiseTags}
              onChange={(e) => setFormData({ ...formData, expertiseTags: e.target.value })}
              placeholder="Cloud, Data Science, Full Stack, Placement Guidance"
            />

            <Input
              label="Languages Spoken"
              required
              value={formData.languagesSpoken}
              onChange={(e) => setFormData({ ...formData, languagesSpoken: e.target.value })}
              placeholder="English, Tamil, Hindi"
            />

            <Input
              label="LinkedIn Profile URL"
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
              leftIcon={<span className="material-symbols-outlined text-[18px]">link</span>}
            />

            <Input
              label="Set Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••••"
              leftIcon={<span className="material-symbols-outlined text-[18px]">lock</span>}
            />

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 leading-relaxed">
              <strong>Workflow Notice:</strong> Newly registered mentor accounts are set to <strong>PENDING</strong>. Your profile will become publicly searchable on the Mentors directory as soon as an administrator verifies your details.
            </div>

            <Button
              size="lg"
              type="submit"
              isLoading={isLoading}
              variant="secondary"
              className="w-full justify-center shadow-md text-white"
            >
              Submit Mentor Application
            </Button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-on-surface-variant border-t border-surface-variant">
          <span>Already registered as a mentor? </span>
          <Link to="/login" className="font-bold text-primary hover:text-secondary underline ml-1">
            Sign In Here
          </Link>
        </div>
      </Card>
    </div>
  );
};
export default MentorRegisterPage;
