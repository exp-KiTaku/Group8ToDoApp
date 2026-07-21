import React from 'react';
import './TaskCard.css';

type TaskCardProps = {
  title: string;
  dueDate: string;
  categoryColor: string; // カテゴリーに基づく色
  statusColor: string;  // カード全体の背景色

  //ここにserviceの関数をいれるpropsがはいる
};

const TaskCard: React.FC<TaskCardProps> = ({ title, dueDate, categoryColor, statusColor }) => {
  return (
    <div className="task-card" style={{ backgroundColor: statusColor }}>
      {/* カテゴリー色を反映したアイコン */}
      <div className="task-icon" style={{ backgroundColor: categoryColor }}></div>
      <div className="task-content">
        <div className="taskcard-title">{title}</div>
        <div className="task-dueDate">{dueDate}</div>
      </div>
    </div>
  );
};

export default TaskCard;