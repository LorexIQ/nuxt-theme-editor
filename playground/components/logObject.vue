<script setup lang="ts">
type UtilsStructLogAdvanceConfig = { [name: string]: string | ((data: any) => string) };

type Props = {
  value: any;
  replaces?: UtilsStructLogAdvanceConfig;
};

const props = withDefaults(defineProps<Props>(), {
  replaces: () => ({})
});

const htmlJSON = computed(() => logAdvance(props.value, props.replaces, true));

function logAdvance(obj: any, replaces?: UtilsStructLogAdvanceConfig, convertToHTML: boolean = false): string {
  function getReplacer() {
    const ancestors: any[] = [];

    return function (key: string, value: any) {
      if (replaces && key in replaces) {
        const textToReplace = replaces[key];
        return `${typeof textToReplace === 'function' ? textToReplace(value) : textToReplace}`;
      }

      if (typeof value !== 'object' || value === null) return value;

      // @ts-ignore
      while (ancestors.length > 0 && ancestors.at(-1) !== this) ancestors.pop();

      if (ancestors.includes(value)) return '[Circular]';

      ancestors.push(value);

      return value;
    };
  }

  let json = JSON.stringify(obj, getReplacer(), 2);

  if (!convertToHTML) return json;

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
    let cls = 'log-number';
    if (match.startsWith('"')) {
      if (match.endsWith(':')) {
        cls = 'log-key';
      } else {
        cls = 'log-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'log-boolean';
    } else if (/null/.test(match)) {
      cls = 'log-null';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}
</script>

<template>
  <div class="log-object">
    <pre
      class="log"
      v-html="htmlJSON"
    />
  </div>
</template>

<style lang="scss">
.log {
  font-size: 12px;
  width: 100%;
  padding: 5px;
  margin: 5px;

  &-string { color: #2ca800; }
  &-number { color: darkorange; }
  &-boolean { color: #755091; }
  &-null { color: magenta; }
  &-key { color: #0d677a; }
}
</style>
