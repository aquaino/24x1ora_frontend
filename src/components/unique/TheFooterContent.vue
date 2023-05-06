<script setup lang="ts"></script>

<template>
  <div class="is-text-center is-small is-margin-top-20">
    <div>
      Per qualsiasi problema o segnalazione scrivere a
      <ElLink href="mailto:iscrizioni@24oredibuttrio.it">iscrizioni@24oredibuttrio.it</ElLink>
    </div>
    <div class="is-margin-top-10">
      Copyright &copy; {{ new Date().getFullYear() }} Gruppo Alpini Buttrio & A.S.D. Podismo Buttrio
    </div>
    <div>
      Realizzato da
      <ElLink href="https://www.marcomiani.it/" target="_blank">Marco Miani</ElLink>
      e
      <ElLink href="https://it.linkedin.com/in/alanquaino" target="_blank">Alan Quaino</ElLink>
    </div>
    <div class="is-text-center is-margin-top-10 iubenda-buttons">
      <a
        href="https://www.iubenda.com/privacy-policy/88111594"
        class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe"
        title="Privacy Policy"
        >Privacy Policy</a
      >
      <a
        href="https://www.iubenda.com/privacy-policy/88111594/cookie-policy"
        class="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe"
        title="Cookie Policy"
        >Cookie Policy</a
      >
    </div>
  </div>
  <ElBacktop :right="13" :bottom="64" title="Torna su" />
</template>

<style scoped>
.el-link {
  vertical-align: baseline;
}

.iubenda-buttons > a:first-child {
  margin-right: .5rem !important;
}
</style>
