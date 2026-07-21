import React from 'react';
import './TaskTab.css';
import TaskCard from '../TaskCard/TaskCard';


const TaskTab: React.FC = () => {
  return (
    <div className="task-tab-container">
      {/* 未完了タスクカラム */}
      <div className="task-column">
        <h2 className="column-title">未完了タスク</h2>
        <div className="task-list-container">
          {/* ここに将来的に TaskCard が並びます */}
            <TaskCard title="タスク1" dueDate="2023-12-31" categoryColor="#ff6347" statusColor="#ffffff" />

        </div>
      </div>

      {/* 完了タスクカラム */}
      <div className="task-column">
        <h2 className="column-title">完了タスク</h2>
        <div className="task-list-container">
          {/* ここに将来的に TaskCard が並びます */}
        </div>
      </div>
    </div>
  );
};

export default TaskTab;