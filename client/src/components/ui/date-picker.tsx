import { format, parse } from "date-fns"
import { ro } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface DatePickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  "data-testid"?: string
}

export function DatePicker({ value, onChange, placeholder = "Selectati data", className, ...props }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const dateValue = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined
  const isValidDate = dateValue && !isNaN(dateValue.getTime())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9",
            !value && "text-muted-foreground",
            className
          )}
          data-testid={props["data-testid"]}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isValidDate ? format(dateValue, "dd.MM.yyyy", { locale: ro }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={isValidDate ? dateValue : undefined}
          onSelect={(date: Date | undefined) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"))
            } else {
              onChange("")
            }
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
