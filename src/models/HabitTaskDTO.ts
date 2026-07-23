export interface HabitTaskDTO {
  id: string;
  title: string;
  description: string | null;
  categories: { id: string; name: string; color: string }[];
  habitId: string[];
  status: ('uncompleted' | 'completed' | 'deadline-passed')[];
  deadline: Date[];
  completedAt: (Date | null)[];
  intervalDays: number;
}