import * as React from "react"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      className={cn(
        "peer h-4 w-8 rounded-full appearance-none bg-muted transition-colors data-[checked]:bg-primary relative after:absolute after:top-0 after:left-0 after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all data-[checked]:after:left-4",
        className
      )}
      data-checked={props.checked ? "" : undefined}
      ref={ref}
      {...props}
    />
  )
)
Switch.displayName = "Switch"

export { Switch }
