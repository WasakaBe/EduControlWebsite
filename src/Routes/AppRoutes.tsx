import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthContextProvider } from '../Auto/Auth'
import { Admin, Student, Teacher, Pather, Public } from '../Pages'
import { Footer } from '../Sections/Public'
const AppRoutes: React.FC = () => {
  return (
    <>
      <AuthContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Public />} />
            <Route path="/Administration/:userName?" element={<Admin />} />
            <Route path="/Student/:userName?" element={<Student />} />
            <Route path="/Teacher/:userName?" element={<Teacher />} />
            <Route path="/Pather/:userName?" element={<Pather />} />
          </Routes>
        </Router>
      </AuthContextProvider>
      <Footer />
    </>
  )
}

export default AppRoutes
