import { DateTime } from 'luxon';
import type { FormInstance } from 'element-plus';

export const formatDateTime = function (datetime: string, fromFormat?: string): string {
  if (fromFormat === 'ISO') {
    return datetime ? DateTime.fromISO(datetime).toLocaleString(DateTime.DATETIME_SHORT) : '-';
  } else {
    return datetime
      ? DateTime.fromFormat(datetime, 'yyyy-mm-dd hh:mm:ss').toLocaleString(DateTime.DATETIME_SHORT)
      : '-';
  }
};

export const formatDate = function (datetime: string): string {
  return DateTime.fromFormat(datetime, 'yyyy-mm-dd hh:mm:ss').toLocaleString(DateTime.DATE_SHORT);
};

export async function resetForm(formRef: FormInstance | undefined) {
  if (!formRef) return;
  formRef.resetFields();
}
