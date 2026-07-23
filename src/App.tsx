import './App.css'
import { useState } from 'react'
import NavBar from './components/Navbar/NavBar'
import SideBar from './components/SideBar/SideBar'
import TaskTab from './components/TaskTab/TaskTab'
import Footer from './components/Footer/Footer'
import TaskEditWindow from './components/TaskEditWindow/TaskEditWindow'
import CategoryEditWindow from './components/CategoryEditWindow/CategoryEditWindow'
import CategoryDropDownList from './components/CategoryDropDownList/CategoryDropDownList'
import { Category } from './models/Category'

function App() {
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false)
  const [isTaskEditOpen, setIsTaskEditOpen] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(['0'])
  
  // テスト用カテゴリーデータ
  const [categories] = useState<Category[]>([
    new Category('1', '仕事', '#ff6347'),
    new Category('2', '学習', '#1e90ff'),
    new Category('3', 'プライベート', '#32cd32'),
  ])

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
            categories={categories}
          />
        </main>
        <SideBar />
      </div>
      <Footer />
    </div>
  )
}

export default App