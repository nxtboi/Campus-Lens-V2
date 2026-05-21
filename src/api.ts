/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student } from './types';

// Mock Backup seed list matching server defaults
const LOBAL_SEED_STUDENTS: Student[] = [
  {
    id: "stud_1",
    name: "Amit Sharma",
    rollNumber: "20240101",
    branch: "B.Tech CSE Core",
    semester: 4,
    stats: {
      attendance: 64,
      internalMarks: 8,
      assignmentCompletion: 52,
      assignmentMarks: 9,
      participationScore: 3,
      testScores: [55, 48, 60, 50],
      clubActivity: "Low",
      lastLogDaysAgo: 12
    },
    riskScore: 82,
    interventionPlan: {
      summary: "Amit is currently at high academic risk due to poor class attendance (64%) and deficient internal marks (8/25). Frequent portal absence (12 days ago) and low test averages confirm deep academic disengagement.",
      actionItems: [
        "Schedule parent-teacher-counselor alignment meeting immediately.",
        "Attend daily remedial tutoring classes in CSE Labs.",
        "Submit backlog assignments under customized tutor support.",
        "Undergo weekly progress reviews with the designated faculty mentor."
      ],
      focusAreas: ["Time Management", "Academic Recovery", "Data Structures"],
      predictedOutcome: "Sustained remedial tracking is projected to normalize attendance over 75% and raise the upcoming internal evaluations to a safe passing grade.",
      recommendedResources: [
        {
          title: "Time Management Mastery for Students",
          url: "https://www.youtube.com/watch?v=b8n-wpvBjrw",
          type: "video"
        },
        {
          title: "Strategies for Recovering from Academic Challenges",
          url: "https://www.iwantmydiploma.com/blog/bouncing-back-strategies-for-recovering-from-academic-challenges/",
          type: "article"
        },
        {
          title: "Galgotias Counselor (Sapna Kanjani)",
          url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in",
          type: "contact"
        }
      ]
    }
  },
  {
    id: "stud_2",
    name: "Sneha Patel",
    rollNumber: "20240102",
    branch: "AI/DS",
    semester: 4,
    stats: {
      attendance: 96,
      internalMarks: 24,
      assignmentCompletion: 98,
      assignmentMarks: 23,
      participationScore: 9,
      testScores: [92, 95, 90, 94],
      clubActivity: "High",
      lastLogDaysAgo: 1
    },
    riskScore: 8,
    interventionPlan: {
      summary: "Sneha maintains an exemplary academic profile with outstanding attendance (96%) and near-perfect assignments. High participation and active login habits demonstrate maximum focus.",
      actionItems: [
        "Nominate for senior department research fellowships.",
        "Encourage leadership roles in the college AI/DS Developers Club.",
        "Guide selection for advanced specialized model deployments."
      ],
      focusAreas: ["Advanced AI Research", "Deep Learning Engineering"],
      predictedOutcome: "Continuous stellar outcomes align Sneha with campus top honors and high-tier core industry placements.",
      recommendedResources: [
        {
          title: "Undergraduate AI Research Opportunities",
          url: "https://www.galgotiasuniversity.edu.in",
          type: "article"
        },
        {
          title: "Faculty Mentorship Sync",
          url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in",
          type: "contact"
        }
      ]
    }
  },
  {
    id: "stud_3",
    name: "Rohan Verma",
    rollNumber: "20240103",
    branch: "IT",
    semester: 6,
    stats: {
      attendance: 78,
      internalMarks: 14,
      assignmentCompletion: 70,
      assignmentMarks: 15,
      participationScore: 6,
      testScores: [68, 72, 65, 70],
      clubActivity: "Medium",
      lastLogDaysAgo: 4
    },
    riskScore: 48,
    interventionPlan: {
      summary: "Rohan is in the medium risk zone. Borderline class attendance (78%) and average unit scores imply a need for structured routine enforcement to secure consistent progress.",
      actionItems: [
        "Enforce a mandatory bi-weekly submission check with course advisors.",
        "Advise attending specialized problem-solving clinics for coding theory.",
        "Review self-reported study trackers via the department portal."
      ],
      focusAreas: ["Time Management", "Software Development Assays"],
      predictedOutcome: "Proactive time adjustments are anticipated to push internal scores up by 15% and stabilize term pass scores.",
      recommendedResources: [
        {
          title: "Time Management Mastery for Students",
          url: "https://www.youtube.com/watch?v=b8n-wpvBjrw",
          type: "video"
        },
        {
          title: "Academic Counselor Sync",
          url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in",
          type: "contact"
        }
      ]
    }
  },
  {
    id: "stud_7",
    name: "Siddharth Rao",
    rollNumber: "20240107",
    branch: "AI/DS",
    semester: 6,
    stats: {
      attendance: 55,
      internalMarks: 7,
      assignmentCompletion: 45,
      assignmentMarks: 8,
      participationScore: 2,
      testScores: [42, 45, 38, 48],
      clubActivity: "Low",
      lastLogDaysAgo: 15
    },
    riskScore: 94,
    interventionPlan: {
      summary: "Siddharth is at CRITICAL academic risk. Urgent physical and counseling interfaces are required to address heavy truancy (55% attendance) and failing grade averages.",
      actionItems: [
        "Execute a formal academic suspension warning drill and schedule immediate parents sync.",
        "Coordinate mandatory mental health and motivational counselling with the Chief Psychologist.",
        "Draft a customized exam recovery path with daily checkpoints."
      ],
      focusAreas: ["Time Management", "Academic Recovery", "Full Curricular Scaffolding"],
      predictedOutcome: "Strict implementation of daily trackers and emotional scaffolding is the only route to restore standard attendance compliance and avert formal academic failure.",
      recommendedResources: [
        {
          title: "Time Management Mastery for Students",
          url: "https://www.youtube.com/watch?v=b8n-wpvBjrw",
          type: "video"
        },
        {
          title: "Strategies for Recovering from Academic Challenges",
          url: "https://www.iwantmydiploma.com/blog/bouncing-back-strategies-for-recovering-from-academic-challenges/",
          type: "article"
        },
        {
          title: "Galgotias Chief Counselor (Sapna Kanjani)",
          url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in",
          type: "contact"
        }
      ]
    }
  }
];

