// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "@/pages/auth/login"
import Dashboard from "@/pages/dashboard/Dashboard"
import ProtectedRoute from "@/components/common/ProtectedRoute"
import MainLayout from "@/components/layout/MainLayout"
import Users from "@/pages/users/Users"
import Trainers from "@/pages/trainers/trainers"
import CreateTrainer from "@/pages/trainers/CreateTrainer"
import TrainerDetails from "@/pages/trainers/TrainerDetails"
import Courses from "@/pages/courses/Courses"
import Opportunities from "@/pages/opportunity/Opportunities"
import OpportunityDetails from "@/pages/opportunity/OpportunityDetails"
import CreateOpportunity from "@/pages/opportunity/CreateOpportunity"
import CourseDetails from "@/pages/courses/CourseDetails"
import CreateCourse from "@/pages/courses/CreateCourse"
import Salles from "@/pages/salles/Salles"
import CreateSalle from "@/pages/salles/CreateSalle"
import SalleDetails from "@/pages/salles/SalleDetails"
import Sessions from "@/pages/session/Sessions"
import SessionDetails from "@/pages/session/SessionDetails"
import CreateSession from "@/pages/session/CreateSession"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />

        {/* protected */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/trainers" element={<Trainers/>} />
          <Route path="/trainers/new" element={<CreateTrainer />} />
          <Route path="/trainers/details" element={<TrainerDetails />} />
          <Route path="/courses" element={<Courses/>} />
          <Route path="/courses/:id" element={<CourseDetails/>} />
          <Route path="/courses/create" element={<CreateCourse/>} />

          <Route path="/salles" element={<Salles/>} />
          <Route path="/salles/create" element={<CreateSalle/>} />
          <Route path="/salles/:id" element={<SalleDetails/>} />

           <Route path="/sessions" element={<Sessions/>} />
           <Route path="/sessions/new" element={<CreateSession/>} />
           <Route path="/sessions/:id" element={<SessionDetails/>} />


          <Route path="/crm/opportunities" element={<Opportunities/>} />
          
          <Route path="/crm/create_opportunity" element={<CreateOpportunity/>} />
          <Route path="/crm/opportunities/:id" element={<OpportunityDetails/>} />
          


          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}