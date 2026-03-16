export type Theme = "light" | "dark";

const THEME_KEY = "canglish-theme";

function getInitialTheme(): Theme {
  if (process.client) {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light";
}

function applyTheme(theme: Theme) {
  if (process.client) {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }
}

export function useTheme() {
  const theme = useState<Theme>("theme", () => {
    const initial = getInitialTheme();
    applyTheme(initial);
    return initial;
  });

  const isDark = computed(() => theme.value === "dark");

  function toggleTheme() {
    const newTheme = theme.value === "light" ? "dark" : "light";
    setTheme(newTheme);
  }

  function setTheme(value: Theme) {
    theme.value = value;
    applyTheme(value);
    if (process.client) {
      localStorage.setItem(THEME_KEY, value);
    }
  }

  return {
    theme: readonly(theme),
    isDark: readonly(isDark),
    toggleTheme,
    setTheme,
  };
}
