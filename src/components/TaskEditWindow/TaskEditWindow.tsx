import React, { useEffect, useRef, useState } from 'react'
import './TaskEditWindow.css'
import CategoryDropDownList from '../CategoryDropDownList/CategoryDropDownList'
import type { Category } from '../../models/Category'
import type { TaskArgs } from '../../models/TaskArgs'

type TaskEditWindowProps = {
  isOpen: boolean
  onClose: () => void
  onOpenCategoryEdit?: () => void
  categories?: Category[]
  onCreateTask?: (args: TaskArgs) => void | Promise<void>
}

type TaskType = '通常タスク' | '習慣タスク'

const TaskEditWindow: React.FC<TaskEditWindowProps> = ({ isOpen, onClose, onOpenCategoryEdit, categories, onCreateTask }) => {
  const [taskType, setTaskType] = useState<TaskType>('通常タスク')
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [intervalDays, setIntervalDays] = useState('')
  const [hasCategoryError, setHasCategoryError] = useState(false)
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

  useEffect(() => {
    if (!isOpen) {
      setTaskType('通常タスク')
      setIsTypeOpen(false)
      setSelectedCategoryIds([])
      setTitle('')
      setDescription('')
      setDeadline('')
      setIntervalDays('')
      setHasCategoryError(false)
    }
  }, [isOpen])

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!title.trim()) {
      setHasCategoryError(true)
      return
    }

    if (!deadline.trim()) {
      setHasCategoryError(true)
      return
    }

    const selectedCategories = (categories ?? []).filter((category) => selectedCategoryIds.includes(category.id))
    if (selectedCategories.length === 0) {
      setHasCategoryError(true)
      return
    }
    setHasCategoryError(false)

    const parsedIntervalDays = taskType === '習慣タスク' ? Number(intervalDays) : undefined

    if (taskType === '習慣タスク' && (parsedIntervalDays === undefined || !Number.isInteger(parsedIntervalDays) || parsedIntervalDays <= 0)) {
      setHasCategoryError(true)
      return
    }

    const newTask: TaskArgs = {
      type: taskType === '習慣タスク' ? 'habit' : 'normal',
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      categories: selectedCategories,
      status: 'uncompleted',
      deadline: deadline ? new Date(deadline) : new Date(),
      completedAt: null,
      intervalDays: parsedIntervalDays,
    }

    await onCreateTask?.(newTask)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header-bar">
          <span>新規タスク</span>
          <button className="close-btn" onClick={onClose} type="button">×</button>
        </div>

        <form className="modal-body" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="タイトルを入力"
            className="input-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <div className="editor-grid">
            <input
                type="datetime-local"
                className="input-title"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
            />
            {taskType === '習慣タスク' && (

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="周期（日）"
                className="input-title"
                value={intervalDays}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/[^0-9]/g, '')
                  setIntervalDays(nextValue)
                }}
              />
          )}
          </div>

          <div className="selector-row">
            <div className="type-selector" ref={dropdownRef}>
              <button className="type-dropdown-btn" onClick={() => setIsTypeOpen((prev) => !prev)} type="button">
                {isTypeOpen ? '▼' : '▶'} {taskType}
              </button>
              {isTypeOpen && (
                <div className="type-dropdown-menu">
                  {(['通常タスク', '習慣タスク'] as TaskType[]).map((type) => (
                    <button
                      key={type}
                      className={`type-dropdown-item ${type === taskType ? 'selected' : ''}`}
                      onClick={() => {
                        setTaskType(type)
                        setIsTypeOpen(false)
                      }}
                      type="button"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
              
            </div>
            <CategoryDropDownList
              categories={categories}
              selectedCategoryIds={selectedCategoryIds}
              onSelectionChange={setSelectedCategoryIds}
              onOpenEdit={() => onOpenCategoryEdit?.()}
              showTaskEditButton={false}
              showAllOption={false}
            />

            
          </div>

          
            <textarea
              placeholder="説明を入力"
              className="input-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            
          

          {hasCategoryError && (
            <div className="error-message">未入力の項目があります。</div>
          )}

          

          <div className="modal-footer">
            <button className="create-btn" type="submit">作成</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskEditWindow;