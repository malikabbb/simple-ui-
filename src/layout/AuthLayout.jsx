import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50/50 p-4 font-sans text-slate-900">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
