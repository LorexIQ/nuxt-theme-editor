<template>
  <div
    class="TE-view-page"
  >
    <div class="TE-view-page__template">
      <slot />
    </div>
    <div class="TE-view-page__messages">
      <slot name="messages" />
    </div>
    <div class="TE-view-page__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.TE-view-page {
  display: grid;
  grid-template-rows: 1fr auto auto;
  height: 100%;
  margin-left: -1px;
  border-left: 1px solid var(--border);

  &__template {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__footer {
    background-color: var(--bgFooter);
    box-shadow: 0 0 10px var(--shadow);
  }
}

.tab-fade-lr {
  &-enter-active, &-leave-active {
    position: absolute;
    width: 100%;
    transition: .3s;
  }
  &-leave-to {
    opacity: 0;
    transform: scaleX(.9) translateX(-100%);
  }
  &-enter-from {
    opacity: 0;
    transform: scaleX(.9) translateX(100%);
  }
}
.tab-fade-rl {
  &-enter-active, &-leave-active {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: .3s;
  }
  &-leave-to {
    opacity: 0;
    transform: scaleX(.9) translateX(100%);
  }
  &-enter-from {
    opacity: 0;
    transform: scaleX(.9) translateX(-100%);
  }
}
</style>
