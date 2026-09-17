export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN';

export type GovernmentLevel =
  | 'CENTRAL'
  | 'TAMIL_NADU'
  | 'OTHER_STATE'
  | 'CORPORATE_FOUNDATION'
  | 'NGO_INSTITUTE'
  | 'INSTITUTION'
  | 'INSTITUTION_MERIT'
  | 'STATE_GOVERNMENT'
  | 'NON_PROFIT_TRUST'
  | 'CENTRAL_GOVERNMENT'
  | 'CORPORATE_CSR';

export type ProviderType =
  | 'CENTRAL_GOVERNMENT'
  | 'STATE_GOVERNMENT'
  | 'COLLEGE_UNIVERSITY'
  | 'FOUNDATION'
  | 'NGO'
  | 'PRIVATE_ORGANIZATION'
  | 'EDUCATIONAL_INSTITUTION'
  | 'INDUSTRY_ORGANIZATION'
  | 'OTHER';

export type OpportunityType =
  | 'SCHOLARSHIP'
  | 'GOVERNMENT_SCHEME'
  | 'GOVERNMENT_SCHOLARSHIP'
  | 'COLLEGE_SCHOLARSHIP'
  | 'FOUNDATION_SCHOLARSHIP'
  | 'NGO_OPPORTUNITY'
  | 'FELLOWSHIP'
  | 'INTERNSHIP'
  | 'SKILL_DEVELOPMENT'
  | 'EDUCATION_ASSISTANCE'
  | 'OTHER';

export type VerificationStatus = 'VERIFIED' | 'NEEDS_VERIFICATION' | 'EXPIRED_CLOSED' | 'DEMO_DATA';

export type SocialCategory = 'GENERAL' | 'BC' | 'BCM' | 'MBC' | 'DNC' | 'SC' | 'SCA' | 'ST';

export type EducationLevel =
  | 'SCHOOL_10TH'
  | 'SCHOOL_12TH'
  | 'DIPLOMA_POLYTECHNIC'
  | 'UNDERGRADUATE'
  | 'POSTGRADUATE'
  | 'PHD_RESEARCH';

export type DeadlineStatus = 'CLOSING_SOON' | 'CLOSING_THIS_MONTH' | 'OPEN' | 'NOT_OPEN_YET' | 'EXPIRED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface Institution {
  id: string;
  name: string;
  type: 'GOVERNMENT_COLLEGE' | 'GOVT_AIDED_COLLEGE' | 'PRIVATE_COLLEGE' | 'AUTONOMOUS_COLLEGE' | 'UNIVERSITY' | 'DEEMED_UNIVERSITY' | 'PREMIER_IIT_NIT' | 'OTHER';
  universityAffiliation?: string; // e.g. Anna University, University of Madras
  state: string;
  district: string;
  website: string;
  logoUrl?: string;
  verificationStatus: VerificationStatus;
  scholarshipCount?: number;
  description?: string;
}

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  description: string;
  logoUrl: string;
  mission?: string;
  focusAreas: string[];
  whoTheySupport?: string;
  officialWebsite: string;
  contactEmail?: string;
  contactPhone?: string;
  location: string;
  state?: string;
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
  opportunityCount?: number;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  age?: number;
  dob?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  state: string;
  district: string;
  nativeState: string;
  educationLevel: EducationLevel;
  classOrYear: string;
  courseBranch: string;
  institutionId?: string;
  institutionName: string;
  institutionType: 'GOVERNMENT' | 'GOVT_AIDED' | 'PRIVATE' | 'PREMIER_IIT_NIT';
  marksPercentage: number;
  familyAnnualIncome: number; // in INR
  socialCategory: SocialCategory;
  communityCaste?: string;
  religion?: string;
  isPwd: boolean;
  pwdPercentage?: number;
  isGovtSchoolStudent: boolean; // 6th to 12th in TN Govt Schools (7.5% reservation)
  isFirstGraduate: boolean;
  isHosteller: boolean;
  parentOccupation?: string;
  careerInterests: string[];
}

