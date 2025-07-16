import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './routes/router'
import { RouterProvider } from 'react-router'
import { ToastContainer } from 'react-toastify'
import AuthProvider from './Context/AuthProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider><RouterProvider router={router} /></AuthProvider>
   <ToastContainer></ToastContainer>
  </StrictMode>,
)
