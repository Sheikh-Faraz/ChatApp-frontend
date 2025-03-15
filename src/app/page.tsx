import { MessageSquare } from "lucide-react";
export default function Home() {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-[#020024] h-screen">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold text-white">Welcome to LinkUp!</h2>
        <p className="text-base-content/60 text-white">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
}
