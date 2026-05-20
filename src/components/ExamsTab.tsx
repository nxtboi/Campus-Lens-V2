/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student } from '../types';
import { 
  TrendingUp, 
  HelpCircle, 
  Search, 
  Award,
  ChevronRight,
  TrendingDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ExamsTabProps {
  students: Student[];
}

export default function ExamsTab({ students }: ExamsTabProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Search keyword inside exams tab
  const [examSearch, setExamSearch] = useState('');

  // Class Average score calculation for unit tests
  const calculateClassAverageTests = (): number[] => {
    if (students.length === 0) return [0, 0, 0, 0];
    const test1 = students.reduce((acc, s) => acc + (s.stats.testScores[0] || 0), 0);
    const test2 = students.reduce((acc, s) => acc + (s.stats.testScores[1] || 0), 0);
    const test3 = students.reduce((acc, s) => acc + (s.stats.testScores[2] || 0), 0);
    const test4 = students.reduce((acc, s) => acc + (s.stats.testScores[3] || 0), 0);
    const len = students.length;
    return [
      Math.round(test1 / len),
      Math.round(test2 / len),
      Math.round(test3 / len),
      Math.round(test4 / len)
    ];
  };

  const classAverages = calculateClassAverageTests();

  // Find active selected student
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Map charts data
  const testNames = ['Unit Test 1', 'Unit Test 2', 'Unit Test 3', 'Unit Test 4'];
  const chartData = testNames.map((name, index) => {
    const item: any = {
      name,
      ClassAverage: classAverages[index]
    };
    if (activeStudent) {
      item[`${activeStudent.name}'s Score`] = activeStudent.stats.testScores[index] !== undefined 
        ? activeStudent.stats.testScores[index] 
        : 0;
    }
    return item;
  });

  // Filter students showing test summaries
  const searchLower = examSearch.toLowerCase();
  const testDirectory = students.filter(s => 
    s.name.toLowerCase().includes(searchLower) || 
    String(s.rollNumber).includes(searchLower)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl text-gray-900 tracking-tight" id="exams-heading">Unit Exams & Assessments Deck</h2>
          <p className="text-gray-500 text-sm">Review performance grids across periodic tests and trace student-by-student progress timelines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trajectory Analyzer Column (Chart) */}
        <div id="exams-chart-card" className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h4 className="font-bold text-gray-950 tracking-tight">Student-By-Student Progress Overlay</h4>
              <p className="text-xs text-gray-500">Isolate individual trajectory against class cohort averages</p>
            </div>
            
            {/* Student selection dropdown for graph */}
            <div className="w-54" id="student-overlay-dropdown">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-xl px-3 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">-- Active Comparer --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (Roll {s.rollNumber})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-68 w-full my-1">
            {activeStudent ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  {/* Class average line */}
                  <Line name="Class Cohort Average" type="monotone" dataKey="ClassAverage" stroke="#94a3b8" strokeWidth={2.5} activeDot={{ r: 5 }} />
                  {/* Selected student line */}
                  <Line 
                    name={`${activeStudent.name}'s Profile`}
                    type="monotone" 
                    dataKey={`${activeStudent.name}'s Score`} 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    activeDot={{ r: 7 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                Select a candidate from comparison box to plot trajectory.
              </div>
            )}
          </div>

          {activeStudent && (
            <div className="p-4.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100/70 text-indigo-700 rounded-xl">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-950 block">Assessment Target: {activeStudent.name}</span>
                  <span className="text-[11px] text-indigo-700 font-semibold">{activeStudent.branch} (Term {activeStudent.semester})</span>
                </div>
              </div>

              {/* Dynamic trajectory comparison indicator */}
              <div className="flex items-center space-x-4 pr-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Exam Average</span>
                  <p className="text-sm font-black text-gray-900">
                    {Math.round(activeStudent.stats.testScores.reduce((a, b) => a + b, 0) / activeStudent.stats.testScores.length)}%
                  </p>
                </div>
                <div className="h-8 w-px bg-indigo-200" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">vs Cohort Avg</span>
                  <div className="flex items-center space-x-1">
                    {Math.round(activeStudent.stats.testScores.reduce((a, b) => a + b, 0) / activeStudent.stats.testScores.length) >= 70 ? (
                      <span className="text-emerald-600 font-extrabold text-sm flex items-center">
                        <TrendingUp className="h-4 w-4 mr-0.5" /> Outperforming
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold text-xs flex items-center">
                        <TrendingDown className="h-4 w-4 mr-0.5" /> Under Threshold
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Static high performers badge */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-indigo-600 mb-1">
              <Award className="h-5 w-5" />
              <h4 className="font-bold text-gray-950 tracking-tight">Top Academic Merit</h4>
            </div>
            <p className="text-xs text-gray-500">Student tracking codes carrying peak exam parameters</p>
          </div>

          <div className="my-4 space-y-3">
            {students.filter(s => s.riskScore < 20).slice(0, 3).map((stud, idx) => {
              const avg = Math.round(stud.stats.testScores.reduce((a,b)=>a+b,0)/stud.stats.testScores.length);
              return (
                <div key={stud.id} className="p-3 border border-indigo-100 bg-indigo-50/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-sm text-gray-950 block">{stud.name}</span>
                      <span className="text-[10px] font-semibold text-gray-400 block">{stud.branch}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-indigo-700 block">{avg}%</span>
                    <span className="text-[10px] text-gray-400 font-medium">Exam Avg</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-gray-100 text-xs text-gray-500">
            <span>Global Class Exam Average:</span>
            <span className="font-bold text-gray-900">{Math.round(classAverages.reduce((a,b)=>a+b,0)/4)}%</span>
          </div>
        </div>
      </div>

      {/* Roster list focusing only on unit exams metadata */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden" id="exams-table-panel">
        <div className="p-4.5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-bold text-gray-900 tracking-tight">Exams Matrix Directory</h4>
            <p className="text-xs text-gray-500">Trace point-by-point unit assessments and evaluations</p>
          </div>
          <div className="w-54 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={examSearch}
              onChange={(e) => setExamSearch(e.target.value)}
              className="w-full h-9 pl-9.5 pr-4 border border-gray-200 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-3xl text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Student Information</th>
                <th className="py-4 px-4 text-center">Unit Test 1</th>
                <th className="py-4 px-4 text-center">Unit Test 2</th>
                <th className="py-4 px-4 text-center">Unit Test 3</th>
                <th className="py-4 px-4 text-center">Unit Test 4</th>
                <th className="py-4 px-4 text-center">Continuous Eval (/50)</th>
                <th className="py-4 px-6 text-center">Exam Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {testDirectory.map((student) => {
                const examsAvg = Math.round((student.stats.testScores || []).reduce((a,b) => a+b, 0) / 4);
                const continuousScore = student.stats.assignmentMarks + student.stats.internalMarks;
                return (
                  <tr key={student.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-gray-950 block">{student.name}</span>
                        <span className="text-[11px] font-semibold text-gray-400 block">{student.branch} • Roll {student.rollNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-semibold">{student.stats.testScores[0] || 0}%</td>
                    <td className="py-4 px-4 text-center font-semibold">{student.stats.testScores[1] || 0}%</td>
                    <td className="py-4 px-4 text-center font-semibold">{student.stats.testScores[2] || 0}%</td>
                    <td className="py-4 px-4 text-center font-semibold">{student.stats.testScores[3] || 0}%</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        continuousScore >= 38 ? 'bg-emerald-50 text-emerald-700' :
                        continuousScore >= 25 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {continuousScore}/50
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-black text-sm ${
                        examsAvg >= 75 ? 'text-emerald-600' :
                        examsAvg >= 50 ? 'text-gray-900' : 'text-red-500'
                      }`}>
                        {examsAvg}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
