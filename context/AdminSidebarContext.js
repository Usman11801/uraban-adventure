"use client"

import { createContext, useContext, useState } from 'react'

const AdminSidebarContext = createContext()

export function AdminSidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true) // Desktop: open by default, Mobile: closed by default

  return (
    <AdminSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AdminSidebarContext.Provider>
  )
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext)
  if (!context) {
    throw new Error('useAdminSidebar must be used within AdminSidebarProvider')
  }
  return context
}

