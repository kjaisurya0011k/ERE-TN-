import React, { useState } from 'react';
import { MOCK_ROADMAPS } from '../../data/mockData';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const CareerPage: React.FC = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState(MOCK_ROADMAPS[0]);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    const saved = localStorage.getItem('edunova_completed_steps');
    return saved ? JSON.parse(saved) : [1];
  });

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(stepNum)
        ? prev.filter((s) => s !== stepNum)
        : [...prev, stepNum];
      localStorage.setItem('edunova_completed_steps', JSON.stringify(next));
      return next;
    });
  };

  const progressPercentage = Math.round(
    (completedSteps.filter((s) => s <= selectedRoadmap.steps.length).length /
      selectedRoadmap.steps.length) *
      100
  );

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary" size="md">
          🧭 Career Guidance & Structured Pathways
        </Badge>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
          Explore Future Careers & Visual Roadmaps
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Follow step-by-step career pathways curated by industry leaders. Track your skill progress, build real projects, and prepare for high-impact roles.
        </p>
      </div>

      {/* Roadmap Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {MOCK_ROADMAPS.map((roadmap) => (
          <button
            key={roadmap.id}
            onClick={() => setSelectedRoadmap(roadmap)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs md:text-sm transition-all ${
              selectedRoadmap.id === roadmap.id
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-surface-container-lowest border border-surface-variant text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{roadmap.icon}</span>
            <span>{roadmap.title}</span>
          </button>
        ))}
      </div>

      {/* Main Selected Roadmap Interface */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-10 border border-surface-variant shadow-[0px_4px_20px_rgba(26,35,126,0.06)] space-y-8">
        {/* Roadmap Overview Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-surface-variant">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-primary-fixed text-primary uppercase">
                {selectedRoadmap.domain}
              </span>
              <span className="text-xs text-on-surface-variant font-semibold">
                Est. {selectedRoadmap.steps.reduce((a, b) => a + b.estimatedWeeks, 0)} Weeks Total
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">
              {selectedRoadmap.title}
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              {selectedRoadmap.description}
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant space-y-2 lg:min-w-[280px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-outline font-semibold">Average Salary:</span>
              <strong className="text-primary font-bold">{selectedRoadmap.averageSalaryRange}</strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-outline font-semibold">Job Market:</span>
              <strong className="text-emerald-700 font-bold">High Demand</strong>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-primary">Your Progress</span>
                <span className="text-secondary">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Interactive Pathway */}
        <div className="space-y-6">
          <h3 className="font-headline-sm text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">alt_route</span>
            Step-by-Step Learning Pathway
          </h3>

          <div className="space-y-4">
            {selectedRoadmap.steps.map((step) => {
              const isCompleted = completedSteps.includes(step.stepNumber);
              return (
                <div
                  key={step.stepNumber}
                  className={`p-5 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-surface-container-lowest border-surface-variant hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => toggleStep(step.stepNumber)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-surface-container text-on-surface-variant border border-surface-variant hover:border-primary'
                        }`}
                        aria-label="Toggle completion"
                      >
                        {isCompleted ? (
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        ) : (
                          step.stepNumber
                        )}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className={`text-base font-bold ${isCompleted ? 'text-emerald-900 line-through' : 'text-primary'}`}>
                            {step.title}
                          </h4>
                          <span className="text-[11px] font-semibold text-outline">
                            (~{step.estimatedWeeks} weeks)
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {step.description}
                        </p>
                        
                        {/* Skills Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {step.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface border border-surface-variant"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStep(step.stepNumber)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-surface hover:bg-surface-container text-on-surface-variant border-surface-variant'
                      }`}
                    >
                      {isCompleted ? 'Completed ✓' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
