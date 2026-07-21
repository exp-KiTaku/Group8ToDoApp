import './App.css'
import { useState } from 'react'
import NavBar from './components/Navbar/NavBar'
import SideBar from './components/SideBar/SideBar'
import TaskTab from './components/TaskTab/TaskTab'
import Footer from './components/Footer/Footer'
import TaskEditWindow from './components/TaskEditWindow/TaskEditWindow'
import CategoryEditWindow from './components/CategoryEditWindow/CategoryEditWindow'
import CategoryDropDownList from './components/CategoryDropDownList/CategoryDropDownList'

function App() {
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false)
  const [isTaskEditOpen, setIsTaskEditOpen] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([0])

  return (
    <div className="app-shell">
      <NavBar />
      <div className="app-body">
        <main className="main-content">
          <div className="toolbar-row">
            <CategoryDropDownList
              selectedCategoryIds={selectedCategoryIds}
              onSelectionChange={setSelectedCategoryIds}
              onOpenEdit={() => setIsCategoryEditOpen(true)}
              onOpenTaskEdit={() => setIsTaskEditOpen(true)}
            />
          </div>

          <TaskTab />
          
          <CategoryEditWindow
            isOpen={isCategoryEditOpen}
            onClose={() => setIsCategoryEditOpen(false)}
          />
          <TaskEditWindow
            isOpen={isTaskEditOpen}
            onClose={() => setIsTaskEditOpen(false)}
            onOpenCategoryEdit={() => {
              setIsTaskEditOpen(false)
              setIsCategoryEditOpen(true)
            }}
          />
        </main>
        <SideBar />
      </div>
      <Footer />
    </div>
  )
}

export default App