"use client"

import { useEffect }
from "react"

import {
  useRouter
} from "next/navigation"

import {
  isAdmin
} from "@/services/authService"

export default function AdminPage() {

  const router =
    useRouter()

  useEffect(() => {

    if (!isAdmin()) {

      router.push(
        "/dashboard"
      )

    }

  }, [])

  return (
    <div>
      Página admin
    </div>
  )
}