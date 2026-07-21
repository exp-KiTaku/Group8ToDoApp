// src/components/CategoryDropDownList/CategoryDropDownList.tsx
import React, { useEffect, useRef, useState } from 'react'
import './CategoryDropDownList.css'
import TaskEditButton from '../TaskEditButton/TaskEditButton'

type Category = {
  id: number
  name: string
  color: string
}

type CategoryDropDownListProps = {
  categories?: Category[]
  selectedCategoryIds?: number[]
  onSelectionChange?: (ids: number[]) => void
  onOpenEdit: () => void
  onOpenTaskEdit?: () => void
  showTaskEditButton?: boolean
  showAllOption?: boolean
}

const CategoryDropDownList: React.FC<CategoryDropDownListProps> = ({
  categories: categoriesProp,
  selectedCategoryIds = [0],
  onSelectionChange,
  onOpenEdit,
  onOpenTaskEdit,
  showTaskEditButton = true,
  showAllOption = true,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const categories = categoriesProp ?? [
    { id: 1, name: '仕事', color: '#ff6347' },
    { id: 2, name: '学習', color: '#1e90ff' },
    { id: 3, name: 'プライベート', color: '#32cd32' },
  ]
  const dropdownCategories = showAllOption
    ? [{ id: 0, name: 'すべて', color: '#888' }, ...categories]
    : categories

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (id: number) => {
    if (id === 0) {
      onSelectionChange?.([0])
      return
    }

    const currentSelection = selectedCategoryIds.includes(0)
      ? []
      : [...selectedCategoryIds]

    const nextSelection = currentSelection.includes(id)
      ? currentSelection.filter((categoryId) => categoryId !== id)
      : [...currentSelection, id]

    onSelectionChange?.(nextSelection.length === 0 ? [0] : nextSelection)
  }

  const handleOpenEdit = () => {
    onOpenEdit()
    setIsOpen(false)
  }

  const selectedNames = dropdownCategories
    .filter((cat) => selectedCategoryIds.includes(cat.id))
    .map((cat) => cat.name)

  const buttonLabel = selectedNames.length === 0 || selectedCategoryIds.includes(0)
    ? 'すべて'
    : selectedNames.join('・')

  return (
    <div className="task-toolbar" ref={dropdownRef}>
      <button className="category-filter-btn" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? '▼' : '▶'} {buttonLabel}
      </button>
      {showTaskEditButton && onOpenTaskEdit && (
        <TaskEditButton onClick={onOpenTaskEdit} label="+" />
      )}

      {isOpen && (
        <div className="dropdown-overlay">
          <div className="category-dropdown">
            <div className="list-items">
              {dropdownCategories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id)

                return (
                  <button
                    key={cat.id}
                    className={`item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(cat.id)}
                  >
                    <span className="dot" style={{ backgroundColor: cat.color }}></span>
                    <span className="item-label">{cat.name}</span>
                    {isSelected && <span className="check-mark">✓</span>}
                  </button>
                )
              })}
            </div>

            <button className="add-btn" onClick={handleOpenEdit}>
              + 新規作成
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryDropDownList