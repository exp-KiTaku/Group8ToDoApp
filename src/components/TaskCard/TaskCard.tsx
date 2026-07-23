import React from 'react';
import './TaskCard.css';

type TaskCardProps = {
  title: string;
  deadline: string;
  categoryColor: string;
  statusColor: string;
  isSelected?: boolean;
  onSelect?: () => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ title, deadline, categoryColor, statusColor, isSelected = false, onSelect }) => {
  return (
    <button
      type="button"
      className={`task-card ${isSelected ? 'selected' : ''}`}
      style={{ backgroundColor: statusColor }}
      onClick={onSelect}
    >
      <div className="task-icon" style={{ backgroundColor: categoryColor }}></div>
      <div className="task-content">
        <div className="taskcard-title">{title}</div>
        <div className="task-dueDate">{deadline}</div>
      </div>
    </button>
  );
};

export default TaskCard;