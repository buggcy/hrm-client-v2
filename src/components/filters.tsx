import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  CheckCircle2,
  CheckCircleIcon,
  Circle,
  CircleArrowOutUpRight,
  Cross,
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
    icon: PersonStanding,
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: Cross,
  },
  {
    value: 'approved',
    label: 'Approved',
    icon: CheckCircleIcon,
  },
];
