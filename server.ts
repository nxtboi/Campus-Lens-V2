/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import { Student, ResourceItem } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to CSV storage
const CSV_FILE = path.join(process.cwd(), 'data', 'students.csv');

// --- Helper Functions for CSV Parse & Stringify ---

function escapeCSV(val: any): string {
  if (val === undefined || val === null) return '';
  const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Default Seed Records
const getSeedStudents = (): Student[] => [
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
          title: "Academic Counselor Advisor Sync",
          url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in",
          type: "contact"
        }
      ]
    }
  },
  {
    id: "stud_4",
    name: "Priya Nair",
    rollNumber: "20240104",
    branch: "Cloud Computing",
    semester: 2,
    stats: {
      attendance: 71,
      internalMarks: 11,
      assignmentCompletion: 60,
      assignmentMarks: 12,
      participationScore: 5,
      testScores: [58, 61, 55, 62],
      clubActivity: "Medium",
      lastLogDaysAgo: 7
    },
    riskScore: 74,
    interventionPlan: {
      summary: "Priya reflects elevated academic concern in her freshmen term. Sub-75% attendance and low internal results (11/25) require immediate scaffolding to establish successful habits.",
      actionItems: [
        "Conduct academic regularisation briefing to align with University guidelines.",
        "Anchor peer-mentor tutoring for Discrete Mathematics and Basic Electronics.",
        "Weekly assignment checks directly with the Program Chair."
      ],
      focusAreas: ["Academic Recovery", "Foundational Mathematical Methods"],
      predictedOutcome: "Targeted fundamental review and structured study sessions are expected to recover basic math scores and lower overall failure risk.",
      recommendedResources: [
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
    id: "stud_5",
    name: "Vikram Singh",
    rollNumber: "20240105",
    branch: "AI/ML",
    semester: 6,
    stats: {
      attendance: 88,
      internalMarks: 19,
      assignmentCompletion: 85,
      assignmentMarks: 20,
      participationScore: 8,
      testScores: [82, 85, 80, 87],
      clubActivity: "High",
      lastLogDaysAgo: 2
    },
    riskScore: 21,
    interventionPlan: {
      summary: "Vikram is performing well across AI / Machine Learning electives. Good attendance (88%) and stable assignment scores identify him as a solid low-risk student.",
      actionItems: [
        "Advise submitting core projects to upcoming student mini-hackathons.",
        "Encourage application for certification programs on cloud AI engines."
      ],
      focusAreas: ["Cloud Model Operations (MLOps)", "Applied Neural Nets"],
      predictedOutcome: "Sustaining high-quality performance will secure seamless clearance of final semester projects with top grades.",
      recommendedResources: [
        {
          title: "MLOps Best Practices for Junior Developers",
          url: "https://www.galgotiasuniversity.edu.in",
          type: "article"
        }
      ]
    }
  },
  {
    id: "stud_6",
    name: "Ananya Das",
    rollNumber: "20240106",
    branch: "B.Tech CSE Core",
    semester: 2,
    stats: {
      attendance: 82,
      internalMarks: 15,
      assignmentCompletion: 78,
      assignmentMarks: 14,
      participationScore: 7,
      testScores: [70, 72, 68, 75],
      clubActivity: "Low",
      lastLogDaysAgo: 3
    },
    riskScore: 38,
    interventionPlan: {
      summary: "Ananya is exhibiting moderate risk. Overall indicators are healthy, but assignment tracking and test consistency need stabilization to progress toward high performance.",
      actionItems: [
        "Implement short tutorial sessions on practical lab assignments.",
        "Participate actively in departmental coding clubs for basic programming."
      ],
      focusAreas: ["Algorithm Solidification", "Programming Methodologies"],
      predictedOutcome: "Active peer coding drills are anticipated to raise lab scores and elevate semester grades to distinction levels.",
      recommendedResources: [
        {
          title: "Department Counselor Sync",
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
  },
  {
    id: "stud_8",
    name: "Harish Murthy",
    rollNumber: "20240108",
    branch: "IT",
    semester: 2,
    stats: {
      attendance: 84,
      internalMarks: 17,
      assignmentCompletion: 81,
      assignmentMarks: 18,
      participationScore: 8,
      testScores: [78, 82, 85, 80],
      clubActivity: "High",
      lastLogDaysAgo: 2
    },
    riskScore: 25,
    interventionPlan: {
      summary: "Harish is performing consistently inside the IT lower-risk cohort. Attentive portal use and dynamic club participation place him in a safe pathway.",
      actionItems: [
        "Advise submitting a project abstract to the national student hackathon.",
        "Schedule continuous periodic reviews to maintain high marks metrics."
      ],
      focusAreas: ["Web App Architecture", "Network Basics"],
      predictedOutcome: "Consistent focus will ensure a smooth, high-GPA transition into intermediate academic years.",
      recommendedResources: [
        {
          title: "IT Careers and Certification Pathways",
          url: "https://www.galgotiasuniversity.edu.in",
          type: "article"
        }
      ]
    }
  }
];

// Initialize Database CSV
function initDB() {
  const dir = path.dirname(CSV_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(CSV_FILE)) {
    const seed = getSeedStudents();
    saveStudentsToCSV(seed);
    console.log("Database initialized with seed records.");
  }
}

function saveStudentsToCSV(students: Student[]) {
  const headers = [
    'id', 'name', 'rollNumber', 'branch', 'semester',
    'stats_attendance', 'stats_internalMarks', 'stats_assignmentCompletion', 'stats_assignmentMarks', 'stats_participationScore', 'stats_testScores', 'stats_clubActivity', 'stats_lastLogDaysAgo',
    'riskScore', 'interventionPlan_summary', 'interventionPlan_actionItems', 'interventionPlan_focusAreas', 'interventionPlan_predictedOutcome', 'interventionPlan_recommendedResources',
    'stats_previousAttendance', 'stats_pastPerformance'
  ];
  
  const lines = [headers.join(',')];
  for (const stud of students) {
    const row = [
      escapeCSV(stud.id),
      escapeCSV(stud.name),
      escapeCSV(stud.rollNumber),
      escapeCSV(stud.branch),
      escapeCSV(stud.semester),
      escapeCSV(stud.stats.attendance),
      escapeCSV(stud.stats.internalMarks),
      escapeCSV(stud.stats.assignmentCompletion),
      escapeCSV(stud.stats.assignmentMarks),
      escapeCSV(stud.stats.participationScore),
      escapeCSV(stud.stats.testScores),
      escapeCSV(stud.stats.clubActivity),
      escapeCSV(stud.stats.lastLogDaysAgo),
      escapeCSV(stud.riskScore),
      escapeCSV(stud.interventionPlan.summary),
      escapeCSV(stud.interventionPlan.actionItems),
      escapeCSV(stud.interventionPlan.focusAreas),
      escapeCSV(stud.interventionPlan.predictedOutcome),
      escapeCSV(stud.interventionPlan.recommendedResources),
      escapeCSV(stud.stats.previousAttendance !== undefined ? stud.stats.previousAttendance : stud.stats.attendance),
      escapeCSV(stud.stats.pastPerformance !== undefined ? stud.stats.pastPerformance : 7.5)
    ];
    lines.push(row.join(','));
  }
  fs.writeFileSync(CSV_FILE, lines.join('\n'), 'utf8');
}

function loadStudentsFromCSV(): Student[] {
  if (!fs.existsSync(CSV_FILE)) {
    initDB();
  }
  try {
    const content = fs.readFileSync(CSV_FILE, 'utf8');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];
    
    const headers = parseCSVLine(lines[0]);
    const students: Student[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i]);
      if (cells.length < headers.length) continue;
      
      try {
        const student: Student = {
          id: cells[0],
          name: cells[1],
          rollNumber: String(cells[2] || '').trim(),
          branch: cells[3],
          semester: Number(cells[4]),
          stats: {
            attendance: Number(cells[5]),
            internalMarks: Number(cells[6]),
            assignmentCompletion: Number(cells[7]),
            assignmentMarks: Number(cells[8]),
            participationScore: Number(cells[9]),
            testScores: JSON.parse(cells[10]),
            clubActivity: cells[11] as any,
            lastLogDaysAgo: Number(cells[12]),
            previousAttendance: cells[19] !== undefined ? Number(cells[19]) : Number(cells[5]),
            pastPerformance: cells[20] !== undefined ? Number(cells[20]) : 7.5
          },
          riskScore: Number(cells[13]),
          interventionPlan: {
            summary: cells[14],
            actionItems: JSON.parse(cells[15]),
            focusAreas: JSON.parse(cells[16]),
            predictedOutcome: cells[17],
            recommendedResources: JSON.parse(cells[18])
          }
        };
        students.push(student);
      } catch (err) {
        console.error(`Error parsing index line ${i} in CSV:`, err);
      }
    }
    return students;
  } catch (err) {
    console.error("Failed to load students CSV, resetting of seed.", err);
    const mock = getSeedStudents();
    saveStudentsToCSV(mock);
    return mock;
  }
}

// Ensure database folders are pre-created
initDB();

// --- Rule-based Heuristic Fallback Analysis ---
function calculateHeuristicIntervention(stats: any, name: string) {
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
  const recommendedResources: ResourceItem[] = [];
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
    
    actionItems.push("Schedule an immediate academic regularisation contract with the department chair.");
    actionItems.push("Attend mandatory remedial classes during practical hours.");
    actionItems.push("Submit missing assignment portfolio work under a dedicated tutor's guidance.");
    actionItems.push("Engage with the student wellness center on managing exam stress.");
    
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
    
    actionItems.push("Formulate a customized study routine with the guidance counselor.");
    actionItems.push("Attend bi-weekly student peer discussions on hard syllabus topics.");
    actionItems.push("Complete pending continuous evaluation modules.");
    
    predictedOutcome = "Consistent weekly progress evaluations are estimated to lower risk score indicators to low brackets.";
    
    recommendedResources.push({
      title: "Time Management Mastery for Students",
      url: "https://www.youtube.com/watch?v=b8n-wpvBjrw",
      type: "video"
    });
    recommendedResources.push({
      title: "Galgotias Counselor (Sapna Kanjani)",
      url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in",
      type: "contact"
    });
  } else {
    summary = `${name} has shown outstanding success. Maintain the work!`;
    focusAreas.push("Advanced Project Ideation");
    focusAreas.push("Competency Development");
    
    actionItems.push("Promote student to serve as peer mentor for critical status juniors.");
    actionItems.push("Encourage registration for national-level developer hackathons.");
    actionItems.push("Mentor for preparing research papers on cutting-edge elective projects.");
    
    predictedOutcome = "Maintaining this performance guarantees high-quality placement credentials and top honors in academic rankings.";
    
    recommendedResources.push({
      title: "Galgotias Scholar Hub & Placements",
      url: "https://www.galgotiasuniversity.edu.in",
      type: "article"
    });
    recommendedResources.push({
      title: "Faculty Advisor Integration",
      url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in",
      type: "contact"
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

// --- Gemini client setup ---
let aiInstance: GoogleGenAI | null = null;
function getAIInstance(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is missing. Heuristic model fallback active.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// --- Predictive Performance Optimization Cache Subsystem ---
interface PredictionCacheEntry {
  data: any;
  timestamp: number;
}

const PREDICTION_CACHE = new Map<string, PredictionCacheEntry>();
const CACHE_TTL_MS = 20 * 60 * 1000; // Cache compiled plans for 20 minutes to eliminate repeat generation latency

function computePredictionCacheKey(stats: any, name: string, branch: string, semester: number): string {
  const parts = [
    (name || "").trim().toLowerCase(),
    (branch || "").trim().toLowerCase(),
    semester,
    stats.attendance || 0,
    stats.internalMarks || 0,
    stats.assignmentCompletion || 0,
    stats.assignmentMarks || 0,
    stats.participationScore || 0,
    (stats.testScores || []).join(','),
    (stats.clubActivity || "").trim().toLowerCase(),
    stats.lastLogDaysAgo || 0
  ];
  return parts.join("|");
}

// Optimized, High-Speed Exponential Retry for Gemini API
async function generatePredictionWithRetry(studentStats: any, studentName: string, department: string, semester: number) {
  const gClient = getAIInstance();
  if (!gClient) {
    throw new Error("No Gemini API connection available (API Key Empty).");
  }

  // Optimize latency by caching prompt compile context using server-wide unified systemInstructions
  const systemInstruction = `You are a high-fidelity, extreme-performance academic diagnostic tool called "CampusLens". 
Analyze the student performance parameters and return a structured plan as fast as possible.

CRITICAL ANALYTICAL DIRECTIVE (MAX PRIORITY):
You MUST prioritize the "Portal Class Participation" score (out of 10) above all other metrics inside the risk scoring and intervention planning engine.
- A Portal Class Participation score below 7/10 must trigger immediate risk escalation, skewing the overall "riskScore" significantly higher even if grades or attendance are stable.
- If participation is sub-optimal (below 7), the "summary", "actionItems", and "focusAreas" MUST be heavily populated with concrete actions, resource mappings, and goals specifically centered on boosting digital portal login frequencies, interactive discussion participation, active class forum engagement, and peer-to-peer scholarly collaborations.

Mandatory Business Rules for Recommended Resources:
1. If "Time Management" is identified as a focus area, you MUST recommend this exact resource in recommendedResources:
   - title: "Time Management Mastery for Students"
   - url: "https://www.youtube.com/watch?v=b8n-wpvBjrw"
   - type: "video"
2. If academic recovery is required (low grades or low test scores), you MUST recommend this exact resource:
   - title: "Strategies for Recovering from Academic Challenges"
   - url: "https://www.iwantmydiploma.com/blog/bouncing-back-strategies-for-recovering-from-academic-challenges/"
   - type: "article"
3. For counselor-based references, you MUST always return this contact in recommendedResources:
   - title: "Department Counselor Sync"
   - url: "mailto:sapna.kanjani@galgotiasuniversity.edu.in"
   - type: "contact"`;

  const prompt = `Student Details:
- Name: ${studentName}
- Department: ${department}
- Semester: ${semester}

Performance Metrics (Stats):
- Attendance Percentage: ${studentStats.attendance}%
- Internal Assessment Marks: ${studentStats.internalMarks}/25
- Assignment Completion: ${studentStats.assignmentCompletion}%
- Assignment Score: ${studentStats.assignmentMarks}/25
- Portal Class Participation: ${studentStats.participationScore}/10  <-- CRITICAL PRIORITY FOCUS (Weighted Highest)
- Periodic/Unit Test Scores History: [${(studentStats.testScores || []).join(', ')}] (out of 100)
- Extra-Curricular/Club Activity Level: ${studentStats.clubActivity}
- Idle Days Since Last Portal Activity: ${studentStats.lastLogDaysAgo} days

Respond strictly with valid JSON matching the responseSchema definition immediately. Make summaries short and direct to reduce output token generation time. Remember: If Portal Class Participation is below 7, make sure it is highlighted as the primary root cause in the diagnostic summary and focus areas.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      riskScore: {
        type: Type.INTEGER,
        description: "Computed student academic risk level (0-100)."
      },
      summary: {
        type: Type.STRING,
        description: "A short, descriptive paragraph outlining academic diagnostic metrics or indicators."
      },
      actionItems: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3-5 high-priority actionable recommendations for faculty & student."
      },
      focusAreas: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Subject areas or behavioral aspects requiring immediate recovery. Must list Time Management if applicable, and Academic Recovery."
      },
      predictedOutcome: {
        type: Type.STRING,
        description: "Short forecast detailing potential performance change should this plan be resolved."
      },
      recommendedResources: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            url: { type: Type.STRING },
            type: { type: Type.STRING, description: "Must be 'video', 'article', or 'contact'." }
          },
          required: ["title", "url", "type"]
        },
        description: "The list of resources, heavily respecting the mandatory business rules about specific links."
      }
    },
    required: ["riskScore", "summary", "actionItems", "focusAreas", "predictedOutcome", "recommendedResources"]
  };

  let delay = 1000;
  let lastError: any = null;

  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      console.log(`Sending high-performance diagnosis to Gemini (attempt ${attempt + 1})...`);
      const response = await gClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.15, // Minimize entropy to accelerate output generation speed and precision
          systemInstruction: systemInstruction, // Context is compiled and cached during subsequent API calls
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW // Avoid expensive, high-token logic overhead
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Gemini returned empty diagnosis context.");
      
      const parsed = JSON.parse(text);
      console.log("Successfully retrieved optimized diagnosis response.");
      return parsed;
    } catch (err: any) {
      lastError = err;
      console.error(`Attempt ${attempt + 1} failed:`, err.message || err);
      if (attempt < 2) {
        console.log(`Backoff retry scheduled for ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }
  throw lastError || new Error("Failed connecting with Gemini API after retries.");
}


// --- API endpoints ---

// GET All Students
app.get('/api/students', (req, res) => {
  const list = loadStudentsFromCSV();
  res.json(list);
});

// POST Add New Student
app.post('/api/students', (req, res) => {
  try {
    const list = loadStudentsFromCSV();
    const newStudentData = req.body;
    
    if (!newStudentData.name || !newStudentData.rollNumber) {
      return res.status(400).json({ error: "Name and Roll Number are required properties." });
    }
    
    // Check duplication
    const duplicate = list.find(s => String(s.rollNumber).trim().toLowerCase() === String(newStudentData.rollNumber).trim().toLowerCase());
    if (duplicate) {
      return res.status(400).json({ error: `Roll number ${newStudentData.rollNumber} is already registered.` });
    }

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
      ...newStudentData.stats
    };

    const studentId = `stud_${Date.now()}`;
    const diagnosis = calculateHeuristicIntervention(defaultStats, newStudentData.name);

    const student: Student = {
      id: studentId,
      name: newStudentData.name,
      rollNumber: String(newStudentData.rollNumber).trim(),
      branch: newStudentData.branch || "B.Tech CSE Core",
      semester: Number(newStudentData.semester) || 2,
      stats: defaultStats,
      riskScore: diagnosis.riskScore,
      interventionPlan: diagnosis.interventionPlan
    };

    list.push(student);
    saveStudentsToCSV(list);
    res.status(201).json(student);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create student." });
  }
});

// PUT Update Student
app.put('/api/students/:id', (req, res) => {
  try {
    const list = loadStudentsFromCSV();
    const { id } = req.params;
    const index = list.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Student not found in registry." });
    }

    const updatedData = req.body;
    const current = list[index];

    // Build the updated student stats safely
    const stats = {
      ...current.stats,
      ...updatedData.stats
    };

    // Calculate heuristic risk score based on updated stats
    const heuristic = calculateHeuristicIntervention(stats, updatedData.name || current.name);

    const updatedStudent: Student = {
      ...current,
      name: updatedData.name || current.name,
      rollNumber: updatedData.rollNumber !== undefined ? String(updatedData.rollNumber).trim() : current.rollNumber,
      branch: updatedData.branch || current.branch,
      semester: updatedData.semester ? Number(updatedData.semester) : current.semester,
      stats,
      // If client sent custom intervention plan, merge it. Otherwise use recalculated heuristics
      riskScore: updatedData.riskScore !== undefined ? Number(updatedData.riskScore) : heuristic.riskScore,
      interventionPlan: updatedData.interventionPlan || heuristic.interventionPlan
    };

    list[index] = updatedStudent;
    saveStudentsToCSV(list);
    res.json(updatedStudent);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update record." });
  }
});

// DELETE Student
app.delete('/api/students/:id', (req, res) => {
  try {
    const list = loadStudentsFromCSV();
    const { id } = req.params;
    const filtered = list.filter(s => s.id !== id);
    if (filtered.length === list.length) {
      return res.status(404).json({ error: "Student target not located for deletion." });
    }
    saveStudentsToCSV(filtered);
    res.json({ success: true, message: "Student record purged successfully from CSV." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete student." });
  }
});

// POST Call AI Trajectory Predict & Diagnose API
app.post('/api/predict', async (req, res) => {
  try {
    const { stats, name, branch, semester } = req.body;
    if (!stats || !name) {
      return res.status(400).json({ error: "Student Stats object and student name are required." });
    }

    const branchName = branch || "Unspecified";
    const semNum = Number(semester) || 2;
    const cacheKey = computePredictionCacheKey(stats, name, branchName, semNum);

    const cached = PREDICTION_CACHE.get(cacheKey);
    const now = Date.now();
    if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
      console.log(`[Cache Hit] Returning cached academic intervention trajectory for student: ${name}`);
      return res.json({
        ...cached.data,
        cachedAt: cached.timestamp,
        isCached: true
      });
    }

    try {
      // Attempt prediction via Gemini flash (with exponential retry built in)
      const prediction = await generatePredictionWithRetry(stats, name, branchName, semNum);
      
      // Store in high-performance memory cache
      PREDICTION_CACHE.set(cacheKey, {
        data: prediction,
        timestamp: now
      });

      res.json(prediction);
    } catch (apiError: any) {
      console.warn("Gemini prediction routine exhausted retries, running fallback heuristics.", apiError.message || apiError);
      // Run fallback heuristic
      const diagnosis = calculateHeuristicIntervention(stats, name);
      res.json({
        ...diagnosis.interventionPlan,
        riskScore: diagnosis.riskScore,
        isFallback: true,
        fallbackReason: apiError.message || "Gemini unavailable"
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Transaction server fault during prediction cycle." });
  }
});

// --- Dynamic Dev/Production Serving Config ---

async function startAppServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Environment: Hook Vite middleware
    console.log("Initializing local development environment with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Environment: Serve static dist assets
    console.log("Initializing production static asset ingestion...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusLens dynamic backend running safely on port ${PORT}`);
  });
}

startAppServer().catch((error) => {
  console.error("Vite/Express Bootstrap Crash:", error);
});
