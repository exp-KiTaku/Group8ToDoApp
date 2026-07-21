// src/components/TaskEditWindow.tsx
import React, { useEffect, useRef, useState } from 'react'
import './TaskEditWindow.css'
import CategoryDropDownList from '../CategoryDropDownList/CategoryDropDownList'

type TaskEditWindowProps = {
  isOpen: boolean
  onClose: () => void
  onOpenCategoryEdit?: () => void
}

type TaskType = '通常タスク' | '習慣タスク'

const TaskEditWindow: React.FC<TaskEditWindowProps> = ({ isOpen, onClose, onOpenCategoryEdit }) => {
  const [taskType, setTaskType] = useState<TaskType>('通常タスク')
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false)
      }
    }

    if (isTypeOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isTypeOpen])

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
            <div className="type-selector" ref={dropdownRef}>
              <button className="type-dropdown-btn" onClick={() => setIsTypeOpen((prev) => !prev)}>
                {isTypeOpen ? '▼' : '▶'} {taskType}
              </button>
              {isTypeOpen && (
                <div className="type-dropdown-menu">
                  {( ['通常タスク', '習慣タスク'] as TaskType[]).map((type) => (
                    <button
                      key={type}
                      className={`type-dropdown-item ${type === taskType ? 'selected' : ''}`}
                      onClick={() => {
                        setTaskType(type)
                        setIsTypeOpen(false)
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <CategoryDropDownList
              selectedCategoryIds={selectedCategoryIds}
              onSelectionChange={setSelectedCategoryIds}
              onOpenEdit={() => onOpenCategoryEdit?.()}
              showTaskEditButton={false}
              showAllOption={false}
            />
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