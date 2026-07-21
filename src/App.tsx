import './App.css'
import { useState } from 'react'
import NavBar from './components/Navbar/NavBar'
import SideBar from './components/SideBar/SideBar'
import TaskTab from './components/TaskTab/TaskTab'
import Footer from './components/Footer/Footer'
import CategoryEditWindow from './components/CategoryEditWindow/CategoryEditWindow'
import CategoryDropDownList from './components/CategoryDropDownList/CategoryDropDownList'


function App() {
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false)

  // 仮データ
  const [categories] = useState([
    { id: 1, name: '仕事', color: '#ff6347' },
    { id: 2, name: '学習', color: '#1e90ff' },
    { id: 3, name: 'プライベート', color: '#32cd32' },
  ])

  const handleCategorySelect = (id: number) => {
    console.log('選択したカテゴリID:', id)
  }

  return (
    <div className="app-shell">
      <NavBar />
      <div className="app-body">
        <main className="main-content">
          <CategoryDropDownList
            categories={categories}
            onSelect={handleCategorySelect}
            onOpenEdit={() => setIsCategoryEditOpen(true)}
          />

          <TaskTab />
          <CategoryEditWindow
            isOpen={isCategoryEditOpen}
            onClose={() => setIsCategoryEditOpen(false)}
          />
        </main>
        <SideBar />
      </div>
      <Footer />
    </div>
  )
}

export default App