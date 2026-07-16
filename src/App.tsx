import './App.css'
import NavBar from './components/Navbar/NavBar'
import SideBar from './components/SideBar/SideBar'
import TaskTab from './components/TaskTab/TaskTab'
import TaskEditWindow from './components/TaskEditWindow/TaskEditWindow'
import Footer from './components/Footer/Footer'
import CategoryEditWindow from './components/CategoryEditWindow/CategoryEditWindow'

function App() {
  
  return (
    <div className="app-shell">
      <NavBar />
      <div className="app-body">
        <main className="main-content">
          <TaskTab />
          {/* <TaskEditWindow isOpen={true} onClose={() => {}} /> */}
          {/* <CategoryEditWindow isOpen={true} onClose={() => {}} /> */}
        </main>
        <SideBar />
      </div>
      <Footer />
    </div>
  )
}

export default App
