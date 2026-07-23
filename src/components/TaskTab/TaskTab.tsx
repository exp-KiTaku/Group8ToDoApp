import React from 'react';
import './TaskTab.css';
import TaskCard from '../TaskCard/TaskCard';
import type { TaskArgs } from '../../models/TaskArgs';

type TaskTabProps = {
  tasks: TaskArgs[];
  selectedTaskId?: string | null;
  onSelectTask?: (id: string) => void;
};

const TaskTab: React.FC<TaskTabProps> = ({ tasks, selectedTaskId, onSelectTask }) => {
  const uncompletedTasks = tasks.filter((task) => task.status === 'uncompleted' || task.status === 'deadline-passed');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const getStatusColor = (status: TaskArgs['status']) => {
    if (status === 'completed') return '#dff8e8';
    if (status === 'deadline-passed') return '#ffe5e5';
    return '#ffffff';
  };

  const fmt = (d: Date) => d.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="task-tab-container">
      <div className="task-column">
        <h2 className="column-title">未完了タスク</h2>
        <div className="task-list-container">
          {uncompletedTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              deadline={fmt(task.deadline as Date)}
              categoryColor={task.categories[0]?.color ?? '#888'}
              statusColor={getStatusColor(task.status)}
              isSelected={task.id === selectedTaskId}
              onSelect={() => task.id && onSelectTask?.(task.id)}
              type={task.type}
              intervalDays={task.type === 'habit' ? task.intervalDays : undefined}
            />
          ))}
        </div>
      </div>

      <div className="task-column">
        <h2 className="column-title">完了タスク</h2>
        <div className="task-list-container">
          {completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              deadline={fmt(task.deadline as Date)}
              categoryColor={task.categories[0]?.color ?? '#888'}
              statusColor={getStatusColor(task.status)}
              isSelected={task.id === selectedTaskId}
              onSelect={() => task.id && onSelectTask?.(task.id)}
              type={task.type}
              intervalDays={task.type === 'habit' ? task.intervalDays : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskTab;
