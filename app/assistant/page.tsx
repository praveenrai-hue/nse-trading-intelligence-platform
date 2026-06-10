import { Sidebar } from '@/components/sidebar'
import { ChatInterface } from '@/components/chat-interface'

export default function AssistantPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <ChatInterface />
      </main>
    </div>
  )
}
