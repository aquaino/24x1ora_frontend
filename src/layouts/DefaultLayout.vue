<script setup lang="ts"></script>

<template>
  <div class="common-layout">
    <ElContainer>
      <ElAside width="200px">Aside</ElAside>
      <ElContainer>
        <ElHeader>Header</ElHeader>
        <ElMain><RouterView /></ElMain>
        <ElFooter>Footer</ElFooter>
      </ElContainer>
    </ElContainer>
  </div>
</template>
