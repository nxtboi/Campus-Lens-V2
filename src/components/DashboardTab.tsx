/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Student } from '../types';
import { 
  Users, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle, 
  Percent, 
  ShieldAlert, 
  ArrowUpRight, 
  Activity, 
  TrendingUp,
  BrainCircuit,
  CornerDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts';

interface DashboardTabProps {
  students: Student[];
  onSelectStudentForIntervention: (studentId: string) => void;
}

export default function DashboardTab({ students, onSelectStudentForIntervention }: DashboardTabProps) {
  // --- Calculate Metrics ---
  const totalStudents = students.length;
  
  const highRiskStudents = students.filter(s => s.riskScore >= 70);
  const mediumRiskStudents = students.filter(s => s.riskScore >= 35 && s.riskScore < 70);
  const lowRiskStudents = students.filter(s => s.riskScore < 35);
  
  const highRiskCount = highRiskStudents.length;
  const mediumRiskCount = mediumRiskStudents.length;
  const lowRiskCount = lowRiskStudents.length;
  
  const averageAttendance = totalStudents > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.stats.attendance, 0) / totalStudents) 
    : 0;

  const averageInternalMarks = totalStudents > 0
    ? Number((students.reduce((acc, s) => acc + s.stats.internalMarks, 0) / totalStudents).toFixed(1))
    : 0;

  const averageAssignmentCompletion = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + s.stats.assignmentCompletion, 0) / totalStudents)
    : 0;

  // --- Prepare chart datasets ---
  
  // 1. Attendance Chart - student list
  const attendanceChartData = students.map(s => ({
    name: s.name.split(' ')[0], // only first name
    attendance: s.stats.attendance,
    riskScore: s.riskScore
  }));

  // 2. Average Exams Progression Line Chart
  // We compute class average for test 1, test 2, test 3, test 4
  const examsProgression = [
    { index: 1, name: 'Unit Test 1', average: 0, highRiskAvg: 0, lowRiskAvg: 0 },
    { index: 2, name: 'Unit Test 2', average: 0, highRiskAvg: 0, lowRiskAvg: 0 },
    { index: 3, name: 'Unit Test 3', average: 0, highRiskAvg: 0, lowRiskAvg: 0 },
    { index: 4, name: 'Unit Test 4', average: 0, highRiskAvg: 0, lowRiskAvg: 0 },
  ];

  for (let t = 0; t < 4; t++) {
    let allSum = 0;
    let highSum = 0;
    let highCount = 0;
    let lowSum = 0;
    let lowCount = 0;

    students.forEach(s => {
      const score = s.stats.testScores[t] || 0;
      allSum += score;
      if (s.riskScore >= 70) {
        highSum += score;
        highCount++;
      } else {
        lowSum += score;
        lowCount++;
      }
    });

    examsProgression[t].average = totalStudents > 0 ? Math.round(allSum / totalStudents) : 0;
    examsProgression[t].highRiskAvg = highCount > 0 ? Math.round(highSum / highCount) : 0;
    examsProgression[t].lowRiskAvg = lowCount > 0 ? Math.round(lowSum / lowCount) : 0;
  }

  // 3. Branch distribution stats
  const branches = Array.from(new Set(students.map(s => s.branch)));
  const branchRiskData = branches.map(branch => {
    const list = students.filter(s => s.branch === branch);
    const avgRisk = Math.round(list.reduce((acc, s) => acc + s.riskScore, 0) / list.length);
    const avgAttendance = Math.round(list.reduce((acc, s) => acc + s.stats.attendance, 0) / list.length);
    return {
      branch,
      avgRisk,
      avgAttendance
    };
  });

  // 4. Pie chart distribution
  const pieData = [
    { name: 'High Risk (>=70)', value: highRiskCount, color: '#ef4444' },
    { name: 'Medium Risk (35-69)', value: mediumRiskCount, color: '#f97316' },
    { name: 'Low Risk (<35)', value: lowRiskCount, color: '#10b981' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-panel">
        
        {/* Total Students */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Enrolled</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalStudents}</h3>
            <p className="text-[11px] text-gray-400 font-medium flex items-center">
              Active candidates in tracker
            </p>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* High Risk Candidates */}
        <div className="bg-red-50/55 border border-red-100 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-red-700 text-xs font-semibold uppercase tracking-wider">High Risk Count</p>
            <h3 className="text-3xl font-bold text-red-600">{highRiskCount}</h3>
            <p className="text-[11px] text-red-500 font-medium">
              Requires immediate action plans
            </p>
          </div>
          <div className="p-3 bg-red-100/80 text-red-600 rounded-xl">
            <AlertOctagon className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Medium Risk Candidates */}
        <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-amber-700 text-xs font-semibold uppercase tracking-wider">Medium Risk Count</p>
            <h3 className="text-3xl font-bold text-amber-600">{mediumRiskCount}</h3>
            <p className="text-[11px] text-amber-500 font-medium">
              Needs routine checks & support
            </p>
          </div>
          <div className="p-3 bg-amber-100/80 text-amber-600 rounded-xl">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        {/* Attendance Index */}
        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wider font-semibold">Avg Attendance</p>
            <h3 className="text-3xl font-bold text-emerald-600">{averageAttendance}%</h3>
            <p className="text-[11px] text-emerald-500 font-medium">
              Continuous tracking threshold
            </p>
          </div>
          <div className="p-3 bg-emerald-100/80 text-emerald-600 rounded-xl">
            <Percent className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Grid: Charts View Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Attendance Distribution BarChart (2 Cols on large screens) */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-gray-900 tracking-tight">Attendance vs Risk Metrics</h4>
              <p className="text-xs text-gray-500">Student-by-student attendance comparison matched against overall risk factors</p>
            </div>
            <span className="p-1.5 bg-gray-50 rounded text-gray-400">
              <Activity className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '500' }} />
                <Bar name="Class Attendance" dataKey="attendance" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar name="Synthesized Risk Score" dataKey="riskScore" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie distribution analysis card */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900 tracking-tight">Risk Distribution Index</h4>
            <p className="text-xs text-gray-500">Classification of high, medium, and low-risk candidates</p>
          </div>
          <div className="h-48 flex items-center justify-center relative my-3">
            {totalStudents === 0 ? (
              <span className="text-gray-400 text-xs">No data elements load</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute text-center">
              <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">High Risk</span>
              <span className="text-2xl font-black text-red-500">{((highRiskCount / (totalStudents || 1)) * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="space-y-1.5 text-xs font-semibold text-gray-600">
            <div className="flex justify-between items-center p-1 px-2 border border-emerald-100 rounded-lg bg-emerald-50/20">
              <span className="flex items-center space-x-1.5 text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Low Risk (&lt;35)</span>
              </span>
              <span>{lowRiskCount} stds ({totalStudents > 0 ? Math.round(lowRiskCount/totalStudents*100) : 0}%)</span>
            </div>
            <div className="flex justify-between items-center p-1 px-2 border border-amber-100 rounded-lg bg-amber-50/20">
              <span className="flex items-center space-x-1.5 text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Medium Risk (35-69)</span>
              </span>
              <span>{mediumRiskCount} stds ({totalStudents > 0 ? Math.round(mediumRiskCount/totalStudents*100) : 0}%)</span>
            </div>
            <div className="flex justify-between items-center p-1 px-2 border border-red-100 rounded-lg bg-red-50/20">
              <span className="flex items-center space-x-1.5 text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span>High Risk (&gt;=70)</span>
              </span>
              <span>{highRiskCount} stds ({totalStudents > 0 ? Math.round(highRiskCount/totalStudents*100) : 0}%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid Tab 2: Exams progression & Top Intervention targets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Exams Progression over time */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-gray-900 tracking-tight">Average Test Score Evolution</h4>
              <p className="text-xs text-gray-500">Timeline performance trend highlighting the gap between high-risk and low-risk groups</p>
            </div>
            <span className="p-1.5 bg-gray-50 rounded text-gray-400">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={examsProgression} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend iconType="line" wrapperStyle={{ fontSize: '11px', fontWeight: '500' }} />
                <Line name="Cohort Average Score" type="monotone" dataKey="average" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line name="High Risk Segment Avg" type="monotone" dataKey="highRiskAvg" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" />
                <Line name="Low Risk Segment Avg" type="monotone" dataKey="lowRiskAvg" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Risk Task Monitor Panel */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-red-600 mb-1">
              <BrainCircuit className="h-4.5 w-4.5" />
              <h4 className="font-bold text-gray-900 tracking-tight">Active Critical Targets</h4>
            </div>
            <p className="text-xs text-gray-500">Students requiring urgent diagnostic counselor action plans</p>
          </div>
          
          <div className="space-y-3 my-4 overflow-y-auto max-h-56 pr-1">
            {highRiskStudents.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-gray-900">All student status clean</p>
                <p className="text-[11px] text-gray-400">Zero students currently flagged high risk</p>
              </div>
            ) : (
              highRiskStudents.map((stud) => (
                <div 
                  key={stud.id}
                  className="p-3 border border-red-100 bg-red-50/20 rounded-xl flex items-center justify-between hover:bg-red-50/40 transition duration-150"
                >
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">{stud.name}</span>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 mt-0.5 inline-block">
                      {stud.branch} • Roll {stud.rollNumber}
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-red-600">
                      <CornerDownRight className="h-3 w-3" />
                      <span>{stud.stats.attendance}% Attendance • Internals: {stud.stats.internalMarks}/25</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectStudentForIntervention(stud.id)}
                    className="p-1 px-2.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition"
                  >
                    Intervene
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping shrink-0" />
            <p className="text-[10px] text-indigo-800 font-semibold leading-relaxed">
              New predictions require 24h cycle sync. You can run immediate intervention simulations via Gemini on the AI Tab.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
