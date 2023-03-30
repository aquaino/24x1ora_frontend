<script setup lang="ts">
import { ref } from 'vue';
import { Message, Key } from '@element-plus/icons-vue';

// Data
const email = ref('');
const password = ref('');

// Methods
async function login() {
  console.log('login');
}
</script>

<template>
  <ElRow justify="center">
    <ElCol :sm="12" :md="6">
      <ElCard class="box-card">
        <template #header>
          <div class="card-header">
            <h2>Accedi al portale</h2>
          </div>
        </template>
        <ElForm @submit.prevent="login()">
          <ElFormItem>
            <ElInput type="email" placeholder="Email" v-model="email" required>
              <template #prefix>
                <ElIcon class="el-input__icon"><message /></ElIcon>
              </template>
            </ElInput>
          </ElFormItem>
          <ElFormItem>
            <ElInput
              type="password"
              placeholder="Password"
              show-password
              v-model="password"
              required
            >
              <template #prefix>
                <ElIcon class="el-input__icon"><key /></ElIcon>
              </template>
            </ElInput>
          </ElFormItem>
          <ElFormItem>
            <el-button type="primary" native-type="submit">Accedi</el-button>
          </ElFormItem>
        </ElForm>
        {{ email }} {{ password }}
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<style scoped lang="css">
.el-row {
  padding: 100px 0;
}
</style>
