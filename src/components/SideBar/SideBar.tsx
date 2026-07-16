// src/components/SideBar.tsx
import React, { useEffect, useRef, useState } from 'react';
import './SideBar.css';

const MIN_WIDTH = 240;
const MAX_WIDTH = 640;
const DEFAULT_WIDTH = 240;

const SideBar: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const startXRef = useRef(0);
  const startWidthRef = useRef(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const delta = startXRef.current - event.clientX;
      const nextWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + delta));
      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handlePointerDown = (event: React.MouseEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX;
    startWidthRef.current = sidebarWidth;
    setIsDragging(true);
    event.preventDefault();
  };

  return (
    <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
      <div className="sidebar-resizer" onMouseDown={handlePointerDown} />
      {/* 1. タスク情報閲覧エリア */}
      <div className="sidebar-section task-info">
        <h2 className="task-title">Title</h2>
        <div className="task-meta">期限: 〇月〇日</div>
        <div className="task-labels">
          <span className="label-category">カテゴリー名</span>
          <span className="label-status">ステータス</span>
        </div>
        <div className="task-description">説明</div>
      </div>

      {/* 2. 操作エリア */}
      <div className="sidebar-section task-actions">
        <button className="action-btn">🗑️</button>
        <button className="action-btn">≫</button>
        <button className="action-btn">✔</button>
      </div>

      {/* 3. カレンダーエリア（枠のみ） */}
      <div className="sidebar-section calendar-area">
        <div className="calendar-placeholder">
          [カレンダーコンポーネント配置予定]
        </div>
      </div>
    </aside>
  );
};

export default SideBar;