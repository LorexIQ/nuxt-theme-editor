<script setup lang="ts">
import type { ModuleClient } from '../../types';
import IsButton from '../shared/IsButton.vue';
import ViewPage from '../widgets/ViewPage.vue';
import ThemeStylesPreviewBlock from '../widgets/ThemeStylesPreviewBlock.vue';
import ThemeStylesUIBlock from '../widgets/ThemeStylesUIBlock.vue';
import ThemeStylesBlock from '../widgets/ThemeStylesBlock.vue';
import unwrap from '../../helpers/client/unwrap';
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
const theme = computed(() => client.getEditedTheme()!);
const themeStyles = computed(() => unwrap.get(theme.value.getPreparedStylesWithoutSystem()));
const themeTargetStyles = computed(() => unwrap.get(theme.value.getStylesWithoutSystem('edited')));

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
function onSave() {
  theme.value.saveEditedStyles();
  client.setThemeSelectedAsEdited(undefined);
  router.push('index', 'tab-fade-lr');
}

onBeforeMount(() => {
  if (!themeId.value || !client.getThemeById(themeId.value)) {
    router.push('index', 'tab-fade-lr');
    return;
  }

  if (!client.getEditedTheme()) client.setThemeSelectedAsEdited(themeId.value);
});
</script>

<template>
  <ViewPage
    ref="viewPageRef"
    @scrollend="inheritanceAnimation"
  >
    <template #default>
      <div class="TE-theme-edit-styles">
        <ThemeStylesPreviewBlock
          :client="client"
          @click="sandbox.openStyleClickMenu(...$event)"
          @context-menu-open="sandbox.openStyleContextMenu(...$event)"
          @inheritance-click="goToInheritance"
        />
        <ThemeStylesUIBlock
          :client="client"
          @click="sandbox.openStyleClickMenu(...$event)"
          @context-menu-open="sandbox.openStyleContextMenu(...$event)"
          @inheritance-click="goToInheritance"
        />
        <ThemeStylesBlock
          :client="client"
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
          Go back
        </IsButton>
        <IsButton
          decor="success"
          :items="[
            {
              title: 'Save',
              action: onSave,
              icon: 'Save',
            },
            {
              title: 'Save the draft',
              action: () => {},
              icon: 'SaveEdit',
            },
          ]"
          @click="onSave"
        >
          Save
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
