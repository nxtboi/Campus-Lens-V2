/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardTab from './components/DashboardTab';
import StudentDirectoryTab from './components/StudentDirectoryTab';
import ExamsTab from './components/ExamsTab';
import InterventionTab from './components/InterventionTab';
import FacultyTab from './components/FacultyTab';
import { api } from './api';
import { Student } from './types';
import { Loader2, AlertCircle, RefreshCw, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorNotice, setErrorNotice] = useState<string>('');

  // Handle Toast Notifications
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 4000);
  };

  // Fetch initial registry on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const { data, offline } = await api.getStudents();
        setStudents(data);
        setIsOffline(offline);
        if (data.length > 0) {
          setSelectedStudentId(data[0].id);
        }
      } catch (err: any) {
        setErrorNotice(err.message || 'Fatal error loading registry.');
        showToast('Failed to sync student registry with node server.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // CRUD Handler - Create Student
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'riskScore' | 'interventionPlan'>) => {
    try {
      const { data, offline } = await api.addStudent(studentData);
      setStudents(prev => [...prev, data]);
      setIsOffline(offline);
      showToast(`Student ${data.name} enrolled and trajectory plan compiled successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add student to directory.', 'error');
    }
  };

  // CRUD Handler - Update/Save Student
  const handleUpdateStudent = async (id: string, updatedPayload: Partial<Student>) => {
    try {
      const { data, offline } = await api.updateStudent(id, updatedPayload);
      setStudents(prev => prev.map(s => s.id === id ? data : s));
      setIsOffline(offline);
      showToast(`Student registry metadata adjusted for ${data.name}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update student registry.', 'error');
    }
  };

  // CRUD Handler - Purge Student
  const handleDeleteStudent = async (id: string) => {
    try {
      // Find name before delete for toast
      const studentName = students.find(s => s.id === id)?.name || 'student';
      const { success, offline } = await api.deleteStudent(id);
      if (success) {
        setStudents(prev => prev.filter(s => s.id !== id));
        setIsOffline(offline);
        if (selectedStudentId === id) {
          setSelectedStudentId('');
        }
        showToast(`Student registry line for ${studentName} purged successfully from server!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to remove target from academic directory.', 'error');
    }
  };

  const handleSelectStudentForIntervention = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveTab('intervention');
  };

  return (
    <div className="bg-gray-50/50 min-h-screen font-sans flex flex-col md:flex-row">
      
      {/* App Navigation Sidebar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOffline={isOffline} 
      />

      {/* Main Right Content Section */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64 overflow-x-hidden">
        
        {/* Dynamic Alerts and Toast Notifications */}
        {activeToast && (
          <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-150 p-4 rounded-2xl shadow-xl flex items-center justify-between space-x-3 max-w-sm border ring-4 ring-indigo-50/20 bg-white border-indigo-100 text-gray-800">
            <div className="flex items-center space-x-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                activeToast.type === 'success' ? 'bg-emerald-500' :
                activeToast.type === 'error' ? 'bg-red-500 animate-ping' : 'bg-indigo-500'
              }`} />
              <p className="text-xs font-bold leading-relaxed">{activeToast.message}</p>
            </div>
            <button onClick={() => setActiveToast(null)} className="p-1 rounded-md hover:bg-gray-100 cursor-pointer">
              <X className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>
        )}

        {/* Workspace panel */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col justify-start">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-28 space-y-4">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              <div className="text-center">
                <h4 className="font-extrabold text-gray-900">Ingesting CampusLens Database...</h4>
                <p className="text-xs text-gray-500 mt-1">Reading academic variables and loading predictive models...</p>
              </div>
            </div>
          ) : errorNotice ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-center max-w-md">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <h5 className="font-bold">Database Ingestion Failed</h5>
                <p className="text-xs text-red-600 mt-1">{errorNotice}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-xl transition inline-flex items-center space-x-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reload Application</span>
                </button>
              </div>
            </div>
          ) : (
            <div id="tab-viewport" className="animate-in fade-in duration-300">
              {activeTab === 'dashboard' && (
                <DashboardTab 
                  students={students} 
                  onSelectStudentForIntervention={handleSelectStudentForIntervention}
                />
              )}
              {activeTab === 'students' && (
                <StudentDirectoryTab 
                  students={students}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onSelectStudentForIntervention={handleSelectStudentForIntervention}
                />
              )}
              {activeTab === 'exams' && (
                <ExamsTab students={students} />
              )}
              {activeTab === 'intervention' && (
                <InterventionTab 
                  students={students}
                  onUpdateStudent={handleUpdateStudent}
                  selectedStudentId={selectedStudentId}
                  setSelectedStudentId={setSelectedStudentId}
                />
              )}
              {activeTab === 'faculty' && (
                <FacultyTab />
              )}
            </div>
          )}
        </main>

        {/* Global signature footer section */}
        <Footer />
      </div>
    </div>
  );
}
