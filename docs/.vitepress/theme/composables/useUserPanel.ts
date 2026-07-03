import { ref } from 'vue'

export type UserPanelTab = 'bookmarks' | 'notes'

const isOpen = ref(false)
const activeTab = ref<UserPanelTab>('bookmarks')

export function useUserPanel() {
  function open(tab: UserPanelTab = 'bookmarks') {
    activeTab.value = tab
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function setTab(tab: UserPanelTab) {
    activeTab.value = tab
  }

  return { isOpen, activeTab, open, close, setTab }
}
