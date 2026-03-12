import { DatePicker as ChakraDatePicker, Portal } from "@chakra-ui/react"
import { CalendarDate } from "@internationalized/date"
import { forwardRef } from "react"
import { LuCalendar } from "react-icons/lu"

export interface DatePickerProps extends ChakraDatePicker.RootProps { }

const formatDate = (date: any) => {
  if (!date) return ""
  return `${date.year}/${String(date.month).padStart(2, "0")}/${String(date.day).padStart(2, "0")}`
}

const parseDate = (value: string) => {
  const parts = value.split("/")
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const day = parseInt(parts[2], 10)
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      try {
        return new CalendarDate(year, month, day)
      } catch {
        return undefined
      }
    }
  }
  return undefined
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(props, ref) {
    return (
      <ChakraDatePicker.Root
        ref={ref}
        format={formatDate}
        parse={parseDate}
        placeholder="yyyy/mm/dd"
        {...props}
      >
        <ChakraDatePicker.Control>
          <ChakraDatePicker.Input />
          <ChakraDatePicker.IndicatorGroup>
            <ChakraDatePicker.Trigger>
              <LuCalendar />
            </ChakraDatePicker.Trigger>
          </ChakraDatePicker.IndicatorGroup>
        </ChakraDatePicker.Control>
        <Portal>
          <ChakraDatePicker.Positioner>
            <ChakraDatePicker.Content>
              <ChakraDatePicker.View view="day">
                <ChakraDatePicker.Header />
                <ChakraDatePicker.DayTable />
              </ChakraDatePicker.View>
              <ChakraDatePicker.View view="month">
                <ChakraDatePicker.Header />
                <ChakraDatePicker.MonthTable />
              </ChakraDatePicker.View>
              <ChakraDatePicker.View view="year">
                <ChakraDatePicker.Header />
                <ChakraDatePicker.YearTable />
              </ChakraDatePicker.View>
            </ChakraDatePicker.Content>
          </ChakraDatePicker.Positioner>
        </Portal>
      </ChakraDatePicker.Root>
    )
  },
)
