<script setup lang="ts">
import type { ModuleClient } from '../../types';
import IsButton from '../shared/IsButton.vue';
import ViewPage from '../widgets/ViewPage.vue';
import ThemeStylesPreviewBlock from '../widgets/ThemeStylesPreviewBlock.vue';
import ThemeStylesUIBlock from '../widgets/ThemeStylesUIBlock.vue';
import ThemeStylesBlock from '../widgets/ThemeStylesBlock.vue';
import unwrap from '../../helpers/client/unwrap';
import useLang from '../../helpers/client/useLang';
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
const themeId = computed(() => router.route.query.themeId);
const theme = computed(() => client.getThemeById(themeId.value));
const themeStyles = computed(() => unwrap.get(theme.value?.getPreparedStylesWithoutSystem()));
const themeTargetStyles = computed(() => unwrap.get(theme.value?.getStylesWithoutSystem('edited')));

function goBack() {
  router.push(`editThemeStylesCancel?themeId=${themeId.value}`, 'tab-fade-lr');
}
function goToInheritance(inheritanceId: string) {
  if (!inheritanceId.startsWith('$') || !viewPageRef.value) return;

  const inheritanceStyle = document.getElementById(`style:${inheritanceId.slice(1)}`);
  if (!inheritanceStyle) return;

  alertInheritance.value = inheritanceStyle!;
  const templateHeight = viewPageRef.value.templateRef.clientHeight;
  const templatePosition = viewPageRef.value.templateRef.getBoundingClientRect().top;
  const templateScrollTop = viewPageRef.value.templateRef.scrollTop;
  const templateScrollBottom = templateScrollTop + templateHeight;
  const inheritanceBoundingRect = inheritanceStyle.getBoundingClientRect();
  const inheritancePosition = inheritanceBoundingRect.top + templateScrollTop - templatePosition;
  const inheritanceHeight = inheritanceBoundingRect.height;
  let scrollTo = 0;

  if (inheritancePosition < templateScrollTop + 35) {
    scrollTo = inheritancePosition - 35;
  } else if (inheritancePosition > templateScrollBottom) {
    scrollTo = inheritancePosition - templateHeight + inheritanceHeight;
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
async function onSave() {
  if (!theme.value) return;

  if (await theme.value.checkServerConflict()) {
    router.push(`editThemeConflict?themeId=${themeId.value}&cancelLink=editThemeStyles`, 'tab-fade-lr');
  } else {
    if (await theme.value.saveEditedStyles()) {
      client.unselectAllThemesAs('edited');
      router.push('index', 'tab-fade-rl');
    }
  }
}

onBeforeMount(() => {
  if (!themeId.value || !theme.value || theme.value.type === 'system') {
    router.push('index', 'tab-fade-lr');
    return;
  }

  if (!theme.value.isSelectedAsEdited) theme.value.setSelectedAsEdited();
});
</script>

<template>
  <ViewPage
    v-if="theme"
    ref="viewPageRef"
    page="editThemeStyles"
    :loader="theme.loader"
    @scrollend="inheritanceAnimation"
  >
    <template
      v-if="themeTargetStyles?.length && themeStyles?.length"
      #default
    >
      <div class="TE-theme-edit-styles">
        <ThemeStylesPreviewBlock
          :theme="theme"
          @click="sandbox.openStyleClickMenu(...$event)"
          @context-menu-open="sandbox.openStyleContextMenu(...$event)"
          @inheritance-click="goToInheritance"
        >
          <template #preview>
            <slot name="preview" />
          </template>
        </ThemeStylesPreviewBlock>
        <ThemeStylesUIBlock
          :theme="theme"
          @click="sandbox.openStyleClickMenu(...$event)"
          @context-menu-open="sandbox.openStyleContextMenu(...$event)"
          @inheritance-click="goToInheritance"
        />
        <ThemeStylesBlock
          :theme="theme"
          :styles="themeStyles"
          :raw-styles="themeTargetStyles"
          @click="sandbox.openStyleClickMenu(...$event)"
          @context-menu-open="sandbox.openStyleContextMenu(...$event)"
          @inheritance-click="goToInheritance"
        />
      </div>
    </template>
    <template #footer>
      <div class="TE-theme-edit-styles-footer">
        <IsButton @click="goBack">
          {{ useLang('pageEditThemeStyles.buttons.goBack') }}
        </IsButton>
        <IsButton
          decor="success"
          @click="onSave"
        >
          {{ useLang('pageEditThemeStyles.buttons.save') }}
        </IsButton>
      </div>
    </template>
  </ViewPage>
</template>

<style scoped lang="scss">
.TE-theme-edit-styles {
  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    padding: 10px;
  }
}
</style>
