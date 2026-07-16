// src/components/TaskEditWindow.tsx
import React from 'react';
import './TaskEditWindow.css';

type TaskEditWindowProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TaskEditWindow: React.FC<TaskEditWindowProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 水色のヘッダー帯 */}
        <div className="modal-header-bar">
          <span>新規タスク</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <input type="text" placeholder="タイトルを入力" className="input-title" />
          
          <div className="selector-row">
            <button className="selector-btn">▶ 通常タスク</button>
            <button className="selector-btn">▶ カテゴリー</button>
          </div>

          <div className="editor-grid">
            <textarea placeholder="説明を入力" className="input-description"></textarea>
            <div className="calendar-placeholder">[カレンダーUI]</div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="create-btn">作成</button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditWindow;