import { DateTime } from 'luxon';

export const formatDateTime = function (datetime: string): string {
  return datetime
    ? DateTime.fromFormat(datetime, 'yyyy-mm-dd hh:mm:ss').toLocaleString(DateTime.DATETIME_SHORT)
    : '-';
};
