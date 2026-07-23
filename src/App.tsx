import './App.css'
import { useEffect, useState } from 'react'
import NavBar from './components/Navbar/NavBar'
import SideBar from './components/SideBar/SideBar'
import TaskTab from './components/TaskTab/TaskTab'
import Footer from './components/Footer/Footer'
import TaskEditWindow from './components/TaskEditWindow/TaskEditWindow'
import CategoryEditWindow from './components/CategoryEditWindow/CategoryEditWindow'
import CategoryDropDownList from './components/CategoryDropDownList/CategoryDropDownList'
import { Category } from './models/Category'
import { CATEGORY_ID_ALL } from './constants/constants'
import { container } from './infrastructure/container'
import { TYPES } from './infrastructure/types'
import type { ICategoryService } from './services/ICategoryService'
import type { ITaskService } from './services/ITaskService'
import type { TaskArgs } from './models/TaskArgs'

function App() {
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false)
  const [isTaskEditOpen, setIsTaskEditOpen] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([CATEGORY_ID_ALL])
  const [categories, setCategories] = useState<Category[]>([])
  const [tasks, setTasks] = useState<TaskArgs[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const taskService = container.get<ITaskService>(TYPES.ITaskService)
  const categoryService = container.get<ICategoryService>(TYPES.ICategoryService)

  const loadData = async () => {
    const [loadedCategories, loadedTasks] = await Promise.all([
      categoryService.getAllCategories(),
      taskService.getAllTaskArgs(),
    ])

    setCategories(loadedCategories)
    setTasks(loadedTasks)
  }

  useEffect(() => {
    void loadData()
  }, [])

  const handleCreateTask = async (args: TaskArgs) => {
    await taskService.createTask(args)
    await loadData()
    setIsTaskEditOpen(false)
  }

  const handleCreateCategory = async (name: string, color: string) => {
    await categoryService.createCategory(name, color)
    await loadData()
    setIsCategoryEditOpen(false)
  }

  const handleSelectTask = (id: string) => {
    setSelectedTaskId(id)
  }

  const handleDeleteSelectedTask = async () => {
    if (!selectedTaskId) return

    await taskService.deleteTask(selectedTaskId)
    setSelectedTaskId(null)
    await loadData()
  }

  const handleCompleteSelectedTask = async () => {
    if (!selectedTaskId) return

    const targetTask = tasks.find((task) => task.id === selectedTaskId)
    if (!targetTask) return

    if (targetTask.status === 'completed' || targetTask.status === 'deadline-passed') {
      await taskService.uncompleteTask(selectedTaskId)
    } else {
      await taskService.completeTask(selectedTaskId)
    }

    await loadData()
  }

  const handleSkipSelectedTask = async () => {
    if (!selectedTaskId) return

    const targetTask = tasks.find((task) => task.id === selectedTaskId)
    if (!targetTask || targetTask.type !== 'habit') return

    await taskService.skipHabitTask(selectedTaskId)
    await loadData()
  }

  const visibleTasks = selectedCategoryIds.includes(CATEGORY_ID_ALL)
    ? tasks
    : tasks.filter((task) => task.categories.some((category) => selectedCategoryIds.includes(category.id)))

  return (
    <div className="app-shell">
      <NavBar />
      <div className="app-body">
        <main className="main-content">
          <div className="toolbar-row">
            <CategoryDropDownList
              categories={categories}
              selectedCategoryIds={selectedCategoryIds}
              onSelectionChange={setSelectedCategoryIds}
              onOpenEdit={() => setIsCategoryEditOpen(true)}
              onOpenTaskEdit={() => setIsTaskEditOpen(true)}
            />
          </div>

          <TaskTab
            tasks={visibleTasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={handleSelectTask}
          />

          <CategoryEditWindow
            isOpen={isCategoryEditOpen}
            onClose={() => setIsCategoryEditOpen(false)}
            onCreateCategory={handleCreateCategory}
          />
          <TaskEditWindow
            isOpen={isTaskEditOpen}
            onClose={() => setIsTaskEditOpen(false)}
            onOpenCategoryEdit={() => {
              setIsTaskEditOpen(false)
              setIsCategoryEditOpen(true)
            }}
            categories={categories}
            onCreateTask={handleCreateTask}
          />
        </main>
        <SideBar
          selectedTask={tasks.find((task) => task.id === selectedTaskId) ?? null}
          onDeleteTask={handleDeleteSelectedTask}
          onCompleteTask={handleCompleteSelectedTask}
          onSkipTask={handleSkipSelectedTask}
        />
      </div>
      <Footer />
    </div>
  )
}

export default App