// src/components/CategoryDropDownList/CategoryDropDownList.tsx
import React, { useEffect, useRef, useState } from 'react'
import './CategoryDropDownList.css'

type Category = {
  id: number
  name: string
  color: string
}

type CategoryDropDownListProps = {
  categories: Category[]
  onSelect: (id: number) => void
  onOpenEdit: () => void
}

const CategoryDropDownList: React.FC<CategoryDropDownListProps> = ({
  categories,
  onSelect,
  onOpenEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    onSelect(id)
    setIsOpen(false)
  }

  const handleOpenEdit = () => {
    onOpenEdit()
    setIsOpen(false)
  }

  return (
    <div className="task-toolbar" ref={dropdownRef}>
      <button className="category-filter-btn" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? '▼' : '▶'} カテゴリー
      </button>

      {isOpen && (
        <div className="dropdown-overlay">
          <div className="category-dropdown">
            <div className="list-items">
              {categories.map((cat) => (
                <button key={cat.id} className="item" onClick={() => handleSelect(cat.id)}>
                  <span className="dot" style={{ backgroundColor: cat.color }}></span>
                  {cat.name}
                </button>
              ))}
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