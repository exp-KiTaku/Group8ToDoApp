import type { Category } from './Category';

export interface TaskArgs {
  id?: string; // 新規タスク生成時においては，自動で付与されるものなので指定しない
  type: 'normal' | 'habit';
  title: string;
  description: string | null;
  categories: Category[];
  status: `uncompleted` | `completed` | `deadline-passed`;
  deadline: Date;
  completedAt: Date | null;
  intervalDays?: number; // 習慣タスクの場合のみ使用
}