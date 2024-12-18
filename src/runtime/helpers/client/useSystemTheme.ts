import { ref } from '#imports';

const theme = ref<'light' | 'dark'>(useSystemTheme());

function useSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function handleThemeChange(event: MediaQueryListEvent) {
  theme.value = event.matches ? 'dark' : 'light';
}

function setupSystemThemeWatcher() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleThemeChange);

  return () => {
    mediaQuery.removeEventListener('change', handleThemeChange);
  };
}

export default function () {
  return {
    theme,
    stopWatching: setupSystemThemeWatcher()
  };
}
