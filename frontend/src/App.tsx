import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/routes/ProtectedRoute';

// Public & Discovery Pages
import { LandingPage } from './pages/public/LandingPage';
import { OpportunitiesPage } from './pages/public/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/public/OpportunityDetailPage';
import { CollegeScholarshipsPage } from './pages/public/CollegeScholarshipsPage';
import { FoundationsPage } from './pages/public/FoundationsPage';
import { FoundationDetailPage } from './pages/public/FoundationDetailPage';
import { NGOsPage } from './pages/public/NGOsPage';
import { NGODetailPage } from './pages/public/NGODetailPage';
import { CareerPage } from './pages/public/CareerPage';
import { SchemesPage } from './pages/public/SchemesPage';
import { FutureTalksPage } from './pages/public/FutureTalksPage';
import { LearningPage } from './pages/public/LearningPage';
import { MentorsPage } from './pages/public/MentorsPage';
import { MeetingsPage } from './pages/public/MeetingsPage';
import { MeetingRoomPage } from './pages/public/MeetingRoomPage';
import { PricingPage } from './pages/public/PricingPage';
import { AboutPage } from './pages/public/AboutPage';

// Authentication Pages
import { LoginPage } from './pages/public/LoginPage';
import { StudentRegisterPage } from './pages/public/StudentRegisterPage';
import { MentorRegisterPage } from './pages/public/MentorRegisterPage';

// Protected Workspace Dashboards
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { MentorDashboardPage } from './pages/mentor/MentorDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOpportunitiesPage } from './pages/admin/AdminOpportunitiesPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Fullscreen WebRTC Meeting Room */}
            <Route path="/meetings/:roomId/room" element={<MeetingRoomPage />} />

            {/* Main Application Layout */}
            <Route element={<PublicLayout />}>
              {/* 1. Common Public Discovery */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/opportunities" element={<OpportunitiesPage />} />
              <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
              <Route path="/colleges" element={<CollegeScholarshipsPage />} />
              <Route path="/foundations" element={<FoundationsPage />} />
              <Route path="/foundations/:id" element={<FoundationDetailPage />} />
              <Route path="/ngos" element={<NGOsPage />} />
              <Route path="/ngos/:id" element={<NGODetailPage />} />
              <Route path="/schemes" element={<SchemesPage />} />
              <Route path="/career" element={<CareerPage />} />
              <Route path="/mentors" element={<MentorsPage />} />
              <Route path="/meetings" element={<MeetingsPage />} />
              <Route path="/sessions" element={<MeetingsPage />} />
              <Route path="/future-talks" element={<FutureTalksPage />} />
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* 2. Unified Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Navigate to="/register/student" replace />} />
              <Route path="/register/student" element={<StudentRegisterPage />} />
              <Route path="/register/mentor" element={<MentorRegisterPage />} />
              {/* Legacy aliases */}
              <Route path="/register-mentor" element={<Navigate to="/register/mentor" replace />} />
              <Route path="/mentor/register" element={<Navigate to="/register/mentor" replace />} />
              <Route path="/mentor/login" element={<Navigate to="/login" replace />} />
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />

              {/* 3. Protected Student-Only Workspace */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/opportunities"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <OpportunitiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/scholarships"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <OpportunitiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/eligibility"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <OpportunitiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/counselling"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <MentorsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/meetings"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <MeetingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/sessions"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <MeetingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/courses"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <LearningPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/messages"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/saved"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/notifications"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
              {/* Legacy /dashboard redirect */}
              <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />

              {/* 4. Protected Mentor-Only Workspace */}
              <Route
                path="/mentor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/profile"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/availability"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/counselling"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/meetings"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/courses"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <LearningPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/messages"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/students"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/sessions"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 5. Protected Admin-Only Workspace */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/mentors"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/meetings"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/opportunities"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminOpportunitiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/future-talks"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
