"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { JuryDashboard } from "@/components/jury/jury-dashboard"
import { CoordinatorDashboard } from "@/components/coordinator/coordinator-dashboard"

export default function Home() {
  const { user } = useAuth()

  if (!user) {
    return <LoginForm />
  }

  if (user.role === "admin") {
    return <AdminDashboard />
  }

  if (user.role === "coordinator") {
    return <CoordinatorDashboard />
  }

  return <JuryDashboard />
}
