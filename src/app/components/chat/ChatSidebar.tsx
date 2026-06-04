/**
 * @file ChatSidebar.tsx
 * @description 聊天会话侧栏
 */

import { MessageSquare, Plus, Trash2 } from 'lucide-react'
import { useChatStore } from '../../store/chat-store'
import { useThemeStore } from '../../store/theme-store'
import { useI18n } from '../../i18n/context'

export function ChatSidebar() {
  const { tokens } = useThemeStore()
  const { t } = useI18n()
  const sessions = useChatStore(s => s.sessions)
  const currentSid = useChatStore(s => s.currentSid)
  const selectSession = useChatStore(s => s.selectSession)
  const createSession = useChatStore(s => s.createSession)
  const deleteSession = useChatStore(s => s.deleteSession)

  return (
    <div className="flex flex-col h-full" style={{
      background: tokens.panelBg,
      borderRight: `1px solid ${tokens.border}`,
      width: 200,
    }}>
      <div className="p-2 border-b" style={{ borderColor: tokens.border }}>
        <button
          onClick={() => createSession()}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded transition-all hover:opacity-80"
          style={{
            fontFamily: tokens.fontMono, fontSize: '10px',
            color: tokens.primary, border: `1px solid ${tokens.primary}`,
            background: tokens.primaryGlow,
          }}
        >
          <Plus size={12} />
          <span>{t('common', 'newChat') || '新对话'}</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-2 text-center">
            <MessageSquare size={20} style={{ color: tokens.borderDim }} />
            <p style={{ fontFamily: tokens.fontMono, fontSize: '9px', color: tokens.foregroundMuted, marginTop: 6 }}>
              {t('common', 'noSessions') || '暂无对话'}
            </p>
          </div>
        ) : (
          sessions.map(s => (
            <div
              key={s.sid}
              className="flex items-center gap-1 px-2 py-1.5 cursor-pointer transition-all group"
              style={{
                background: s.sid === currentSid ? tokens.primaryGlow : 'transparent',
                borderLeft: s.sid === currentSid ? `2px solid ${tokens.primary}` : '2px solid transparent',
              }}
              onClick={() => selectSession(s.sid)}
            >
              <MessageSquare size={10} style={{ color: s.sid === currentSid ? tokens.primary : tokens.foregroundMuted, flexShrink: 0 }} />
              <span className="truncate flex-1" style={{
                fontFamily: tokens.fontMono, fontSize: '9px',
                color: s.sid === currentSid ? tokens.primary : tokens.foreground,
              }}>
                {s.title}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSession(s.sid) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/10"
                style={{ color: tokens.error }}
              >
                <Trash2 size={8} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
