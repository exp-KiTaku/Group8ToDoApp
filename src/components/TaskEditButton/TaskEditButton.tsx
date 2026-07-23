import React from 'react'
import './TaskEditButton.css'

type TaskEditButtonProps = {
  onClick: () => void
  label?: string
}

const TaskEditButton: React.FC<TaskEditButtonProps> = ({ onClick, label = '+' }) => {
  return (
    <button className="task-edit-button" onClick={onClick}>
      {label}
    </button>
  )
}

export default TaskEditButton

