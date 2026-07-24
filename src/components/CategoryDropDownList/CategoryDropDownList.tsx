// src/components/CategoryDropDownList/CategoryDropDownList.tsx
import React, { useEffect, useRef, useState } from 'react'
import './CategoryDropDownList.css'
import TaskEditButton from '../TaskEditButton/TaskEditButton'
import { Category } from '../../models/Category'
import { CATEGORY_ID_ALL, CATEGORY_ALL } from '../../constants/constants'

type CategoryDropDownListProps = {
  categories?: Category[]
  selectedCategoryIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  onOpenEdit: () => void
  onOpenTaskEdit?: () => void
  showTaskEditButton?: boolean
  showAllOption?: boolean
  onEditCategory?: (categoryId: string) => void
  onDeleteCategory?: (categoryId: string) => void | Promise<void>
  isCategoryUsed?: (categoryId: string) => Promise<boolean>
}

type ContextMenuState = {
  x: number
  y: number
  category: Category
} | null

const CategoryDropDownList: React.FC<CategoryDropDownListProps> = ({
  categories: categoriesProp,
  selectedCategoryIds = [CATEGORY_ID_ALL],
  onSelectionChange,
  onOpenEdit,
  onOpenTaskEdit,
  showTaskEditButton = true,
  showAllOption = true,
  onEditCategory,
  onDeleteCategory,
  isCategoryUsed,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  //右クリックメニューの状態
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [contextMenuError, setContextMenuError] = useState<string | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const categories = categoriesProp ?? []
  const dropdownCategories = showAllOption
    ? [CATEGORY_ALL, ...categories]
    : categories

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('handleClickOutside called')
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null)
        setContextMenuError(null)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (id: string) => {
    if (id === CATEGORY_ID_ALL) {
      onSelectionChange?.([CATEGORY_ID_ALL])
      return
    }

    const currentSelection = selectedCategoryIds.includes(CATEGORY_ID_ALL)
      ? []
      : [...selectedCategoryIds]

    const nextSelection = currentSelection.includes(id)
      ? currentSelection.filter((categoryId) => categoryId !== id)
      : [...currentSelection, id]

    onSelectionChange?.(nextSelection.length === 0 ? [CATEGORY_ID_ALL] : nextSelection)
  }

  const handleContextMenu = (e: React.MouseEvent, cat: Category) => {
    // 全体（全て）カテゴリーに対してはメニューを出したくない場合はここでスキップ
    if (cat.id === CATEGORY_ID_ALL) return

    e.preventDefault() // ブラウザ標準の右クリックメニューを抑制
    e.stopPropagation()

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      category: cat,
    })
    setContextMenuError(null)
  }
  

  const handleOpenEdit = () => {
    onOpenEdit()
    setIsOpen(false)
  }

  const selectedNames = dropdownCategories
    .filter((cat) => selectedCategoryIds.includes(cat.id))
    .map((cat) => cat.name)

  const buttonLabel = selectedNames.length === 0 || selectedCategoryIds.includes(CATEGORY_ID_ALL)
    ? 'カテゴリー'
    : selectedNames.join('・')

  return (
    <div className="category-toolbar" ref={dropdownRef}>
      <button type="button" className="category-filter-btn" onClick={() => setIsOpen((prev) => !prev)}>
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
                    type="button"
                    key={cat.id}
                    className={`item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(cat.id)}
                    onContextMenu={(e) => handleContextMenu(e, cat)}
                  >
                    <span className="dot" style={{ backgroundColor: cat.color }}></span>
                    <span className="item-label">{cat.name}</span>
                    {isSelected && <span className="check-mark">✓</span>
                    }
                  </button>
                )
              })}
            </div>

            <button type="button" className="add-btn" onClick={handleOpenEdit}>
              + 新規作成
            </button>
          </div>
        </div>
      )}

      {contextMenu && (
        <div
          className="context-menu"
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          {/*
          <button
            type="button"
            onClick={() => {
              onEditCategory?.(contextMenu.category.id)
              setContextMenu(null)
            }}
          >
            編集
          </button>
          */}
          <button
            type="button"
            className="danger"
            onClick={async () => {
              const categoryId = contextMenu.category.id

              try {
                if (isCategoryUsed && (await isCategoryUsed(categoryId))) {
                  setContextMenuError('このカテゴリーは使用中のため削除できません。')
                  return
                }

                await onDeleteCategory?.(categoryId)
                setContextMenu(null)
                setContextMenuError(null)
              } catch {
                setContextMenuError('カテゴリーの削除に失敗しました。')
              }
            }}
          >
            削除
          </button>
          {contextMenuError && <div className="context-menu-error">{contextMenuError}</div>}
        </div>
      )}
    </div>
  )
}



export default CategoryDropDownList
