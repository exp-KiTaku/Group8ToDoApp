import React from 'react'
import './CategoryCard.css'

type CategoryCardProps = {
  name: string
  color: string
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, color }) => {
  return (
    <div className="category-card">
      <span className="category-dot" style={{ backgroundColor: color }}></span>
      <span className="category-label">{name}</span>
    </div>
  )
}

export default CategoryCard