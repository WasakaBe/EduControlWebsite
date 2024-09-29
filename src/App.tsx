import AppRoutes from './Routes/AppRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  return (
    <div>
      <AppRoutes />
      <ToastContainer />
    </div>
  )
}