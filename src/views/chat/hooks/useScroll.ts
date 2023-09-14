/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-09 14:19:38
 * @FilePath: \chatgpt-shuowen\src\views\chat\hooks\useScroll.ts
 * @Description: 使用Scroll滚动相关函数
 */
import type { Ref } from 'vue'
import { nextTick, ref } from 'vue'

type ScrollElement = HTMLDivElement | null

interface ScrollReturn {
  scrollRef: Ref<ScrollElement>
  scrollTo: (top: number) => Promise<void>
  scrollToBottom: () => Promise<void>
  scrollToTop: () => Promise<void>
  scrollToBottomIfAtBottom: () => Promise<void>
}

export function useScroll(): ScrollReturn {
  const scrollRef = ref<ScrollElement>(null)

  const scrollTo = async (top: number) => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = top
  }

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = 0
  }

  const scrollToBottomIfAtBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
      const threshold = 100 // 阈值，表示滚动条到底部的距离阈值
      const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
      if (distanceToBottom <= threshold)
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  }

  return {
    scrollRef,
    scrollTo,
    scrollToBottom,
    scrollToTop,
    scrollToBottomIfAtBottom,
  }
}
