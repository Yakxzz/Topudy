export interface CertificateDef {
  id: string;
  title: string;
  description: string;
  type: 'hours' | 'streak' | 'tasks' | 'syllabus' | 'special';
  threshold: number; // Value needed to unlock
}

export const CERTIFICATES: CertificateDef[] = [];

// Generate 25 Hour-based certificates
const hourMilestones = [1, 2, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 3000, 5000];
hourMilestones.forEach(h => {
  CERTIFICATES.push({
    id: `hours_${h}`,
    title: h === 1 ? 'The First Hour' : h >= 1000 ? `${h/1000}k Hour Master` : `${h} Hours Milestone`,
    description: `Awarded for completing ${h} hour${h > 1 ? 's' : ''} of total study time.`,
    type: 'hours',
    threshold: h
  });
});

// Generate 25 Streak-based certificates
const streakMilestones = [3, 5, 7, 10, 14, 21, 30, 40, 50, 60, 75, 90, 100, 120, 150, 180, 200, 250, 300, 365, 400, 500, 730, 1000, 2000];
streakMilestones.forEach(s => {
  CERTIFICATES.push({
    id: `streak_${s}`,
    title: s === 7 ? 'One Week Warrior' : s === 30 ? 'Monthly Devotion' : s === 365 ? 'A Year of Focus' : `${s}-Day Streak`,
    description: `Awarded for maintaining a study streak for ${s} consecutive days.`,
    type: 'streak',
    threshold: s
  });
});

// Generate 25 Task-based certificates
const taskMilestones = [1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 3000, 5000, 10000];
taskMilestones.forEach(t => {
  CERTIFICATES.push({
    id: `tasks_${t}`,
    title: t === 1 ? 'First Task Done' : t >= 1000 ? `Task Executioner ${t}` : `${t} Tasks Completed`,
    description: `Awarded for successfully completing ${t} task${t > 1 ? 's' : ''}.`,
    type: 'tasks',
    threshold: t
  });
});

// Generate 25 Syllabus-based certificates (subtopics completed)
const syllabusMilestones = [1, 5, 10, 20, 30, 40, 50, 75, 100, 125, 150, 175, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 3000];
syllabusMilestones.forEach(sm => {
  CERTIFICATES.push({
    id: `syllabus_${sm}`,
    title: sm === 1 ? 'Knowledge Seeker' : `${sm} Subtopics Mastered`,
    description: `Awarded for mastering ${sm} subtopic${sm > 1 ? 's' : ''} in your syllabus.`,
    type: 'syllabus',
    threshold: sm
  });
});

// Add a few special certificates
CERTIFICATES.push(
  { id: 'special_early_bird', title: 'Early Bird', description: 'Awarded for completing a study session between 4 AM and 7 AM.', type: 'special', threshold: 1 },
  { id: 'special_night_owl', title: 'Night Owl', description: 'Awarded for completing a study session between 11 PM and 3 AM.', type: 'special', threshold: 1 },
  { id: 'special_marathon', title: 'The Marathon', description: 'Awarded for completing a single study session longer than 3 hours.', type: 'special', threshold: 1 }
);
