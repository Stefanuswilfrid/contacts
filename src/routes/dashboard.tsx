import { ContactPage } from '#/modules/contact/views/contact-page'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '#/lib/auth/route-guards'

export const Route = createFileRoute('/dashboard')({
  ssr: false,
  beforeLoad: requireAuth,
  component: RouteComponent,
})

function RouteComponent() {
  return <ContactPage/>
}
