<script setup lang="ts">
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const inputMsg = ref('')
const isTyping = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

const messages = ref<Message[]>([])
const conversationId = ref<string>('')

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputMsg.value.trim() || isTyping.value) return

  const userQuery = inputMsg.value
  inputMsg.value = ''
  
  // 添加用户消息
  messages.value.push({ role: 'user', content: userQuery })
  
  // 占位 AI 回复
  const assistantMsgIndex = messages.value.push({ role: 'assistant', content: '', sources: [] }) - 1
  
  isTyping.value = true
  scrollToBottom()

  try {
    const apiUrl = import.meta.env.VITE_API_URL  || 'http://localhost:3001/api/chat';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userQuery }],
        conversation_id: conversationId.value
      })
    })

    if (!response.ok) throw new Error('网络请求失败')

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // SSE 包含了以 "data: " 开头的片段
        const chunkStr = decoder.decode(value, { stream: true })
        const lines = chunkStr.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6)
            if (dataStr === '[DONE]') {
              break
            }
            try {
              const data = JSON.parse(dataStr)
              if (data.type === 'conversation_id') {
                conversationId.value = data.id
              } else if (data.type === 'sources') {
                messages.value[assistantMsgIndex].sources = data.data
              } else if (data.type === 'content') {
                messages.value[assistantMsgIndex].content += data.content
              } else if (data.type === 'error') {
                messages.value[assistantMsgIndex].content += `\n[系统提示: ${data.message}]`
              }
              scrollToBottom()
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('问答请求出错:', error)
    messages.value[assistantMsgIndex].content = '抱歉，本地 RAG 服务似乎没有启动或出现了网络错误。'
  } finally {
    isTyping.value = false
  }
}
</script>

<template>
  <div class="rag-chat-wrapper">
    <!-- 悬浮按钮 -->
    <button class="chat-toggle-btn" @click="toggleChat">
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>

    <!-- 聊天面板 -->
    <div class="chat-panel" v-show="isOpen">
      <div class="chat-header">
        <div class="header-left">
          <h3>博客 AI 助手</h3>
          <span class="status-dot"></span>
        </div>
        <button class="clear-btn" @click="() => { messages = []; conversationId = ''; }" title="开启新对话">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
        </button>
      </div>

      <div class="chat-messages" ref="chatContainer">
        <div v-if="messages.length === 0" class="empty-state">
          👋 你好！你可以针对本片博客的内容向我提问，我会基于博客进行回答。
        </div>
        
        <div v-for="(msg, index) in messages" :key="index" 
             :class="['message', msg.role]">
          <div class="msg-content">
            <!-- 简单展示，实际可引入 markdown 解析 -->
            <p style="white-space: pre-wrap">{{ msg.content }}</p>
            
            <!-- 来源文件展示 -->
            <div class="msg-sources" v-if="msg.sources && msg.sources.length > 0">
              <span>参考了以下源文件：</span>
              <ul>
                <li v-for="source in msg.sources" :key="source">
                  {{ source.split('/').pop() || source.split('\\').pop() }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="isTyping" class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="chat-input-area">
        <input 
          v-model="inputMsg" 
          @keyup.enter="sendMessage"
          type="text" 
          placeholder="问点什么吧..." 
          :disabled="isTyping"
        />
        <button @click="sendMessage" :disabled="!inputMsg.trim() || isTyping">发送</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rag-chat-wrapper {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  font-family: var(--vp-font-family-base);
}

.chat-toggle-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--vp-c-brand);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.chat-toggle-btn:hover {
  transform: scale(1.05);
}

.chat-panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 350px;
  height: 500px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--vp-c-bg-soft);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-brand);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-top: 2rem;
  font-size: 0.9rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
}

.message.user .msg-content {
  background-color: var(--vp-c-brand);
  color: white;
  border-radius: 12px 12px 0 12px;
}

.message.assistant {
  align-self: flex-start;
}

.message.assistant .msg-content {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px 12px 12px 0;
  color: var(--vp-c-text-1);
}

.msg-content {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.msg-content p {
  margin: 0;
}

.msg-sources {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--vp-c-divider);
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.msg-sources ul {
  margin: 0.25rem 0 0 0;
  padding-left: 1rem;
}

.chat-input-area {
  padding: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  gap: 0.5rem;
}

.chat-input-area input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  outline: none;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.chat-input-area input:focus {
  border-color: var(--vp-c-brand);
}

.chat-input-area button {
  padding: 0.5rem 1rem;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.chat-input-area button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 0.5rem;
  align-self: flex-start;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background-color: var(--vp-c-text-2);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>