export interface MentorProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string;
  titleRole: string;
  companyOrInstitution: string;
  yearsOfExperience: number;
  bio: string;
  languagesSpoken: string[];
  expertiseTags: string[];
  hourlyRate: number; // in INR, 0 for free sessions
  ratingAvg: number;
  reviewCount: number;
  verificationStatus: 'APPROVED' | 'PENDING_VERIFICATION' | 'REJECTED';
  linkedinUrl?: string;
  availableDays?: string[];
}

export interface OpportunityCriteria {
  minAge?: number;
  maxAge?: number;
  genderAllowed?: 'ALL' | 'FEMALE_ONLY' | 'MALE_ONLY';
  allowedStates?: string[]; // e.g. ["Tamil Nadu", "All India"]
  allowedEducationLevels?: EducationLevel[];
  allowedCourses?: string[];
  minMarksPercentage?: number;
  minCutoffMarks?: number; // e.g. 190.0
  maxFamilyIncome?: number; // In INR
  allowedCategories?: SocialCategory[];
  requiresGovtSchool?: boolean;
  requiresFirstGraduate?: boolean;
  requiresPwd?: boolean;
  requiresHosteller?: boolean;
  allowedInstitutions?: string[]; // IDs or names of specific colleges
  specialNotes?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  providerId: string;
  provider: Provider;
  governmentLevel: GovernmentLevel;
  type: OpportunityType;
  categoryTags: string[];
  description: string;
  eligibilitySummary: string;
  benefitsDescription: string;
  financialAmount?: number; // in INR where applicable
  deadline: string; // YYYY-MM-DD or "Ongoing"
  isOngoing?: boolean;
  officialWebsiteUrl?: string;
  officialInfoUrl: string;
  officialApplyUrl: string;
  applicationMethod?: string;
  applicationProcess: string[];
  requiredDocuments: string[];
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
  contactHelpline?: string;
  criteria?: OpportunityCriteria;
  featured?: boolean;
  minCutoffMarks?: number;
  // College Scholarship specific fields
  institutionId?: string;
  institutionName?: string;
  tuitionFeeSupport?: boolean;
  hostelSupport?: boolean;
  // Foundation / NGO specific fields
  foundationId?: string;
  ngoId?: string;
  programType?: string;
}

export interface EligibilityEvaluationResult {
  opportunity: Opportunity;
  matchPercentage: number;
  status: 'ELIGIBLE' | 'PARTIAL' | 'NOT_ELIGIBLE';
  reasonsMatched: string[];
  missingCriteria: string[];
  notes: string;
}

export interface FutureTalk {
  id: string;
  title: string;
  speakerName: string;
  speakerRole: string;
  speakerCompany: string;
  speakerAvatarUrl: string;
  topicDomain: string;
  date: string;
  time: string;
  durationMinutes: number;
  description: string;
  maxParticipants: number;
  registeredCount: number;
  meetingLink?: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
}

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  isCompleted?: boolean;
  videoUrl?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  thumbnailUrl: string;
  instructorName: string;
  instructorRole: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  durationHours: number;
  category: string;
  description: string;
  whatYouWillLearn: string[];
  modulesCount: number;
  lessonsCount: number;
  isPremium?: boolean;
  rating: number;
  enrolledStudents: number;
}

export interface CareerRoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
  skills: string[];
  estimatedWeeks: number;
  recommendedResources: string[];
  completed?: boolean;
}

export interface CareerRoadmap {
  id: string;
  title: string;
  slug: string;
  domain: string;
  icon: string;
  description: string;
  averageSalaryRange: string;
  jobOutlook: string;
  steps: CareerRoadmapStep[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'OPPORTUNITY_DEADLINE' | 'COUNSELLING' | 'FUTURE_TALK' | 'SYSTEM';
  timestamp: string;
  isRead: boolean;
  link?: string;
}
