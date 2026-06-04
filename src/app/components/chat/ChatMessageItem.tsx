/**
 * @file ChatMessageItem.tsx
 * @description 单条聊天消息渲染
 */

import { useCallback } from 'react'
import { Copy, RefreshCw, ChevronDown, ChevronUp, User, Bot } from 'lucide-react'
import type { ChatMessage } from '../../types'
import { useChatStore } from '../../store/chat-store'
import { useThemeStore } from '../../store/theme-store'
import { cyberToast } from '../CyberToast'

interface Props {
  message: ChatMessage
  isStreaming?: boolean
}

export function ChatMessageItem({ message, isStreaming }: Props) {
  const { tokens, isCyberpunk } = useThemeStore()
  const toggleFold = useChatStore(s => s.toggleFold)
  const regenerateLast = useChatStore(s => s.regenerateLast)

  const isUser = message.role === 'user'
  const content = message.content || ''
  const needFold = content.length > 800 || content.includes('```')
  const isFolded = message.folded && needFold

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      cyberToast('已复制到剪贴板')
    })
  }, [content])

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className="max-w-[85%] rounded-lg px-3 py-2 relative group"
        style={{
          background: isUser ? tokens.primary : tokens.cardBg,
          border: `1px solid ${isUser ? tokens.primary : tokens.cardBorder}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-1">
          {isUser ? (
            <User size={10} style={{ color: tokens.foreground }} />
          ) : (
            <Bot size={10} style={{ color: tokens.primary }} />
          )}
          <span style={{
            fontFamily: tokens.fontMono, fontSize: '8px',
            color: isUser ? tokens.foreground : tokens.primary,
          }}>
            {isUser ? 'You' : 'AI'}
          </span>
          {message.timestamp && (
            <span style={{ fontFamily: tokens.fontMono, fontSize: '7px', color: tokens.foregroundMuted }}>
              {message.timestamp}
            </span>
          )}
          {/* Actions */}
          <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {isStreaming && (
              <span style={{ fontFamily: tokens.fontMono, fontSize: '8px', color: tokens.warning }}>
                生成中...
              </span>
            )}
            {!isUser && !isStreaming && (
              <>
                <button onClick={handleCopy} className="p-0.5 rounded hover:bg-white/10" title="复制">
                  <Copy size={8} style={{ color: tokens.foregroundMuted }} />
                </button>
                <button onClick={regenerateLast} className="p-0.5 rounded hover:bg-white/10" title="重新生成">
                  <RefreshCw size={8} style={{ color: tokens.foregroundMuted }} />
                </button>
              </>
            )}
            {needFold && (
              <button onClick={() => message.id && toggleFold(message.id)} className="p-0.5 rounded hover:bg-white/10">
                {isFolded ? <ChevronDown size={8} style={{ color: tokens.foregroundMuted }} /> : <ChevronUp size={8} style={{ color: tokens.foregroundMuted }} />}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className="relative"
          style={{
            fontFamily: tokens.fontBody, fontSize: '12px', color: isUser ? tokens.foreground : tokens.foreground,
            lineHeight: '1.5', maxHeight: isFolded ? '120px' : undefined, overflow: isFolded ? 'hidden' : undefined,
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}
        >
          {content || (isStreaming ? (
            <span style={{ opacity: 0.5 }}>...</span>
          ) : '')}
        </div>

        {/* Fold gradient */}
        {isFolded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-10 rounded-b-lg flex items-end justify-center pb-1"
            style={{
              background: `linear-gradient(transparent, ${tokens.cardBg})`,
            }}
          >
            <button
              onClick={() => message.id && toggleFold(message.id)}
              style={{ fontFamily: tokens.fontMono, fontSize: '8px', color: tokens.primary }}
            >
              展开全部
            </button>
          </div>
        )}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex items-center gap-0.5 mt-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1 h-1 rounded-full"
                style={{
                  background: tokens.primary,
                  animation: `neon-pulse 1s ${i * 0.2}s ease-in-out infinite`,
                  boxShadow: isCyberpunk ? `0 0 3px ${tokens.primary}` : 'none',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
