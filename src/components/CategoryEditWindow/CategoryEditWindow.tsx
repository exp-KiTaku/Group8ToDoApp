import React, { useEffect, useState } from 'react';
import './CategoryEditWindow.css';

type CategoryEditWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory?: (name: string, color: string) => void | Promise<void>;
};

const CategoryEditWindow: React.FC<CategoryEditWindowProps> = ({ isOpen, onClose, onCreateCategory }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ff6347');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setColor('#ff6347');
    }
  }, [isOpen]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) return;

    await onCreateCategory?.(name.trim(), color);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header-bar">
          <span>新規カテゴリー</span>
          <button className="close-btn" onClick={onClose} type="button">×</button>
        </div>

        <form className="modal-body" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="カテゴリー名を入力"
            className="input-category"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <div className="selector-row">
            <input
              type="color"
              className="input-category"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
            <span>{color}</span>
          </div>

          <div className="modal-footer">
            <button className="create-btn" type="submit">作成</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditWindow;