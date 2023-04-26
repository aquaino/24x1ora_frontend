import { DateTime } from 'luxon';
import type { FormInstance } from 'element-plus';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { useRouter } from 'vue-router';

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

export function hasAttachment(regexForName: RegExp, attachments: string[]): boolean {
  return attachments.some((fileName) => regexForName.test(fileName)) ? true : false;
}

export function logout(redirectToLogin: boolean) {
  const userStore = useUserStore();
  const router = useRouter();
  userStore.$reset();
  axios.defaults.headers.common['Authorization'] = '';
  if (redirectToLogin) router.push({ name: 'login' });
}
