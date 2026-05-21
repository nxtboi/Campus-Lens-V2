/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, ResourceItem } from '../types';
import { api } from '../api';
import { 
  Brain, 
  Search, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle, 
  User, 
  FileText, 
  Mail, 
  Play, 
  Loader2, 
  AlertTriangle, 
  Compass, 
  Calendar,
  Sparkles,
  RefreshCw,
  Cpu,
  BookOpen
} from 'lucide-react';

interface InterventionTabProps {
  students: Student[];
  onUpdateStudent: (id: string, updatedPayload: Partial<Student>) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
}

export default function InterventionTab({
  students,
  onUpdateStudent,
  selectedStudentId,
  setSelectedStudentId
}: InterventionTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Predict processing state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');

  // Local state to track interactive action plan checkbox index states
  const [checkedActionItems, setCheckedActionItems] = useState<Record<string, Record<number, boolean>>>({});

  // Side effect: default select the first student if none selected
  useEffect(() => {
    if (!selectedStudentId && students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId, setSelectedStudentId]);

  // Handle checking/unchecking of prioritized action list items
  const handleToggleCheck = (studentId: string, itemIdx: number) => {
    setCheckedActionItems(prev => {
      const studentChecks = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...studentChecks,
          [itemIdx]: !studentChecks[itemIdx]
        }
      };
    });
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(s.rollNumber).includes(searchQuery.toLowerCase())
  );

  const activeStudent = students.find(s => s.id === selectedStudentId);

  // Run deep AI prediction via Express handler
  const handleRunAIEngine = async () => {
    if (!activeStudent) return;
    setIsAnalyzing(true);
    setAnalysisStatus('Assembling student performance dimensions...');
    
    try {
      setAnalysisStatus('Connecting to Gemini-3.5-flash gateway...');
      const result = await api.predictTrajectory(activeStudent);
      
      const { riskScore, summary, actionItems, focusAreas, predictedOutcome, recommendedResources } = result.data;
      
      setAnalysisStatus('Hydrating results into local CSV databases...');

      // Trigger standard model update on parent state
      onUpdateStudent(activeStudent.id, {
        riskScore: Number(riskScore),
        interventionPlan: {
          summary,
          actionItems,
          focusAreas,
          predictedOutcome,
          recommendedResources
        }
      });

      // Reset checked indexes for this student
      setCheckedActionItems(prev => ({
        ...prev,
        [activeStudent.id]: {}
      }));

    } catch (err) {
      console.error("Diagnosis error:", err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStatus('');
    }
  };

  // Helper resource color picker & icon
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4 text-sky-600 shrink-0" />;
      case 'contact':
        return <Mail className="h-4 w-4 text-amber-600 shrink-0" />;
      case 'article':
      default:
        return <BookOpen className="h-4 w-4 text-indigo-600 shrink-0" />;
    }
  };

  const getResourceBg = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-sky-50 border-sky-100/80 hover:bg-sky-100/50';
      case 'contact':
        return 'bg-amber-50 border-amber-100/80 hover:bg-amber-100/50';
      case 'article':
      default:
        return 'bg-indigo-50 border-indigo-100/80 hover:bg-indigo-100/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl text-gray-900 tracking-tight flex items-center space-x-2" id="planner-heading">
            <Cpu className="h-6 w-6 text-indigo-600 mr-1.5" />
            <span>AI Intervention Planner Dashboard</span>
          </h2>
          <p className="text-gray-500 text-sm">Deploy server-side algorithms to synthesize student risk vectors and trace active path outcomes</p>
        </div>
      </div>

      {/* Main planner board dual pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="planner-dual-pane">
        
        {/* LEFT PANE: Directory sidebar Selection (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[650px]" id="planner-sidebar">
          {/* Sidebar Search */}
          <div className="p-4 border-b border-gray-100">
            <span className="text-xs uppercase font-extrabold text-gray-400 tracking-wider mb-2.5 block">Selection Roster</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Find roll, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 border border-gray-200 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Roster Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 scrollbar-none">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No matching student profile.
              </div>
            ) : (
              filteredStudents.map((stud) => {
                const isActive = stud.id === selectedStudentId;
                const isCritical = stud.riskScore >= 70;
                const isWarning = stud.riskScore >= 35 && stud.riskScore < 70;
                
                return (
                  <button
                    key={stud.id}
                    onClick={() => setSelectedStudentId(stud.id)}
                    className={`
                      w-full p-4 text-left transition flex items-center justify-between cursor-pointer
                      ${isActive ? 'bg-indigo-50/55 border-r-4 border-indigo-600' : 'hover:bg-gray-50/60'}
                    `}
                  >
                    <div>
                      <span className="font-bold text-sm text-gray-950 block">{stud.name}</span>
                      <span className="text-[11px] font-semibold text-gray-400 mt-0.5 inline-block">
                        Roll: {stud.rollNumber} • Semester {stud.semester}
                      </span>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">
                        {stud.branch}
                      </p>
                    </div>

                    {/* Compact Risk Pill */}
                    <div className="text-right">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isCritical ? 'bg-red-500 animate-pulse' :
                        isWarning ? 'bg-orange-400' : 'bg-emerald-400'
                      }`} />
                      <span className="text-xs font-black text-gray-900 block mt-0.5">{stud.riskScore}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE: Academic Diagnostic Planner Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-5" id="planner-detail-pane">
          {activeStudent ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-6 space-y-6">
              
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg select-none">
                    {activeStudent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-extrabold text-xl text-gray-900 tracking-tight">{activeStudent.name}</h3>
                    </div>
                    <p className="text-xs font-bold text-gray-500 mt-0.5 bg-gray-50/80 px-2 py-0.5 rounded-md inline-block">
                      Roll {activeStudent.rollNumber} • {activeStudent.branch} • Semester {activeStudent.semester}
                    </p>
                  </div>
                </div>

                {/* Live Analysis Engine Button */}
                <button
                  onClick={handleRunAIEngine}
                  disabled={isAnalyzing}
                  className="px-4.5 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl inline-flex items-center justify-center space-x-2 transition shadow-md shadow-indigo-100 cursor-pointer text-center"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Shedding Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-white" />
                      <span>Re-Run AI Predict</span>
                    </>
                  )}
                </button>
              </div>

              {/* Loader overlay during AI execution */}
              {isAnalyzing ? (
                <div className="py-24 text-center space-y-4">
                  <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
                  <div>
                    <h5 className="font-bold text-gray-900">CampusLens AI Agent Active</h5>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed font-semibold">
                      {analysisStatus}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Row 1: KPI Meter + Dynamic Summary Box */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                    
                    {/* Gauge/Meter Card */}
                    <div className="md:col-span-4 border border-gray-100 rounded-2xl p-5 flex flex-col justify-between items-center text-center bg-gray-50/30">
                      <div>
                        <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Intervention Risk Vector</span>
                        <div className="relative h-28 w-28 flex items-center justify-center mt-3">
                          <svg className="absolute inset-0 h-full w-full rotate-270" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="#e5e7eb" strokeWidth="9" fill="none" />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="42" 
                              stroke={activeStudent.riskScore >= 70 ? '#f87171' : activeStudent.riskScore >= 35 ? '#fb923c' : '#34d399'} 
                              strokeWidth="9" 
                              fill="none" 
                              strokeDasharray="264"
                              strokeDashoffset={264 - (264 * activeStudent.riskScore) / 100}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="text-center z-10">
                            <span className="text-3xl font-black text-gray-950 block select-none">{activeStudent.riskScore}</span>
                            <span className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider block">Risk Index</span>
                          </div>
                        </div>
                      </div>

                      {/* Diagnostic outcome label */}
                      <span className={`mt-3 w-full py-1 text-center font-bold text-xs rounded-lg select-none capitalize ${
                        activeStudent.riskScore >= 70 ? 'bg-red-50 text-red-700' :
                        activeStudent.riskScore >= 35 ? 'bg-orange-50 text-orange-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {activeStudent.riskScore >= 70 ? 'Critical Severity' :
                         activeStudent.riskScore >= 35 ? 'Attention Advised' : 'Optimal Standing'}
                      </span>
                    </div>

                    {/* Academic summary card */}
                    <div className="md:col-span-8 border border-gray-100 rounded-2xl p-5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Academic Diagnostic Summary</span>
                        <div className="text-sm font-semibold text-gray-700 leading-relaxed">
                          {activeStudent.interventionPlan.summary}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {activeStudent.interventionPlan.focusAreas.map((area, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 transition text-[10px] text-gray-600 font-bold rounded-lg uppercase tracking-wide border border-gray-200"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Checklist Panel */}
                  <div className="border border-gray-100 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2.5">
                      <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Prioritized Action Items Checkpoint</span>
                      <span className="text-[10px] font-extrabold text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                        Check to complete
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {activeStudent.interventionPlan.actionItems.map((item, index) => {
                        const isChecked = checkedActionItems[activeStudent.id]?.[index] || false;
                        return (
                          <label 
                            key={index}
                            className={`
                              flex items-start space-x-3 p-3 border rounded-xl cursor-pointer transition
                              ${isChecked 
                                ? 'bg-gray-50 border-gray-100 text-gray-400 scale-[0.99]' 
                                : 'bg-white border-gray-150 text-gray-700 hover:border-gray-200'}
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleCheck(activeStudent.id, index)}
                              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 shrink-0 transition"
                            />
                            <span className={`text-xs font-semibold leading-relaxed ${isChecked ? 'line-through' : ''}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Predicted Outcome summary */}
                  <div className="border border-indigo-100 bg-indigo-50/15 rounded-2xl p-5 flex items-start space-x-3.5">
                    <Compass className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-indigo-700 tracking-wider block">Plan Predicted Outcome trajectory</span>
                      <p className="text-xs text-indigo-950 font-semibold leading-relaxed mt-1.5">
                        {activeStudent.interventionPlan.predictedOutcome}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Resources list links */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider block">Recommended Diagnostic Materials</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeStudent.interventionPlan.recommendedResources.map((resItem, index) => (
                        <a 
                          key={index}
                          href={resItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            p-3 px-4 border rounded-xl flex items-center justify-between transition group-hover:scale-2
                            ${getResourceBg(resItem.type)}
                          `}
                        >
                          <div className="flex items-center space-x-3 pr-2 overflow-hidden">
                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shrink-0 shadow-2xs">
                              {getResourceIcon(resItem.type)}
                            </div>
                            <div className="overflow-hidden">
                              <span className="font-bold text-xs text-gray-900 block truncate leading-snug">{resItem.title}</span>
                              <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wide mt-0.5">{resItem.type}</span>
                            </div>
                          </div>
                          
                          <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-900 transition shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-xs py-24 text-center">
              <Compass className="h-10 w-10 text-gray-300 mx-auto mb-2 animate-bounce" />
              <p className="text-sm text-gray-500 font-semibold">Select a candidate on selection roster to plot AI diagnostic pathway.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
