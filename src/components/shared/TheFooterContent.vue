<script setup lang="ts"></script>

<template>
  <div class="is-text-center">
    <div>
      Copyright &copy; {{ new Date().getFullYear() }} Gruppo Alpini Buttrio & A.S.D. Podismo Buttrio
    </div>
    <div>
      Realizzato da
      <ElLink href="https://www.marcomiani.it/" target="_blank">Marco Miani</ElLink>
      e
      <ElLink href="https://it.linkedin.com/in/alanquaino" target="_blank">Alan Quaino</ElLink>
    </div>
  </div>
</template>

<style scoped>
.el-link {
  vertical-align: baseline;
}
</style>
