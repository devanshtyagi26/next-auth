"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { MessageCard } from "@/components/MessageCard";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleMessageDelete = (messageId) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptedMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accepted-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      toast.error(
        error.response.data.message || "Error in fetching accepted messages"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Messages refreshed successfully");
        }
      } catch (error) {
        toast.error(
          error.response.data.message || "Error in fetching messages"
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setMessages, setIsLoading]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptedMessages();
    fetchMessages();
  }, [session, fetchAcceptedMessages, fetchMessages, setValue]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(
        response.data.message ||
          "Message acceptance status updated successfully"
      );
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Error in updating message acceptance status"
      );
    }
  };

  const { userName } = session.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${userName}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (!session || !session.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Profile</h2>
        <p>Username: {userName}</p>
        <p>Profile URL: {profileUrl}</p>
      </div>
      <h2 className="text-lg font-bold">Copy Profile URL</h2>
      <div className="flex flex-col gap-2">
        <p>Click the button below to copy your profile URL to the clipboard.</p>
        <input type="text" value={profileUrl} readOnly />
        <Button onClick={() => copyToClipboard(profileUrl)}>Copy</Button>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Message Acceptance</h2>
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span> Accept Messages: {acceptMessages ? "On" : "Off"}</span>
      </div>
      <Separator />
      <Button
        variant="outline"
        disabled={isLoading}
        onClick={() => fetchMessages(true)}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCcw className="w-4 h-4" />
        )}
      </Button>
      <div className="flex flex-col gap-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleMessageDelete}
            />
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
