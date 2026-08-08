import React, { useState } from 'react';
import { WORK_PROJECTS } from '../data/initialData';
import { ServiceCategory, WorkProject } from '../types';
import { ExternalLink, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';

export const Work: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);

  const filteredProjects = filter === 'all' 
    ? WORK_PROJECTS 
    : WORK_PROJECTS.filter(p => p.category === filter);

  return (
    <div className="space-y-16 pb-16 pt-8">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Proven Client & Student Case Studies
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Portfolio & Case Studies
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Explore production software systems, machine learning pipelines, design systems, and QA automation suites engineered by Shringaara Academy.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'data-science', label: 'Data Science' },
            { id: 'coding', label: 'Development' },
            { id: 'designing', label: 'UI/UX Design' },
            { id: 'qa', label: 'QA Automation' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map(project => (
            <div 
              key={project.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 bg-slate-950 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/30">
                      {project.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-xs font-semibold text-slate-400">{project.client}</div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">{project.impact}</span>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{selectedProject.client}</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedProject.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400 mb-1">The Challenge</h4>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800">{selectedProject.caseStudy.challenge}</p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-sky-400 mb-1">The Solution</h4>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800">{selectedProject.caseStudy.solution}</p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400 mb-2">Key Measurable Results</h4>
                <ul className="space-y-2">
                  {selectedProject.caseStudy.results.map((res, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
