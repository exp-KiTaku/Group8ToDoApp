import type { Category } from './Category';

export interface TaskArgs {
  id: string;
  type: 'normal' | 'habit';
  title: string;
  description: string | null;
  categories: Category[];
  status: `uncompleted` | `completed` | `deadline-passed`;
  deadline: Date;
  isCompleted: boolean;
  completedAt: Date | null;
  intervalDays?: number; // 習慣タスクの場合のみ使用
}