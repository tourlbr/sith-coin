import { parseISO } from "date-fns";
import { format as dateFnsTZFormat, utcToZonedTime } from "date-fns-tz";

export const formatTimestamp = (iso: string, format: string, timeZone: string): string => {
  return dateFnsTZFormat(
    utcToZonedTime(
      parseISO(iso),
      timeZone,
    ),
    format,
    { timeZone }
  );
}
