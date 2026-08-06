import { DatePicker as ChakraDatePicker, Portal } from "@chakra-ui/react";
import { CalendarDate, DateFormatter, DateValue } from "@internationalized/date";
import { forwardRef, useMemo } from "react";
import { LuCalendar } from "react-icons/lu";

export type DatePickerProps = ChakraDatePicker.RootProps;

interface LocaleDetails {
  locale: string;
  timeZone: string;
}

/** Detect the user's preferred locale from the browser, falling back to `en-US` (SSR-safe). */
const getLocale = (): string => (typeof navigator !== "undefined" ? navigator.language : "en-US");

/** Options shared by every locale-aware date formatter. */
const dateFormatterOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
} satisfies Intl.DateTimeFormatOptions;

/** Build a `DateFormatter` configured with the date picker's locale details. */
const createDateFormatter = (details: LocaleDetails): DateFormatter =>
  new DateFormatter(details.locale, {
    ...dateFormatterOptions,
    timeZone: details.timeZone,
  });

/** Format a date according to the locale and time zone provided by the date picker. */
const formatDate = (date: DateValue | undefined, details: LocaleDetails): string => {
  if (!date) return "";
  const formatter = createDateFormatter(details);
  return formatter.format(date.toDate(details.timeZone));
};

/** Escape a string so it can be matched literally inside a RegExp. */
const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Parse a locale-formatted date string back into a `CalendarDate`.
 *
 * The expected field ordering and separators are derived from the *same*
 * locale-aware formatter used by `formatDate`, so parsing is the inverse of
 * formatting regardless of how the locale arranges day / month / year.
 */
const parseDate = (value: string, details: LocaleDetails): DateValue | undefined => {
  if (!value) return undefined;

  const formatter = createDateFormatter(details);
  const parts = formatter.formatToParts(new Date(Date.UTC(2000, 0, 1)));

  // Build a regex from the locale's formatted parts: literals become escaped
  // separators, and year/month/day fields become capture groups.
  const tokens: string[] = [];
  const fields: string[] = [];
  for (const part of parts) {
    if (part.type === "literal") {
      tokens.push(escapeRegExp(part.value));
    } else if (part.type === "year" || part.type === "month" || part.type === "day") {
      tokens.push("(\\d+)");
      fields.push(part.type);
    }
  }

  const match = value.trim().match(new RegExp(`^${tokens.join("")}$`));
  if (!match) return undefined;

  const result: Record<string, number> = {};
  for (let i = 0; i < fields.length; i++) {
    result[fields[i]] = parseInt(match[i + 1], 10);
  }

  if (Number.isNaN(result.year) || Number.isNaN(result.month) || Number.isNaN(result.day)) {
    return undefined;
  }

  try {
    return new CalendarDate(result.year, result.month, result.day);
  } catch {
    return undefined;
  }
};

/** Placeholder tokens mapped from a formatted part type (mirrors the date picker's placeholder). */
const PLACEHOLDER_TOKENS: Record<string, string> = {
  day: "dd",
  month: "mm",
  year: "yyyy",
};

/**
 * Build a locale-aware placeholder string (e.g. `mm/dd/yyyy`, `dd.mm.yyyy`,
 * `yyyy/mm/dd`) by reading the field order and separators from the same
 * locale-aware formatter used by `formatDate` and `parseDate`.
 */
const formatPlaceholder = (locale: string, timeZone: string): string => {
  const formatter = createDateFormatter({ locale, timeZone });
  return formatter
    .formatToParts(new Date(Date.UTC(2000, 0, 1)))
    .map((part) => (part.type === "literal" ? part.value : (PLACEHOLDER_TOKENS[part.type] ?? part.value)))
    .join("");
};

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(props, ref) {
  const { locale = getLocale(), timeZone = "UTC", ...rest } = props;
  const placeholder = useMemo(() => formatPlaceholder(locale, timeZone), [locale, timeZone]);

  return (
    <ChakraDatePicker.Root
      ref={ref}
      format={formatDate}
      parse={parseDate}
      locale={locale}
      timeZone={timeZone}
      placeholder={placeholder}
      {...rest}
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
  );
});
