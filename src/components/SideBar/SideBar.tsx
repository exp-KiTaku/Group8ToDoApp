// src/components/SideBar.tsx
import React, { useEffect, useRef, useState } from 'react';
import './SideBar.css';
import CategoryCard from '../CategoryCard/CategoryCard';
import type { TaskArgs } from '../../models/TaskArgs';

type SideBarProps = {
  selectedTask?: TaskArgs | null;
  onDeleteTask?: () => void | Promise<void>;
  onCompleteTask?: () => void | Promise<void>;
  onSkipTask?: () => void | Promise<void>;
};

const MIN_WIDTH = 240;
const MAX_WIDTH = 640;
const DEFAULT_WIDTH = 240;

const SideBar: React.FC<SideBarProps> = ({ selectedTask, onDeleteTask, onCompleteTask, onSkipTask }) => {
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

  const fmt = (d: Date) => d.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

  const getStatusLabel = (status: TaskArgs['status']) => {
    switch (status) {
      case 'completed':
        return { name: '完了', color: '#1eff3c' };
      case 'deadline-passed':
        return { name: '期限切れ', color: '#ff4d4f' };
      case 'uncompleted':
      default:
        return { name: '未完了', color: '#888888' };
    }
  };

  // ★ 削除確認ハンドラー
  const handleDelete = () => {
    if (!selectedTask) return;
    if (window.confirm(`タスク「${selectedTask.title}」を削除してもよろしいですか？`)) {
      void onDeleteTask?.();
    }
  };

  // ★ 完了 / 未完了 切り替え確認ハンドラー
  const handleComplete = () => {
    if (!selectedTask) return;
    
    const isCompleted = selectedTask.status === 'completed';
    const message = isCompleted
      ? `タスク「${selectedTask.title}」を未完了に戻しますか？`
      : `タスク「${selectedTask.title}」を完了にしますか？`;

    if (window.confirm(message)) {
      void onCompleteTask?.();
    }
  };

  // ★ スキップ確認ハンドラー
  const handleSkip = () => {
    if (!selectedTask) return;
    if (window.confirm(`タスク「${selectedTask.title}」をスキップしてもよろしいですか？`)) {
      void onSkipTask?.();
    }
  };

  return (
    <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
      <div className="sidebar-resizer" onMouseDown={handlePointerDown} />
      <div className="sidebar-section task-info">
        <h2 className="task-title">{selectedTask?.title ?? 'タスクを選択してください'}</h2>
        <div className="task-meta">期限: {selectedTask ? fmt(selectedTask.deadline as Date) : '---'}</div>
        <div className="task-labels">
          {selectedTask?.categories.map((category) => (
            <CategoryCard key={category.id} name={category.name} color={category.color} />
          ))}
          {selectedTask && (
            <CategoryCard
              name={getStatusLabel(selectedTask.status).name}
              color={getStatusLabel(selectedTask.status).color}
            />
          )}
        </div>
        <div className="task-description">{selectedTask?.description ?? '説明がありません'}</div>
      </div>

      <div className="sidebar-section task-actions">
        <button className="delete-btn" type="button" onClick={handleDelete} disabled={!selectedTask}>
          🗑️
        </button>
        <button className="skip-btn" type="button" onClick={handleSkip} disabled={!selectedTask || selectedTask.type !== 'habit' || selectedTask.status === 'completed'}>
          ≫
        </button>
        <button className="complete-btn" type="button" onClick={handleComplete} disabled={!selectedTask}>
          ✔
        </button>
      </div>

      {/* 3. カレンダーエリア（枠のみ） */}
      {/*
      <div className="sidebar-section calendar-area">
        <div className="calendar-placeholder">
          [カレンダーコンポーネント配置予定]
        </div>
      </div>
      */}
    </aside>
  );
};

export default SideBar;
