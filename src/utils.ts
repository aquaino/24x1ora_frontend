import { DateTime } from 'luxon';
import type { FormInstance } from 'element-plus';

export const formatDateTime = function (datetime: string): string {
  return datetime
    ? DateTime.fromFormat(datetime, 'yyyy-mm-dd hh:mm:ss').toLocaleString(DateTime.DATETIME_SHORT)
    : '-';
};

export async function resetForm(formRef: FormInstance | undefined) {
  if (!formRef) return;
  formRef.resetFields();
}
