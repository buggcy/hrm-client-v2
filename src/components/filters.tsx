import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Briefcase,
  Bug,
  CheckCircle,
  CheckCircle2,
  Circle,
  CircleArrowOutUpRight,
  CircleFadingPlus,
  HelpCircle,
  PackagePlus,
  PersonStanding,
  ScrollText,
  Sun,
  Timer,
  UserMinus,
  UserX,
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

export const pay_status_options = [
  {
    value: 'Paid',
    label: 'Paid',
    icon: CheckCircle2,
  },
  {
    value: 'Unpaid',
    label: 'Unpaid',
    icon: XCircle,
  },
];

export const hrStatus_options = [
  {
    value: 'enabled',
    label: 'Enabled',
    icon: CheckCircle2,
  },
  {
    value: 'disabled',
    label: 'Disabled',
    icon: XCircle,
  },
];
export const hrEventType_options = [
  {
    value: 'holiday',
    label: 'Holiday',
    icon: Sun,
  },
  {
    value: 'company',
    label: 'Non Holiday',
    icon: Briefcase,
  },
];

export const perk_status_options = [
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

export const perk_type_options = [
  {
    value: 'Increment',
    label: 'Increment',
    icon: Circle,
  },
  {
    value: 'Decrement',
    label: 'Decrement',
    icon: Circle,
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

export const employee_status = [
  {
    value: 'tba',
    label: 'To Be Added',
    icon: CircleFadingPlus,
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
    value: 'Approved',
    label: 'Approved',
    icon: CheckCircle2,
  },
  {
    value: 'Resigned',
    label: 'Resigned',
    icon: UserMinus,
  },
  {
    value: 'Fired',
    label: 'Fired',
    icon: UserX,
  },
];

export const attendance_list_status_options = [
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

export const log_options = [
  {
    value: 'Success',
    label: 'Success',
    icon: CheckCircle,
  },
  {
    value: 'Error',
    label: 'Error',
    icon: XCircle,
  },
  {
    value: 'Failed',
    label: 'Failed',
    icon: XCircle,
  },
];

export const resigned_options = [
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
];

export const resigned_fired_status = [
  {
    value: 'Resigned',
    label: 'Resigned',
    icon: UserMinus,
  },
  {
    value: 'Fired',
    label: 'Fired',
    icon: UserX,
  },
];
