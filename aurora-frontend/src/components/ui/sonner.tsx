import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-amber-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600",
          success: "group-[.toast]:!bg-green-50 group-[.toast]:!border-green-200 group-[.toast]:!text-green-800",
          error: "group-[.toast]:!bg-red-50 group-[.toast]:!border-red-200 group-[.toast]:!text-red-800",
          warning: "group-[.toast]:!bg-yellow-50 group-[.toast]:!border-yellow-200 group-[.toast]:!text-yellow-800",
          info: "group-[.toast]:!bg-blue-50 group-[.toast]:!border-blue-200 group-[.toast]:!text-blue-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

