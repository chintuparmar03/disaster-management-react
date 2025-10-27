import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Flame, AlertTriangle, Mountain, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Dropdown Button Component
interface DisasterOption {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

interface DropdownButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  onSelectDisaster?: (disasterId: string) => void
}

const disasterOptions: DisasterOption[] = [
  {
    id: "fire",
    label: "Fire",
    icon: <Flame className="w-4 h-4" />,
    color: "hover:bg-red-50 text-red-700"
  },
  {
    id: "accident",
    label: "Accident",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "hover:bg-yellow-50 text-yellow-700"
  },
  {
    id: "landslide",
    label: "Landslide",
    icon: <Mountain className="w-4 h-4" />,
    color: "hover:bg-orange-50 text-orange-700"
  }
]

const DropdownButton = React.forwardRef<HTMLButtonElement, DropdownButtonProps>(
  ({ variant = "default", size = "default", onSelectDisaster, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelectOption = (disasterId: string) => {
      onSelectDisaster?.(disasterId)
      setIsOpen(false)
    }

    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          Report Disaster
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
            {disasterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  option.color
                } border-b last:border-b-0`}
              >
                {option.icon}
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
DropdownButton.displayName = "DropdownButton" 

export { Button, DropdownButton, buttonVariants }