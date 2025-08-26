import type { ContactFormContent } from "../../shared/schemas"

export const defaultContactFormContent: ContactFormContent = {
  title: "Contact Us",
  description: "Get in touch with us",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name", 
      required: true,
      placeholder: "Enter your name"
    },
    {
      name: "email",
      type: "email", 
      label: "Email",
      required: true,
      placeholder: "Enter your email"
    },
    {
      name: "message",
      type: "textarea",
      label: "Message",
      required: true, 
      placeholder: "Enter your message"
    }
  ],
  submitButtonText: "Send Message",
  emailTo: "contact@example.com"
}