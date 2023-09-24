import { DateTime } from 'luxon';
import type { FormInstance } from 'element-plus';
import { useAppStore } from '@/store';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const formatDateTime = function (
  datetime: string,
  fromFormat: string,
  toFormat: string,
): string {
  if (datetime) {
    return fromFormat === 'ISO'
      ? DateTime.fromISO(datetime).toLocaleString(DateTime[toFormat])
      : DateTime.fromFormat(datetime, fromFormat).toLocaleString(DateTime[toFormat]);
  } else {
    return '-';
  }
};

export async function resetForm(formRef: FormInstance | undefined) {
  if (!formRef) return;
  formRef.resetFields();
}

export function hasAttachment(regexForName: RegExp, attachments: string[]): boolean {
  return attachments.some((fileName) => regexForName.test(fileName)) ? true : false;
}

export function logout(redirectToLogin: boolean) {
  const store = useAppStore();
  const router = useRouter();
  store.clearUserData();
  store.setActiveMenuItem('1');
  store.navigation.RegistrationsAsTable.filters.race = [];
  axios.defaults.headers.common['Authorization'] = '';
  if (redirectToLogin) router.push({ name: 'login' });
}
