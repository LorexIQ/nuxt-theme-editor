<script setup lang="ts">
import type { ModuleClient } from '../../types';
import BlockThemes from '../widgets/BlockThemes.vue';
import ViewPage from '../widgets/ViewPage.vue';

type Props = {
  client: ModuleClient;
};

defineProps<Props>();
</script>

<template>
  <ViewPage
    class="TE-themes-list"
    page-id="index"
    :client="client"
  >
    <BlockThemes
      type="system"
      is-open
      :client="client"
    />
    <BlockThemes
      type="global"
      :client="client"
    />
    <BlockThemes
      type="local"
      :client="client"
    />
  </ViewPage>
</template>
