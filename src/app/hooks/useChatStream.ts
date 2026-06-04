/**
 * @file useChatStream.ts
 * @description 聊天流式响应 Hook — 对接 AI 模型
 */

import { useCallback, useRef } from 'react'
import { useChatStore } from '../store/chat-store'
import { useModelStore } from '../store/model-store'

export function useChatStream() {
  const appendToLastAi = useChatStore(s => s.appendToLastAi)
  const finishStreaming = useChatStore(s => s.finishStreaming)
  const { sendToActiveModel, getActiveModel } = useModelStore()
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const streamResponse = useCallback((fullText: string) => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current)
    }

    let charIdx = 0
    const chunkSize = Math.max(1, Math.floor(fullText.length / 60))

    streamTimerRef.current = setInterval(() => {
      charIdx = Math.min(charIdx + chunkSize, fullText.length)
      const chunk = fullText.slice(Math.max(0, charIdx - chunkSize), charIdx)
      appendToLastAi(chunk)

      if (charIdx >= fullText.length) {
        if (streamTimerRef.current) {
          clearInterval(streamTimerRef.current)
          streamTimerRef.current = null
        }
        finishStreaming()
      }
    }, 20)
  }, [appendToLastAi, finishStreaming])

  const sendMessage = useCallback(async (content: string, systemPrompt?: string) => {
    const store = useChatStore.getState()
    store.sendMessage(content)

    const activeModel = getActiveModel()
    if (activeModel) {
      try {
        const allMessages = useChatStore.getState().messages
        const history = allMessages.slice(0, -2).map(m => ({
          role: m.role === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content,
        }))

        const result = await sendToActiveModel(content, {
          systemPrompt,
          history,
        })
        streamResponse(result)
      } catch {
        streamResponse('[模型响应失败，请检查模型配置]')
      }
    } else {
      setTimeout(() => {
        streamResponse(
          `收到你的消息：\n\n${content}\n\n---\n*请先在设置中配置并启用一个 AI 模型以获得智能回复。*`
        )
      }, 500)
    }
  }, [getActiveModel, sendToActiveModel, streamResponse])

  return { sendMessage, streamResponse }
}
