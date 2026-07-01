import { ref, watch, onMounted } from 'vue'

export const FONT_STEPS = [
  { label: 'Nhỏ', size: '93.75%' },
  { label: 'Vừa', size: '100%' },
  { label: 'Lớn', size: '115%' },
  { label: 'Rất lớn', size: '130%' },
] as const

const THEME_KEY = 'nityata-theme'
const FONT_KEY = 'nityata-font-step'

const theme = ref<'dark' | 'light'>('dark')
const fontStep = ref(1)
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | undefined

function applyTheme() {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme.value)
}

function applyFont() {
  if (typeof document === 'undefined') return
  document.documentElement.style.fontSize = FONT_STEPS[fontStep.value].size
}

function loadFromStorage() {
  if (typeof localStorage === 'undefined') return
  try {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'light' || t === 'dark') theme.value = t
    const f = parseInt(localStorage.getItem(FONT_KEY) || '1', 10)
    if (f >= 0 && f < FONT_STEPS.length) fontStep.value = f
  } catch {
    /* ignore */
  }
}

export function usePreferences() {
  onMounted(() => {
    loadFromStorage()
    applyTheme()
    applyFont()
  })

  watch(theme, (v) => {
    applyTheme()
    try {
      localStorage.setItem(THEME_KEY, v)
    } catch {
      /* ignore */
    }
  })

  watch(fontStep, (v) => {
    applyFont()
    try {
      localStorage.setItem(FONT_KEY, String(v))
    } catch {
      /* ignore */
    }
  })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    showToast(
      theme.value === 'dark'
        ? 'Đã chuyển sang giao diện tối'
        : 'Đã chuyển sang giao diện sáng'
    )
  }

  function setFontStep(step: number) {
    if (step >= 0 && step < FONT_STEPS.length) fontStep.value = step
  }

  function showToast(msg: string) {
    toastMessage.value = msg
    toastVisible.value = true
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toastVisible.value = false
    }, 2200)
  }

  const themeIcon = () => (theme.value === 'dark' ? 'dark_mode' : 'light_mode')

  return {
    theme,
    fontStep,
    toastMessage,
    toastVisible,
    toggleTheme,
    setFontStep,
    showToast,
    themeIcon,
    FONT_STEPS,
  }
}
