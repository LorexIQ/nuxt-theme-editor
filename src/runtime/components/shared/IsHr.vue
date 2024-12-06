<template>
  <div class="TE-is-hr">
    <slot>Not set</slot>
  </div>
</template>

<style scoped lang="scss">
.TE-is-hr {
  position: sticky;
  top: -1px;
  z-index: 2;
  text-align: center;
  padding: 7px 0 5px;
  border-bottom: 1px solid var(--border);
  color: var(--title);
  background-color: var(--bg);
  box-shadow: 0 0 10px var(--bg);
}
</style>
