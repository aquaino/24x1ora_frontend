import { dayjs, type FormInstance } from 'element-plus';
import { useAppStore } from '@/store';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const formatDateTime = function (datetime: string, toFormat: string): string {
  if (datetime) {
    return dayjs(datetime).format(toFormat);
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

/**
 * Validates Italian tax code (Codice Fiscale) or VAT number (Partita IVA)
 * @param taxCode - The tax code to validate (11 or 16 characters)
 * @returns true if valid, false otherwise
 */
export function validateTaxCode(taxCode: string): boolean {
  const code = taxCode.trim().toUpperCase();

  // Accept 11 or 16 zeros as valid
  if (code === '00000000000' || code === '0000000000000000') {
    return true;
  }

  // =========================
  // VAT Number (11 digits)
  // =========================
  if (/^[0-9]{11}$/.test(code)) {
    let sum = 0;

    for (let i = 0; i < 11; i++) {
      let digit = parseInt(code[i], 10);

      if (i % 2 === 0) {
        sum += digit;
      } else {
        digit *= 2;
        if (digit > 9) digit -= 9;
        sum += digit;
      }
    }

    return sum % 10 === 0;
  }

  // =========================
  // Fiscal Code (16 characters)
  // =========================
  if (!/^[A-Z0-9]{16}$/.test(code)) {
    return false;
  }

  const evenMap: Record<string, number> = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
    'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
    'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25,
  };

  const oddMap: Record<string, number> = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
    'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23,
  };

  let sum = 0;

  for (let i = 0; i < 15; i++) {
    const char = code[i];
    if (i % 2 === 0) {
      sum += oddMap[char];
    } else {
      sum += evenMap[char];
    }
  }

  const checkChar = String.fromCharCode((sum % 26) + 65);

  return checkChar === code[15];
}
