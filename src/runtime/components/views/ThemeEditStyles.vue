<script setup lang="ts">
import type { ModuleClient } from '../../types';
import IsButton from '../shared/IsButton.vue';
import ViewPage from '../widgets/ViewPage.vue';
import ThemeStylesBlock from '../widgets/ThemeStylesBlock.vue';
import { computed, onBeforeMount, ref } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();
const sandbox = client.getSandbox();

const viewPageRef = ref();
const alertInheritance = ref<HTMLElement>();
const themeId = computed(() => router.getQuery().themeId);
const selectedTheme = computed(() => client.getSelectedTheme()!);

function goBack() {
  client.setEditedTheme(undefined);
  router.push('index', 'tab-fade-rl');
}
function goToInheritance(inheritanceId: string) {
  if (!inheritanceId.startsWith('$') || !viewPageRef.value) return;

  const inheritanceStyle = document.getElementById(`style:${inheritanceId.slice(1)}`);
  if (!inheritanceStyle) return;

  alertInheritance.value = inheritanceStyle!;
  const templateHeight = viewPageRef.value.templateRef.clientHeight;
  const templateTop = viewPageRef.value.templateRef.scrollTop;
  const templateBottom = templateTop + templateHeight;
  const inheritancePosition = inheritanceStyle.getBoundingClientRect().top;
  let scrollTo = 0;

  if (inheritancePosition < templateTop) {
    scrollTo = inheritancePosition;
  } else if (inheritancePosition > templateBottom) {
    scrollTo = inheritancePosition + templateHeight;
  } else {
    inheritanceAnimation();
    return;
  }

  viewPageRef.value.templateRef.scrollTo({
    top: scrollTo,
    behavior: 'smooth'
  });
}
function inheritanceAnimation() {
  if (!alertInheritance.value) return;
  alertInheritance.value.classList.add('TE-style-edit-block--alert');

  setTimeout(() => {
    if (!alertInheritance.value) return;
    alertInheritance.value.classList.remove('TE-style-edit-block--alert');
    alertInheritance.value = undefined;
  }, 300);
}

onBeforeMount(() => {
  if (!themeId.value || !client.getThemes()[themeId.value]) {
    router.push('index', 'tab-fade-lr');
    return;
  }

  client.setEditedTheme(themeId.value);
});
</script>

<template>
  <ViewPage
    ref="viewPageRef"
    @scrollend="inheritanceAnimation"
  >
    <div class="TE-theme-edit-styles">
      <div class="TE-theme-edit-styles__all">
        <ThemeStylesBlock
          :styles="selectedTheme.styles"
          :raw-styles="selectedTheme.target.styles"
          @click="sandbox.openStyleClickMenu(...$event)"
          @context-menu-open="sandbox.openStyleContextMenu(...$event)"
          @inheritance-click="goToInheritance"
        />
      </div>
    </div>

    <template #footer>
      <div class="TE-theme-edit-styles-footer">
        <IsButton @click="goBack">
          Go back
        </IsButton>
        <IsButton decor="success">
          Save
        </IsButton>
      </div>
    </template>
  </ViewPage>
</template>

<style scoped lang="scss">
.TE-theme-edit-styles {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    padding: 10px;
  }
}
</style>
