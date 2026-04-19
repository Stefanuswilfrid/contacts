import { AuthForm } from '#/modules/auth/auth-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <AuthForm />
}
