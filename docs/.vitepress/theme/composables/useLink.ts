import { withBase } from 'vitepress'

export function useLink() {
  return (path: string) => withBase(path)
}
