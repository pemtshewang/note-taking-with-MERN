import { useState } from 'react'
import './App.css'
import Layout from "../components/layout"
import Public from '../components/Public'
import { Route } from 'react-router-dom'
import Login from '../features/Login'
import DashLayout from '../components/DashLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path='dash' element={<DashLayout />} />
      </Route>
    </Routes>
  )
}

export default App
