/**
 * @file ChatPanel.tsx
 * @description 完整聊天面板 — 集成会话管理、消息列表、流式响应
 */

import { useCallback, useEffect, useRef } from 'react'
import { MessageSquare, Trash2, Download } from 'lucide-react'
import { useChatStore } from '../../store/chat-store'
import { useThemeStore } from '../../store/theme-store'
import { useChatStream } from '../../hooks/useChatStream'
import { ChatSidebar } from './ChatSidebar'
import { ChatMessageItem } from './ChatMessageItem'
import { ChatInput } from './ChatInput'
import { useI18n } from '../../i18n/context'

export function ChatPanel() {
  const { tokens, isCyberpunk } = useThemeStore()
  const { t, locale } = useI18n()
  const messages = useChatStore(s => s.messages)
  const streamingId = useChatStore(s => s.streamingId)
  const clearCurrent = useChatStore(s => s.clearCurrent)
  const { sendMessage } = useChatStream()
  const listRef = useRef<HTMLDivElement>(null)
  const isZh = locale === 'zh'

  // Auto-scroll on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = useCallback((text: string) => {
    sendMessage(text)
  }, [sendMessage])

  const handleExport = useCallback(() => {
    if (messages.length === 0) return
    let md = `# YYC³ AI-PAI 对话导出\n${new Date().toLocaleString()}\n\n`
    messages.forEach(m => {
      md += `### ${m.role === 'user' ? '用户' : 'AI'}\n${m.content}\n\n`
    })
    const blob = new Blob([md], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `yyc3-chat-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [messages])

  return (
    <div className="flex h-full" style={{ background: tokens.background }}>
      {/* Session Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b shrink-0" style={{
          borderColor: tokens.border,
          background: tokens.panelBg,
        }}>
          <span style={{ fontFamily: tokens.fontMono, fontSize: '10px', color: tokens.primary, letterSpacing: '1px' }}>
            {isZh ? 'AI 对话' : 'AI Chat'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleExport}
              disabled={messages.length === 0}
              className="p-1 rounded transition-all hover:bg-white/5 disabled:opacity-30"
              style={{ color: tokens.foregroundMuted }}
              title={isZh ? '导出对话' : 'Export chat'}
            >
              <Download size={12} />
            </button>
            <button
              onClick={clearCurrent}
              disabled={messages.length === 0}
              className="p-1 rounded transition-all hover:bg-white/5 disabled:opacity-30"
              style={{ color: tokens.foregroundMuted }}
              title={isZh ? '清空对话' : 'Clear chat'}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <MessageSquare size={32} style={{ color: tokens.borderDim, opacity: 0.3 }} />
              <p style={{ fontFamily: tokens.fontMono, fontSize: '11px', color: tokens.foregroundMuted, marginTop: 8 }}>
                {isZh ? '开始一段新的 AI 对话' : 'Start a new AI conversation'}
              </p>
              <p style={{ fontFamily: tokens.fontMono, fontSize: '9px', color: tokens.borderDim, marginTop: 4 }}>
                {isZh ? '在下方输入消息，或选择一个已有会话继续' : 'Type a message below or select an existing session'}
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                isStreaming={msg.id === streamingId}
              />
            ))
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          disabled={streamingId !== null}
          placeholder={isZh ? '输入消息... (Enter 发送, Shift+Enter 换行)' : 'Type a message... (Enter to send, Shift+Enter for new line)'}
        />
      </div>
    </div>
  )
}
