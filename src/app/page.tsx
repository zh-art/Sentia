import ChatUI from "./features/chat/components/ChatUI";
import DashboardLayout from "./features/layout/components/DashboardLayout";

export default function ChatPage() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-900">
      <DashboardLayout>
        <ChatUI />
      </DashboardLayout>
    </div>
  );
}