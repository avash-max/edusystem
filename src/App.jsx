import { Toaster } from 'react-hot-toast';
import './App.css'
import Dashboard from './pages/dashboard';
import AdminDashboard from './pages/admindashboard';
function App() {

  return (
    <>
    <Toaster/>
    <Dashboard/>
    <AdminDashboard/>
    </>
  )
}


export default App


