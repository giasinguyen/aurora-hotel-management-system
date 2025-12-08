import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatar from "@/assets/images/chatbot/aurora-chatbot.png";
import { cn } from "@/lib/utils";

export default function ChatbotAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-full aspect-square flex ring-2 ring-primary flex-shrink-0",
        className
      )}
    >
      <Avatar className="w-full h-full">
        <AvatarImage
          src={avatar}
          className="object-cover rounded-full"
        />
        <AvatarFallback className="bg-primary text-white text-xs font-semibold">
          AI
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
