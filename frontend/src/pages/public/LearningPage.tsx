import React, { useState } from 'react';
import { MOCK_COURSES } from '../../data/mockData';
import { Course } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const LearningPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    const saved = localStorage.getItem('edunova_enrolled_courses');
    return saved ? JSON.parse(saved) : ['course-python-foundations'];
  });

  const handleEnroll = (courseId: string) => {
    const next = [...enrolledCourses, courseId];
    setEnrolledCourses(next);
    localStorage.setItem('edunova_enrolled_courses', JSON.stringify(next));
    setSelectedCourse(null);
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="cyan" size="md">
          📚 Self-Paced Skill Development
        </Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
          Practical Tech & Career Courses
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Master in-demand skills in Python, Java, SQL, Full-Stack Development, and AI. Built specifically for college students preparing for campus placements and technical interviews.
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_COURSES.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.id);
          return (
            <Card key={course.id} className="p-0 overflow-hidden flex flex-col justify-between group">
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-surface-container">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/90 text-white backdrop-blur-md">
                      {course.level}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-secondary/90 text-white backdrop-blur-md">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-outline font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                      {course.durationHours} Hours • {course.lessonsCount} Lessons
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <span className="material-symbols-outlined text-[16px] filled">star</span>
                      {course.rating} ({course.enrolledStudents.toLocaleString()} enrolled)
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-medium text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">person</span>
                    <span>Instructor: <strong>{course.instructorName}</strong> ({course.instructorRole})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-surface-variant/60 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCourse(course)}
                  className="flex-1"
                >
                  View Curriculum
                </Button>
                <Button
                  size="sm"
                  variant={isEnrolled ? 'secondary' : 'primary'}
                  onClick={() => handleEnroll(course.id)}
                  className="flex-1"
                >
                  {isEnrolled ? 'Enrolled (Resume)' : 'Enroll Free'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Curriculum Modal */}
      <Modal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse?.title || 'Course Details'}
        maxWidth="lg"
      >
        {selectedCourse && (
          <div className="space-y-6">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {selectedCourse.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                What You Will Learn
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCourse.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-on-surface font-medium">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px] filled mt-0.5">check_circle</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                Curriculum Structure ({selectedCourse.modulesCount} Modules)
              </h4>
              <div className="space-y-2 text-xs">
                {['Module 1: Foundations & Core Concepts', 'Module 2: Real-World Hands-on Labs', 'Module 3: End-to-End Industry Project', 'Module 4: Placement Interview Questions'].map((mod, mIdx) => (
                  <div key={mIdx} className="p-3 rounded-lg bg-surface-container-low border border-surface-variant flex items-center justify-between font-semibold text-on-surface">
                    <span>{mod}</span>
                    <span className="text-outline">~{Math.round(selectedCourse.durationHours / 4)} hrs</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="md"
              onClick={() => handleEnroll(selectedCourse.id)}
              className="w-full justify-center"
            >
              Enroll in Course for Free
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
