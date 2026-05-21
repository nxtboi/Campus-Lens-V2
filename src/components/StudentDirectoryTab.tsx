/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student } from '../types';
import { 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Eye, 
  SlidersHorizontal,
  X,
  Plus,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

interface StudentDirectoryTabProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'riskScore' | 'interventionPlan'>) => void;
  onUpdateStudent: (id: string, updatedPayload: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  onSelectStudentForIntervention: (studentId: string) => void;
}

export default function StudentDirectoryTab({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudentForIntervention
}: StudentDirectoryTabProps) {
  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  // Modals Visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditStudent, setActiveEditStudent] = useState<Student | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formRoll, setFormRoll] = useState('');
  const [formBranch, setFormBranch] = useState('B.Tech CSE Core');
  const [formSemester, setFormSemester] = useState(2);
  const [formAttendance, setFormAttendance] = useState(75);
  const [formInternalMarks, setFormInternalMarks] = useState(15);
  const [formAssignComp, setFormAssignComp] = useState(75);
  const [formAssignMarks, setFormAssignMarks] = useState(15);
  const [formParticipation, setFormParticipation] = useState(6);
  const [formClubActivity, setFormClubActivity] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [formLastLog, setFormLastLog] = useState(2);
  const [formPreviousAttendance, setFormPreviousAttendance] = useState(75);
  const [formPastPerformance, setFormPastPerformance] = useState(7.5);

  // Filter Data
  const filteredStudents = students.filter(student => {
    // Search match
    const lowerSearch = searchQuery.toLowerCase();
    const nameMatch = student.name.toLowerCase().includes(lowerSearch);
    const rollMatch = String(student.rollNumber).includes(lowerSearch);
    const matchesSearch = nameMatch || rollMatch;

    // Branch filter
    const matchesBranch = branchFilter === 'All' || student.branch === branchFilter;

    // Semester filter
    const matchesSemester = semesterFilter === 'All' || String(student.semester) === semesterFilter;

    // Risk Filter
    let matchesRisk = true;
    if (riskFilter === 'High') matchesRisk = student.riskScore >= 70;
    else if (riskFilter === 'Medium') matchesRisk = student.riskScore >= 35 && student.riskScore < 70;
    else if (riskFilter === 'Low') matchesRisk = student.riskScore < 35;

    return matchesSearch && matchesBranch && matchesSemester && matchesRisk;
  });

  // Handle Add Student Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formRoll) return;

    onAddStudent({
      name: formName,
      rollNumber: formRoll.trim(),
      branch: formBranch,
      semester: formSemester,
      stats: {
        attendance: Number(formAttendance),
        internalMarks: Number(formInternalMarks),
        assignmentCompletion: Number(formAssignComp),
        assignmentMarks: Number(formAssignMarks),
        participationScore: Number(formParticipation),
        testScores: [70, 75, 72, 78], // seed defaults
        clubActivity: formClubActivity,
        lastLogDaysAgo: Number(formLastLog),
        previousAttendance: Number(formPreviousAttendance),
        pastPerformance: Number(formPastPerformance)
      }
    });

    // Reset Form
    setFormName('');
    setFormRoll('');
    setFormBranch('B.Tech CSE Core');
    setFormSemester(2);
    setFormAttendance(75);
    setFormInternalMarks(15);
    setFormAssignComp(75);
    setFormAssignMarks(15);
    setFormParticipation(6);
    setFormClubActivity('Medium');
    setFormLastLog(2);
    setFormPreviousAttendance(75);
    setFormPastPerformance(7.5);
    setIsAddModalOpen(false);
  };

  // Open Edit Dialog
  const openEditDialog = (student: Student) => {
    setActiveEditStudent(student);
    setFormName(student.name);
    setFormRoll(String(student.rollNumber));
    setFormBranch(student.branch);
    setFormSemester(student.semester);
    setFormAttendance(student.stats.attendance);
    setFormInternalMarks(student.stats.internalMarks);
    setFormAssignComp(student.stats.assignmentCompletion);
    setFormAssignMarks(student.stats.assignmentMarks);
    setFormParticipation(student.stats.participationScore);
    setFormClubActivity(student.stats.clubActivity);
    setFormLastLog(student.stats.lastLogDaysAgo);
    setFormPreviousAttendance(student.stats.previousAttendance ?? student.stats.attendance);
    setFormPastPerformance(student.stats.pastPerformance ?? 7.5);
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditStudent || !formName || !formRoll) return;

    onUpdateStudent(activeEditStudent.id, {
      name: formName,
      rollNumber: formRoll.trim(),
      branch: formBranch,
      semester: Number(formSemester),
      stats: {
        ...activeEditStudent.stats,
        attendance: Number(formAttendance),
        internalMarks: Number(formInternalMarks),
        assignmentCompletion: Number(formAssignComp),
        assignmentMarks: Number(formAssignMarks),
        participationScore: Number(formParticipation),
        clubActivity: formClubActivity,
        lastLogDaysAgo: Number(formLastLog),
        previousAttendance: Number(formPreviousAttendance),
        pastPerformance: Number(formPastPerformance)
      }
    });

    setIsEditModalOpen(false);
    setActiveEditStudent(null);
  };

  // Helper Risk Level Style
  const getRiskBadge = (score: number) => {
    if (score >= 70) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 text-xs font-semibold">
          <AlertOctagon className="h-3 w-3 text-red-500 shrink-0" />
          <span>High ({score})</span>
        </span>
      );
    } else if (score >= 35) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100 text-xs font-semibold">
          <AlertTriangle className="h-3 w-3 text-orange-500 shrink-0" />
          <span>Medium ({score})</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
          <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
          <span>Low ({score})</span>
        </span>
      );
    }
  };

  const branchesEnum = [
    "B.Tech CSE Core",
    "B.Tech CSE (Cloud Computing & Virtualization)",
    "B.Tech CSE (Gaming Technology)",
    "B.Tech CSE (Full Stack Development)",
    "B.Tech CSE (AIML)",
    "B.Tech CSE (AI)",
    "B.Tech CSE (Data Science)",
    "B.Tech CSE (BAO)",
    "B.Tech (AIDS)",
    "B.Tech CSE (Data Analytics)",
    "B.Tech CSE (Cyber Security)",
    "B.Tech CSE (CNCS)",
    "B.Tech CSE (CSDF)",
    "B.Tech CSE (IoT and CS including BT)",
    "M.Tech CSE & Specialization",
    "Doctor of Philosophy (Ph.D.)"
  ];

  const getSemestersForBranch = (b: string) => {
    if (b.startsWith("M.Tech")) {
      return [1, 2, 3, 4];
    } else if (b.includes("Ph.D.")) {
      return [1, 2, 3, 4, 5, 6];
    } else {
      return [1, 2, 3, 4, 5, 6, 7, 8];
    }
  };

  const isRollFormatValid = (roll: string) => {
    return /^[0-9]{2}[A-Z]{4}[0-9]{7}$/.test(roll);
  };

  const handleRollChange = (val: string) => {
    const upper = val.toUpperCase().slice(0, 13);
    setFormRoll(upper);
  };

  const handleBranchChange = (newBranch: string) => {
    setFormBranch(newBranch);
    const sems = getSemestersForBranch(newBranch);
    if (!sems.includes(formSemester)) {
      setFormSemester(sems[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Student action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-2xl text-gray-900 tracking-tight" id="dir-heading">Student Tracker Directory</h2>
          <p className="text-gray-500 text-sm">Review, register, or adjust academic metadata vectors and triggers</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          id="btn-add-student"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm h-11 px-5 rounded-xl inline-flex items-center space-x-2 transition shadow-lg shadow-indigo-100 cursor-pointer"
        >
          <UserPlus className="h-4.5 w-4.5" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Directory Filters & Controls */}
      <div className="bg-white border border-gray-100 p-4.5 rounded-2xl shadow-xs" id="filter-panel">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="md:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roll, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9.5 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="All">All Branches</option>
              {branchesEnum.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={String(s)}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk (70+)</option>
              <option value="Medium">Medium Risk (35-69)</option>
              <option value="Low">Low Risk (&lt;35)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student List Grid / Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden" id="students-table-container">
        <div className="overflow-x-auto">
          <table className="w-full min-w-4xl text-left border-collapse" id="students-table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Student Information</th>
                <th className="py-4 px-4">Branch & Sem</th>
                <th className="py-4 px-4 text-center">Attendance</th>
                <th className="py-4 px-4 text-center">Internal Marks</th>
                <th className="py-4 px-4 text-center">Assignment Comp</th>
                <th className="py-4 px-4">Intervention Risk</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <SlidersHorizontal className="h-10 w-10 mx-auto mb-2.5 opacity-60" />
                    <p className="font-semibold text-gray-900 text-sm">No Student Records Located</p>
                    <p className="text-xs">Adjust directory queries or register new candidates above.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition">
                    {/* Basic Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                          {student.name.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-950 block">{student.name}</span>
                          <span className="text-xs font-semibold text-gray-400 block">Roll: {student.rollNumber}</span>
                          <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-lg inline-block mt-1 border border-blue-100/50">
                            Past Performance: {student.stats.pastPerformance ?? 7.5} CGPA
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department / Semester */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-gray-900 block">{student.branch}</span>
                      <span className="text-xs font-medium text-gray-500">Term {student.semester}</span>
                    </td>

                    {/* Attendance Index */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-block">
                        <span className={`font-bold text-sm ${student.stats.attendance < 60 ? 'text-rose-600' : 'text-gray-900'}`}>
                          {student.stats.attendance}%
                        </span>
                        <div className="text-[10px] text-gray-400 font-bold block leading-tight mt-0.5">
                          Prev Sem: {student.stats.previousAttendance ?? student.stats.attendance}%
                        </div>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden mx-auto">
                          <div 
                            className={`h-full rounded-full ${student.stats.attendance < 60 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${student.stats.attendance}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Internal Marks (out of 25) */}
                    <td className="py-4 px-4 text-center">
                      <span className={`font-bold text-sm ${student.stats.internalMarks < 10 ? 'text-red-500' : 'text-gray-900'}`}>
                        {student.stats.internalMarks}/25
                      </span>
                    </td>

                    {/* Assignment Completed */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-sm">{student.stats.assignmentCompletion}%</span>
                    </td>

                    {/* Calculated Risk Factor */}
                    <td className="py-4 px-4">
                      {getRiskBadge(student.riskScore)}
                    </td>

                    {/* CRUD Options */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => openEditDialog(student)}
                          title="Adjust Metadata"
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student.id)}
                          title="Purge Record"
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STUDENT MODAL PORTAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 scrollbar-none overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-gray-900">Enrolment Entry Roster</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-xl cursor-pointer">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              {/* Core Group */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide border-l-4 border-indigo-500 pl-2 mb-3">Core Identity Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Amit Sharma"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Roll No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 24SCSE0100245"
                      value={formRoll}
                      onChange={(e) => handleRollChange(e.target.value)}
                      className={`w-full h-10 border rounded-xl px-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:outline-none ${formRoll && !isRollFormatValid(formRoll) ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Branch / Specialization Group</label>
                    <select
                      value={formBranch}
                      onChange={(e) => handleBranchChange(e.target.value)}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
                    >
                      {branchesEnum.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Semester Cycle Key</label>
                    <select
                      value={formSemester}
                      onChange={(e) => setFormSemester(Number(e.target.value))}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
                    >
                      {getSemestersForBranch(formBranch).map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Assessment Group */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide border-l-4 border-indigo-500 pl-2 mb-3">Academic Parameters</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Attendance Rate %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formAttendance}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setFormAttendance(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Internal Marks (/25)</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={formInternalMarks}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 25) val = 25;
                        if (val < 0) val = 0;
                        setFormInternalMarks(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Assignment Comp %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formAssignComp}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setFormAssignComp(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Assignment Marks (/25)</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={formAssignMarks}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 25) val = 25;
                        if (val < 0) val = 0;
                        setFormAssignMarks(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Participation (0-10)</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formParticipation}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 10) val = 10;
                        if (val < 0) val = 0;
                        setFormParticipation(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Prev Sem Attendance %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formPreviousAttendance}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setFormPreviousAttendance(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Past CGPA (0.0 - 10.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      max={10}
                      value={formPastPerformance}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 10) val = 10;
                        if (val < 0) val = 0;
                        setFormPastPerformance(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4.5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formRoll || !isRollFormatValid(formRoll)}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm h-10 px-5 rounded-xl inline-flex items-center space-x-1 transition cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Enrol Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL PORTAL */}
      {isEditModalOpen && activeEditStudent && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 scrollbar-none overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-2">
                <Edit3 className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-gray-900">Adjust Student Metadata</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-xl cursor-pointer">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              {/* Identity info */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide border-l-4 border-indigo-500 pl-2 mb-3">Core Identity Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Roll No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 24SCSE0100245"
                      value={formRoll}
                      onChange={(e) => handleRollChange(e.target.value)}
                      className={`w-full h-10 border rounded-xl px-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:outline-none ${formRoll && !isRollFormatValid(formRoll) ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Branch / Specialization Group</label>
                    <select
                      value={formBranch}
                      onChange={(e) => handleBranchChange(e.target.value)}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
                    >
                      {branchesEnum.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Semester Cycle Key</label>
                    <select
                      value={formSemester}
                      onChange={(e) => setFormSemester(Number(e.target.value))}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
                    >
                      {getSemestersForBranch(formBranch).map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Stats info */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide border-l-4 border-indigo-500 pl-2 mb-3">Academic Parameters</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Attendance Rate %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formAttendance}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setFormAttendance(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Internal Marks (/25)</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={formInternalMarks}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 25) val = 25;
                        if (val < 0) val = 0;
                        setFormInternalMarks(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Assignment Comp %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formAssignComp}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setFormAssignComp(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Assignment Marks (/25)</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={formAssignMarks}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 25) val = 25;
                        if (val < 0) val = 0;
                        setFormAssignMarks(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Participation (0-10)</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formParticipation}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 10) val = 10;
                        if (val < 0) val = 0;
                        setFormParticipation(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Prev Sem Attendance %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formPreviousAttendance}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setFormPreviousAttendance(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Past CGPA (0.0 - 10.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      max={10}
                      value={formPastPerformance}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 10) val = 10;
                        if (val < 0) val = 0;
                        setFormPastPerformance(val);
                      }}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4.5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formRoll || !isRollFormatValid(formRoll)}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm h-10 px-5 rounded-xl inline-flex items-center space-x-1 transition cursor-pointer"
                >
                  <span>Apply Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
