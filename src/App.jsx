import MainPage from './pages/Mainpage'
import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
   <>
   <div className="container-fluid">
    <div className="main-page">
      <MainPage/>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
   </div>
   </>
  )
}

export default App