const LOCAL_STORAGE_KEY = 'campusalens_students_backup';

function getLocalBackup(): Student[] {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore path
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(LOBAL_SEED_STUDENTS));
  return LOBAL_SEED_STUDENTS;
}

function saveLocalBackup(students: Student[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
}

// Heuristic fallback matching backend logic
function localCalculateHeuristic(stats: any, name: string): { riskScore: number; interventionPlan: any } {
  // Participation-weighted risk prioritizing engagement score out of 10
  const partRisk = Math.max(0, (9 - stats.participationScore) * 6.5); // Max of ~58 points risk skew for sub-optimal participation
  const attRisk = Math.max(0, (90 - stats.attendance) * 0.4); // Down-weighted attendance to remove priority
  const marksRisk = Math.max(0, (20 - stats.internalMarks) * 1.5);
  const assignRisk = Math.max(0, (85 - stats.assignmentCompletion) * 0.25);
  const logRisk = Math.min(12, stats.lastLogDaysAgo * 0.6);
  
  let riskScore = Math.round(partRisk + attRisk + marksRisk + assignRisk + logRisk);
  riskScore = Math.min(100, Math.max(0, riskScore));
  
  const actionItems: string[] = [];
  const focusAreas: string[] = [];
  const recommendedResources: any[] = [];
  let summary = "";
  let predictedOutcome = "";
  
  const lowParticipation = stats.participationScore < 7;
  const needsAcademicRecovery = stats.internalMarks < 10 || lowParticipation; // Removed attendance priority trigger
  
  if (riskScore >= 70 || needsAcademicRecovery) {
    if (riskScore < 70) riskScore = 72;
    
    if (lowParticipation) {
      summary = `${name} is currently flagged at HIGH academic risk. Deficient portal class participation (${stats.participationScore}/10) is flagged as the absolute highest priority warning factor requiring urgent intervention.`;
      focusAreas.push("Portal Engagement Recovery");
      focusAreas.push("Active Class Participation");
      actionItems.push("Establish a mandatory daily login and material interaction routine on the university learning management portal.");
      actionItems.push("Achieve active participation metrics by submitting at least two forum comments or discussion posts per week.");
    } else {
      summary = `${name} is currently flagged at HIGH academic risk. Sub-optimal grades and lack of portal log action present major warning indicators.`;
    }
    
    focusAreas.push("Time Management");
    focusAreas.push("Academic Recovery");
    focusAreas.push("Class Regularisation");
    
    actionItems.push("Mandatory counseling meeting with the department counselor to discuss attendance regularisation.");
    actionItems.push("Submit pending assignments within a strict 5-day grace period.");
    
    predictedOutcome = "Intense, scheduled forum interaction logs and active portal study logs will recover engagement and elevate overall outcomes above risk metrics.";
    
    recommendedResources.push({
      title: "Time Management Mastery for Students",
      url: "https://www.youtube.com/watch?v=b8n-wpvBjrw",
      type: "video"
    });
    recommendedResources.push({
      title: "Strategies for Recovering from Academic Challenges",
      url: "https://www.iwantmydiploma.com/blog/bouncing-back-strategies-for-recovering-from-academic-challenges/",
      type: "article"
    });
    recommendedResources.push({
      title: "Galgotias Counselor (Sapna Kanjani)",
      url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in",
      type: "contact"
    });
  } else if (riskScore >= 35) {
    if (lowParticipation) {
      summary = `${name} exhibits moderate scholastic risk levels driven directly by borderline class participation logs (${stats.participationScore}/10).`;
      focusAreas.push("Active Class Participation");
      actionItems.push("Engage routinely with uploaded presentation decks and lecture session notes on weekends.");
    } else {
      summary = `${name} represents moderate risk metrics. Focused tutorials and submission checking is suggested.`;
    }
    
    focusAreas.push("Time Management");
    focusAreas.push("Continuous Assessment Drill");
    
    actionItems.push("Track assignments weekly and participate in class tutoring modules.");
    actionItems.push("Attend peer discussions in the computing branch.");
    
    predictedOutcome = "Consistent weekly progress evaluations are estimated to lower risk score indicators to low brackets.";
    
    recommendedResources.push({
      title: "Time Management Mastery for Students",
      url: "https://www.youtube.com/watch?v=b8n-wpvBjrw",
      type: "video"
    });
    recommendedResources.push({
      title: "Galgotias Counselor Sync",
      url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in",
      type: "contact"
    });
  } else {
    summary = `${name} has shown outstanding success. Maintain the brilliant work!`;
    focusAreas.push("Advanced Project Ideation");
    focusAreas.push("Competency Development");
    
    actionItems.push("Guide as student peer mentor for junior categories.");
    
    predictedOutcome = "Maintained high GPA indicators lead seamlessly to placement shortlists.";
    
    recommendedResources.push({
      title: "Galgotias Placement Cell",
      url: "https://www.galgotiasuniversity.edu.in",
      type: "article"
    });
  }
  
  return {
    riskScore,
    interventionPlan: {
      summary,
      actionItems,
      focusAreas,
      predictedOutcome,
      recommendedResources
    }
  };
}

export const api = {
  // GET all students
  async getStudents(): Promise<{ data: Student[]; offline: boolean }> {
    try {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error("Server responded with error status");
      const data = await res.json();
      saveLocalBackup(data);
      return { data, offline: false };
    } catch (err) {
      console.warn("Backend down, hydrating student directory from localStorage backups.", err);
      return { data: getLocalBackup(), offline: true };
    }
  },

  // Add a Student
  async addStudent(studentData: Omit<Student, 'id' | 'riskScore' | 'interventionPlan'>): Promise<{ data: Student; offline: boolean }> {
    const defaultStats = {
      attendance: 75,
      internalMarks: 15,
      assignmentCompletion: 75,
      assignmentMarks: 15,
      participationScore: 6,
      testScores: [70, 75, 72, 78],
      clubActivity: 'Medium' as const,
      lastLogDaysAgo: 2,
      previousAttendance: 75,
      pastPerformance: 7.5,
      ...studentData.stats
    };

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...studentData,
          stats: defaultStats
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create student on server");
      }
      const data = await res.json();
      
      const local = getLocalBackup();
      local.push(data);
      saveLocalBackup(local);
      
      return { data, offline: false };
    } catch (err) {
      console.warn("Express server offline, preserving newly created student in Local Storage backups.", err);
      const studentId = `stud_${Date.now()}`;
      const heuristic = localCalculateHeuristic(defaultStats, studentData.name);
      
      const offlineStudent: Student = {
        ...studentData,
        id: studentId,
        stats: defaultStats,
        riskScore: heuristic.riskScore,
        interventionPlan: heuristic.interventionPlan
      };
      
      const local = getLocalBackup();
      local.push(offlineStudent);
      saveLocalBackup(local);
      
      return { data: offlineStudent, offline: true };
    }
  },

  // Update student
  async updateStudent(id: string, updatedPayload: Partial<Student>): Promise<{ data: Student; offline: boolean }> {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed updates on server");
      }
      const data = await res.json();
      
      const local = getLocalBackup();
      const idx = local.findIndex(s => s.id === id);
      if (idx !== -1) {
        local[idx] = data;
        saveLocalBackup(local);
      }
      return { data, offline: false };
    } catch (err) {
      console.warn(`Express server offline. Modifying index ${id} directly in Local Storage backup.`, err);
      const local = getLocalBackup();
      const idx = local.findIndex(s => s.id === id);
      if (idx === -1) throw new Error("Student not located in offline dataset.");
      
      const current = local[idx];
      const mergedStats = {
        ...current.stats,
        ...updatedPayload.stats
      };
      
      // Compute local heuristics
      const heuristic = localCalculateHeuristic(mergedStats, updatedPayload.name || current.name);
      
      const offlineUpdated: Student = {
        ...current,
        name: updatedPayload.name || current.name,
        rollNumber: updatedPayload.rollNumber ? String(updatedPayload.rollNumber) : current.rollNumber,
        branch: updatedPayload.branch || current.branch,
        semester: updatedPayload.semester ? Number(updatedPayload.semester) : current.semester,
        stats: mergedStats,
        riskScore: updatedPayload.riskScore !== undefined ? Number(updatedPayload.riskScore) : heuristic.riskScore,
        interventionPlan: updatedPayload.interventionPlan || heuristic.interventionPlan
      };
      
      local[idx] = offlineUpdated;
      saveLocalBackup(local);
      return { data: offlineUpdated, offline: true };
    }
  },

  // Delete student
  async deleteStudent(id: string): Promise<{ success: boolean; offline: boolean }> {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed on server context.");
      
      const local = getLocalBackup();
      const filtered = local.filter(s => s.id !== id);
      saveLocalBackup(filtered);
      return { success: true, offline: false };
    } catch (err) {
      console.warn(`Express server offline. Deleting roll roll/index ${id} offline.`, err);
      const local = getLocalBackup();
      const filtered = local.filter(s => s.id !== id);
      saveLocalBackup(filtered);
      return { success: true, offline: true };
    }
  },

  // Predict student plan (Deep Diagnosis via Backend AI or Local fallback)
  async predictTrajectory(student: Student): Promise<{ data: any; offline: boolean }> {
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: student.stats,
          name: student.name,
          branch: student.branch,
          semester: student.semester
        })
      });
      if (!res.ok) throw new Error("Predict diagnostics errored.");
      const data = await res.json();
      return { data, offline: false };
    } catch (err) {
      console.warn("Prediction API failed or is offline. Generating rule-based heuristic locally.", err);
      const computedHeuristic = localCalculateHeuristic(student.stats, student.name);
      return {
        data: {
          riskScore: computedHeuristic.riskScore,
          ...computedHeuristic.interventionPlan,
          isFallback: true,
          fallbackReason: "Connection offline"
        },
        offline: true
      };
    }
  }
};
