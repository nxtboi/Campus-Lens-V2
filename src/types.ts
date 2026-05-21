/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ResourceType = 'video' | 'article' | 'contact';

export interface ResourceItem {
  title: string;
  url: string;
  type: ResourceType;
}

export interface InterventionPlan {
  summary: string;
  actionItems: string[];
  focusAreas: string[];
  predictedOutcome: string;
  recommendedResources: ResourceItem[];
}

export interface StudentStats {
  attendance: number;
  internalMarks: number; // out of 25
  assignmentCompletion: number; // percentage (0-100)
  assignmentMarks: number; // out of 25
  participationScore: number; // out of 10
  testScores: number[]; // unit test scores (0-100 values)
  clubActivity: 'High' | 'Medium' | 'Low';
  lastLogDaysAgo: number;
  previousAttendance?: number; // percentage (0-100)
  pastPerformance?: number; // past CGPA (0-10)
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  semester: number;
  stats: StudentStats;
  riskScore: number;
  interventionPlan: InterventionPlan;
}

export interface FacultyContact {
  department: string;
  chairName: string;
  chairEmail: string;
  chairPhone: string;
  coChairName: string;
  coChairEmail: string;
  coChairPhone: string;
}
