export interface NormalTaskDTO {
  id: string;
  title: string;
  description: string | null;
  categories: { id: string; name: string; color: string }[];
  status: 'uncompleted' | 'completed' | 'deadline-passed';
  deadline: Date;
  completedAt: Date | null;
}