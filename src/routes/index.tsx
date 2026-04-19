import { AuthForm } from '#/modules/auth/auth-form'
import { createFileRoute } from '@tanstack/react-router'
import { requireGuest } from '#/lib/auth/route-guards'

export const Route = createFileRoute('/')({
  ssr: false,
  beforeLoad: requireGuest,
  component: App,
})

function App() {
  return <AuthForm />
}
