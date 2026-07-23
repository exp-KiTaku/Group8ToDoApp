import React from 'react';
import './TaskCard.css';

type TaskCardProps = {
  title: string;
  deadline: string;
  categoryColor: string;
  statusColor: string;
  isSelected?: boolean;
  onSelect?: () => void;
  type?: 'normal' | 'habit';
  intervalDays?: number; // 習慣タスクの場合のみ使用
};

const TaskCard: React.FC<TaskCardProps> = ({ title, deadline, categoryColor, statusColor, isSelected = false, onSelect, type, intervalDays }) => {
  return (
    <button
      type="button"
      className={`task-card ${isSelected ? 'selected' : ''}`}
      style={{ backgroundColor: statusColor }}
      onClick={onSelect}
    >
      <div className="task-icon" style={{ backgroundColor: categoryColor }}>
        
      </div>
      <div className="task-content">
        <div className="taskcard-title">{title}</div>
        <div className="task-dueDate">{deadline + (type === 'habit' ? '🔄' + intervalDays + '日' : '')}</div>
      </div>
    </button>
  );
};

export default TaskCard;