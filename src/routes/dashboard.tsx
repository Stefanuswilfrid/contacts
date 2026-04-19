import { ContactPage } from '#/modules/contact/views/contact-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ContactPage/>
}
