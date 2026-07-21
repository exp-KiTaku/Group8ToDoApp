import React from 'react'
import './CategoryCard.css'

type CategoryCardProps = {
  label: string
  color: string
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ label, color }) => {
  return (
    <div className="category-card">
      <span className="category-dot" style={{ backgroundColor: color }}></span>
      <span className="category-label">{label}</span>
    </div>
  )
}

export default CategoryCard