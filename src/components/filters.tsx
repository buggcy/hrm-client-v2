import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  CheckCircle,
  CheckCircle2,
  Circle,
  CircleArrowOutUpRight,
  FileText,
  HelpCircle,
  PackagePlus,
  PersonStanding,
  ScrollText,
  Timer,
  XCircle,
} from 'lucide-react';

export const status_options = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: HelpCircle,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: Circle,
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    icon: Timer,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircle2,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: XCircle,
  },
];

export const label_options = [
  {
    value: 'bug',
    label: 'Bug',
    icon: Bug,
  },
  {
    value: 'feature',
    label: 'Feature',
    icon: PackagePlus,
  },
  {
    value: 'documentation',
    label: 'Documentation',
    icon: ScrollText,
  },
];

export const priority_options = [
  {
    value: 'low',
    label: 'Low',
    icon: ArrowDown,
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: ArrowRight,
  },
  {
    value: 'high',
    label: 'High',
    icon: ArrowUp,
  },
];

export const gender_options = [
  {
    value: 'male',
    label: 'Male',
    icon: CircleArrowOutUpRight,
  },
  {
    value: 'female',
    label: 'Female',
    icon: PersonStanding,
  },
];

export const perk_status_options = [
  {
    value: 'available',
    label: 'Available',
    icon: CircleArrowOutUpRight,
  },
  {
    value: 'pending',
    label: 'Pending',
    icon: Circle,
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: XCircle,
  },
  {
    value: 'approved',
    label: 'Approved',
    icon: CheckCircle2,
  },
];
export const attendance_history_status_options = [
  {
    value: 'Present',
    label: 'Present',
    icon: CheckCircle2,
  },
  {
    value: 'Absent',
    label: 'Absent',
    icon: XCircle,
  },
  {
    value: 'Leave',
    label: 'Leave',
    icon: Circle,
  },
  {
    value: 'Holiday',
    label: 'Holiday',
    icon: Circle,
  },
];

export const leave_history_status_options = [
  {
    value: 'Approved',
    label: 'Approved',
    icon: CheckCircle2,
  },
  {
    value: 'Pending',
    label: 'Pending',
    icon: Circle,
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    icon: XCircle,
  },
  {
    value: 'Canceled',
    label: 'Canceled',
    icon: XCircle,
  },
];
export const hr_policies_categories = [
  {
    value: 'Company Policy',
    label: 'Company Policy',
    icon: FileText,
  },
  {
    value: 'Attendence Policy',
    label: 'Attendence Policy',
    icon: CheckCircle,
  },
  {
    value: 'Personnel Policy',
    label: 'Personnel Policy',
    icon: Circle,
  },
  {
    value: 'Safety Policy',
    label: 'Safety Policy',
    icon: Circle,
  },
  {
    value: 'Technology Policy',
    label: 'Technology Policy',
    icon: Circle,
  },
  {
    value: 'Privacy Policy',
    label: 'Privacy Policy',
    icon: Circle,
  },
  {
    value: 'Payment Policy',
    label: 'Payment Policy',
    icon: Circle,
  },
  {
    value: 'Confidentiality Policy',
    label: 'Confidentiality Policy',
    icon: Circle,
  },
  {
    value: 'Performance Policy',
    label: 'Employee Performance Policy',
    icon: Circle,
  },
  {
    value: 'Retention Policy',
    label: 'Retention Policy',
    icon: Circle,
  },
  {
    value: 'Disciplinary Policy',
    label: 'Disciplinary Action Policy',
    icon: Circle,
  },
];
