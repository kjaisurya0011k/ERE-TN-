import React, { useState } from 'react';
import { Compass, CheckCircle2, Bookmark, BookmarkCheck, ArrowRight, Sparkles } from 'lucide-react';
import { novaApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export interface RoadmapStage {
  stageNumber: number;
  title: string;
  description: string;
  skills: string[];
  keyMilestone: string;
}

export interface RoadmapData {
  goal: string;
  estimatedMonths: string;
  stages: RoadmapStage[];
}

interface RoadmapWidgetProps {
  roadmap: RoadmapData;
}

export const RoadmapWidget: React.FC<RoadmapWidgetProps> = ({ roadmap }) => {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveRoadmap = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save this roadmap to your Student Dashboard.');
      return;
    }
    try {
      setSaving(true);
      await novaApi.saveRoadmap({
        title: `${roadmap.goal} Roadmap`,
        goal: roadmap.goal,
        roadmapJson: JSON.stringify(roadmap),
      });
      setSaved(true);
    } catch (err: any) {
      alert(err.message || 'Failed to save roadmap');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="my-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-5 text-white shadow-xl border border-indigo-500/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" /> Career Roadmap
          </div>
          <h4 className="text-base font-black text-white">{roadmap.goal}</h4>
          <span className="text-xs text-slate-300">Estimated Duration: {roadmap.estimatedMonths || '6–9 Months'}</span>
        </div>

        <button
          onClick={handleSaveRoadmap}
          disabled={saved || saving}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            saved
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95'
          }`}
        >
          {saved ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-emerald-400" /> Saved to Dashboard
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Roadmap'}
            </>
          )}
        </button>
      </div>

      {/* Stage Stepper */}
      <div className="mt-4 space-y-3">
        {roadmap.stages.map((stage) => (
          <div
            key={stage.stageNumber}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center text-xs font-black shrink-0">
              {stage.stageNumber}
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="font-bold text-xs text-white">{stage.title}</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{stage.description}</p>
              
              {stage.skills && stage.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {stage.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/20 text-indigo-200 text-[10px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {stage.keyMilestone && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-semibold pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Milestone: {stage.keyMilestone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RoadmapWidget;
