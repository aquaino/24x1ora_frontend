<script setup lang="ts">
import type { User } from '@/api/interfaces';
import { usersApi } from '@/api/resources';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDateTime } from '@/utils';
import type { TableColumnCtx } from 'element-plus';

/* DATA */

const { t } = useI18n();

const users: Ref<User[] | null> = ref(null);

const columns = [
  {
    prop: 'id',
    label: 'ID',
    sortable: true,
    width: '70',
    format: null,
  },
  {
    prop: 'name',
    label: t('forms.name'),
    sortable: true,
    width: null,
    format: null,
  },
  {
    prop: 'email',
    label: t('forms.email'),
    sortable: true,
    width: null,
    format: null,
  },
  {
    prop: 'email_verified_at',
    label: t('auth.emailVerifiedAt'),
    sortable: true,
    width: null,
    format: 'date',
  },
  {
    prop: 'isAdmin',
    label: t('auth.isAdmin'),
    sortable: true,
    width: null,
    format: 'boolean',
  },
  {
    prop: 'created_at',
    label: t('general.created'),
    sortable: true,
    width: null,
    format: 'date',
  },
];

const alert = ref({
  type: 'error',
  text: '',
});

/* MOUNTED */

onMounted(async () => {
  await getUsers();
});

/* METHODS */

async function getUsers() {
  try {
    users.value = await usersApi.getUsers();
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}

function format(format: string | null, cellValue: any) {
  if (format === 'date') {
    return formatDateTime(cellValue, 'ISO', 'DATETIME_SHORT');
  } else if (format === 'boolean') {
    return cellValue === 1 ? t('general.yes') : t('general.no');
  } else {
    return cellValue;
  }
}
</script>

<template>
  <AppPageTitle
    :title="$t('users.usersTitle')"
    :subtitle="$t('users.usersSubtitle')"
    :back-to="{ name: 'home' }"
  />
  <ElAlert
    v-show="alert.text"
    :type="alert.type"
    :title="alert.text"
    show-icon
    class="is-margin-top-15"
  />
  <ElTable :data="users" stripe :empty-text="$t('general.noData')">
    <!-- Data columns -->
    <ElTableColumn
      v-for="col in columns"
      :key="col.prop"
      :prop="col.prop"
      :label="col.label"
      :sortable="col.sortable"
      :width="col.width"
      :formatter="(
        row: User, 
        column: TableColumnCtx<User>, 
        cellValue: any
      ) => format(col.format, cellValue)"
    />
  </ElTable>
</template>
