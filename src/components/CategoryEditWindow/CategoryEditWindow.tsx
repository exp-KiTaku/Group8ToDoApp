// src/components/CategoryEditWindow.tsx
import React from 'react';
import './CategoryEditWindow.css';


type CategoryEditWindowProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CategoryEditWindow: React.FC<CategoryEditWindowProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header-bar">
          <span>新規カテゴリー</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <input type="text" placeholder="カテゴリー名を入力" className="input-category" />
          
          <div className="color-selector">
            <div className="selected-color-dot"></div>
            <span>カテゴリーカラー</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="create-btn">作成</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditWindow;