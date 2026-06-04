/**
 * @file ChatInput.tsx
 * @description 聊天输入框
 */

import { useState, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'
import { useThemeStore } from '../../store/theme-store'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder }: Props) {
  const { tokens } = useThemeStore()
  const [value, setValue] = useState('')
  const textRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    if (textRef.current) {
      textRef.current.style.height = 'auto'
    }
  }, [value, disabled, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    // Auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }, [])

  return (
    <div className="flex items-end gap-2 px-3 py-2" style={{
      borderTop: `1px solid ${tokens.border}`,
      background: tokens.panelBg,
    }}>
      <textarea
        ref={textRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || '输入消息... (Enter 发送, Shift+Enter 换行)'}
        rows={1}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none resize-none"
        style={{
          fontFamily: tokens.fontMono, fontSize: '11px', color: tokens.foreground,
          caretColor: tokens.primary, lineHeight: '1.5', maxHeight: '120px',
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="p-1.5 rounded transition-all hover:opacity-80 disabled:opacity-30 shrink-0"
        style={{ border: `1px solid ${tokens.border}`, color: tokens.primary }}
      >
        <Send size={12} />
      </button>
    </div>
  )
}
