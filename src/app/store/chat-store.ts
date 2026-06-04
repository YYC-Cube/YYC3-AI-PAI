/**
 * @file chat-store.ts
 * @description 多会话聊天状态管理
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-05-22
 * @license MIT
 */

import { create } from 'zustand'
import type { ChatMessage, ChatSession } from '../types'

function genId(): string {
  return 'chat_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
}

const LS_KEY = 'yyc3_chat_sessions'

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveSessions(s: ChatSession[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s))
  } catch { /* quota exceeded */ }
}

interface ChatStoreState {
  sessions: ChatSession[]
  currentSid: string | null
  messages: ChatMessage[]
  streamingId: string | null
  streamingText: string
  createSession: () => string
  deleteSession: (sid: string) => void
  selectSession: (sid: string) => void
  sendMessage: (content: string) => void
  appendToLastAi: (text: string) => void
  finishStreaming: () => void
  regenerateLast: () => void
  toggleFold: (msgId: string) => void
  clearCurrent: () => void
}

function ts() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

export const useChatStore = create<ChatStoreState>((set, get) => {
  const initialSessions = loadSessions()
  const initialSid = initialSessions.length > 0 ? initialSessions[0].sid : null

  return {
    sessions: initialSessions,
    currentSid: initialSid,
    messages: initialSid ? (initialSessions.find(s => s.sid === initialSid)?.list ?? []) : [],
    streamingId: null,
    streamingText: '',

    createSession: () => {
      const sid = genId()
      const session: ChatSession = {
        sid,
        title: `会话 ${new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}`,
        createAt: Date.now(),
        updateAt: Date.now(),
        list: [],
      }
      const updated = [...get().sessions, session]
      saveSessions(updated)
      set({ sessions: updated, currentSid: sid, messages: [] })
      return sid
    },

    deleteSession: (sid: string) => {
      const updated = get().sessions.filter(s => s.sid !== sid)
      saveSessions(updated)
      const patch: Partial<ChatStoreState> = { sessions: updated }
      if (sid === get().currentSid) {
        if (updated.length > 0) {
          patch.currentSid = updated[0].sid
          patch.messages = updated[0].list
        } else {
          patch.currentSid = null
          patch.messages = []
        }
      }
      set(patch)
    },

    selectSession: (sid: string) => {
      const session = get().sessions.find(s => s.sid === sid)
      if (session) {
        set({ currentSid: sid, messages: session.list, streamingId: null, streamingText: '' })
      }
    },

    sendMessage: (content: string) => {
      let sid = get().currentSid
      if (!sid) {
        sid = get().createSession()
      }

      const userMsg: ChatMessage = {
        id: genId(), role: 'user', content,
        timestamp: ts(),
      }
      const aiMsg: ChatMessage = {
        id: genId(), role: 'ai', content: '',
        timestamp: ts(),
      }

      const updated = get().sessions.map(s => {
        if (s.sid === sid) {
          const msgList = [...s.list, userMsg, aiMsg]
          return {
            ...s,
            list: msgList,
            updateAt: Date.now(),
            title: s.list.length === 0 ? content.slice(0, 24) : s.title,
          }
        }
        return s
      })
      saveSessions(updated)
      set({
        sessions: updated,
        messages: [...get().messages, userMsg, aiMsg],
        streamingId: aiMsg.id!,
        streamingText: '',
      })
    },

    appendToLastAi: (text: string) => {
      const { sessions, currentSid, messages } = get()
      if (!currentSid) return
      const updatedMessages = [...messages]
      const last = updatedMessages[updatedMessages.length - 1]
      if (last && last.role === 'ai') {
        updatedMessages[updatedMessages.length - 1] = { ...last, content: last.content + text }
      }
      const updatedSessions = sessions.map(s => {
        if (s.sid === currentSid) return { ...s, list: updatedMessages, updateAt: Date.now() }
        return s
      })
      saveSessions(updatedSessions)
      set({ sessions: updatedSessions, messages: updatedMessages })
    },

    finishStreaming: () => {
      const { sessions, currentSid, messages, streamingId } = get()
      if (!currentSid) return
      const updatedMessages = messages.map(m => {
        if (m.id === streamingId && m.role === 'ai' && m.content.length > 600) {
          return { ...m, folded: true }
        }
        return m
      })
      const updatedSessions = sessions.map(s => {
        if (s.sid === currentSid) return { ...s, list: updatedMessages, updateAt: Date.now() }
        return s
      })
      saveSessions(updatedSessions)
      set({ sessions: updatedSessions, messages: updatedMessages, streamingId: null, streamingText: '' })
    },

    regenerateLast: () => {
      const { messages, currentSid, sessions } = get()
      if (!currentSid || messages.length < 2) return
      const trimmed = messages.slice(0, -1)
      const aiMsg: ChatMessage = {
        id: genId(), role: 'ai', content: '',
        timestamp: ts(),
      }
      const updatedMessages = [...trimmed, aiMsg]
      const updatedSessions = sessions.map(s => {
        if (s.sid === currentSid) return { ...s, list: updatedMessages, updateAt: Date.now() }
        return s
      })
      saveSessions(updatedSessions)
      set({ sessions: updatedSessions, messages: updatedMessages, streamingId: aiMsg.id!, streamingText: '' })
    },

    toggleFold: (msgId: string) => {
      const { messages, currentSid, sessions } = get()
      if (!currentSid) return
      const updatedMessages = messages.map(m =>
        m.id === msgId ? { ...m, folded: !m.folded } : m
      )
      const updatedSessions = sessions.map(s => {
        if (s.sid === currentSid) return { ...s, list: updatedMessages, updateAt: Date.now() }
        return s
      })
      saveSessions(updatedSessions)
      set({ sessions: updatedSessions, messages: updatedMessages })
    },

    clearCurrent: () => {
      const { currentSid, sessions } = get()
      if (!currentSid) return
      const updatedSessions = sessions.map(s => {
        if (s.sid === currentSid) return { ...s, list: [], updateAt: Date.now() }
        return s
      })
      saveSessions(updatedSessions)
      set({ sessions: updatedSessions, messages: [] })
    },
  }
})
