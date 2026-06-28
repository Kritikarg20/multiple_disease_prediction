import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatbotWidgetProps {
  context: string;
}

export default function ChatbotWidget({ context }: ChatbotWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-message",
      sender: "ai",
      text: `Hello, I have imported the active patient prediction evaluation context. How can I assist you with clinical interpretations, medical nutrition recommendation plans, or next diagnostic tests?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Converts **bold** and *italic* markdown to HTML inline
  const renderInline = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          context: context,
        }),
      });

      if (!response.ok) {
        throw new Error("Clinical AI assistant server timeout.");
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.response || "No feedback retrieved.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: `**Clinical Notice**: Unable to contact the live neural framework (${err.message || "Network Timeout"}). Fallback on-device heuristic guidelines are available. Please test your network configuration in the Secrets panel if processing offline.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const menuChips = [
    "What should I do next?",
    "Diet recommendations?",
    "Explain current risk factor",
    "What labs should I order?"
  ];

  return (
    <div className="bg-white border border-[#dadadc] rounded-xl flex flex-col h-[520px] shadow-md overflow-hidden font-sans">
      {/* Widget Header */}
      <div className="bg-slate-50 border-b border-[#dadadc] py-3.5 px-4 flex justify-between items-center bg-gradient-to-r from-slate-50 to-emerald-50/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#006b4d] flex items-center justify-center text-white relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></span>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-800 tracking-tight leading-none">Diagnostic Assistant</h4>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 inline-block uppercase tracking-wide">Patient Consultation Core</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-100">
          <span className="w-1.5 h-1.5 bg-[#006b4d] rounded-full animate-ping"></span>
          <span className="text-[9px] font-bold tracking-wider">AI ONLINE</span>
        </div>
      </div>

      {/* Suggested Chips Row */}
      <div className="px-4 py-2 border-b border-dashed border-slate-200 bg-slate-50/50 flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        {menuChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSendMessage(chip)}
            className="whitespace-nowrap px-3 py-1.5 text-[10px] font-semibold tracking-tight text-slate-600 bg-white hover:bg-emerald-50 hover:text-[#006b4d] border border-slate-200 hover:border-emerald-200 transition-colors rounded-full cursor-pointer select-none"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scrolling Frame */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20">
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";
          const isNotice = msg.text.includes("Notice");

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 max-w-[85%] ${isAi ? "" : "ml-auto flex-row-reverse"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                  isAi
                    ? isNotice
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-3 rounded-xl shadow-sm text-xs leading-relaxed ${
                  isAi
                    ? isNotice
                      ? "bg-amber-50 border border-amber-100 text-amber-900"
                      : "bg-[#f1fcf8]/60 border border-[#e2e8f0] text-slate-800"
                    : "bg-[#006b4d] text-white"
                }`}
              >
                <div className="space-y-1.5 font-sans">
                  {msg.text.split("\n").map((line, lIdx) => {
                    // ### Heading
                    if (line.startsWith("### ") || line.startsWith("###")) {
                      return (
                        <h5 key={lIdx} className="font-bold text-slate-900 border-b border-dashed border-emerald-100 pb-0.5 mt-2 mb-1 text-[11px] uppercase tracking-wide">
                          {line.replace(/^###\s*/, "").trim()}
                        </h5>
                      );
                    }
                    // ## Heading
                    if (line.startsWith("## ") || line.startsWith("##")) {
                      return (
                        <h5 key={lIdx} className="font-bold text-slate-900 pb-0.5 mt-2 mb-1 text-[11px] uppercase tracking-wide">
                          {line.replace(/^##\s*/, "").trim()}
                        </h5>
                      );
                    }
                    // Bullet point - or *
                    if (line.startsWith("- ") || line.startsWith("* ")) {
                      const content = line.replace(/^[-*]\s/, "");
                      return (
                        <p
                          key={lIdx}
                          className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-emerald-500 font-normal"
                          dangerouslySetInnerHTML={{ __html: renderInline(content) }}
                        />
                      );
                    }
                    // Numbered list
                    if (line.match(/^\d+\.\s/)) {
                      const num = line.match(/^(\d+)\./)?.[1];
                      const content = line.replace(/^\d+\.\s/, "");
                      return (
                        <p key={lIdx} className="pl-3 font-normal">
                          <span className="font-semibold text-emerald-600 mr-1">{num}.</span>
                          <span dangerouslySetInnerHTML={{ __html: renderInline(content) }} />
                        </p>
                      );
                    }
                    // Italic disclaimer line _text_
                    if (line.startsWith("_") && line.endsWith("_")) {
                      return (
                        <p key={lIdx} className="italic text-slate-400 text-[10px] mt-1">
                          {line.replace(/_/g, "")}
                        </p>
                      );
                    }
                    // Empty line → small spacer
                    if (line.trim() === "") {
                      return <div key={lIdx} className="h-1" />;
                    }
                    // Default paragraph — render inline bold/italic
                    return (
                      <p
                        key={lIdx}
                        className="font-normal"
                        dangerouslySetInnerHTML={{ __html: renderInline(line) }}
                      />
                    );
                  })}
                </div>

                <span className={`text-[8px] block mt-1.5 uppercase tracking-wider ${isAi ? "text-slate-400" : "text-emerald-200 text-right"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2 max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-700 animate-pulse" />
            </div>
            <div className="bg-[#f1fcf8] border border-[#e2e8f0] p-3.5 rounded-xl shadow-sm text-xs text-slate-500 flex items-center gap-1.5 font-sans italic font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              Synthesizing clinical indicators...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Core Area */}
      <div className="p-3 bg-white border-t border-[#dadadc]">
        <div className="flex items-center gap-2 max-w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(input);
            }}
            placeholder="Type clinical query (e.g., 'What is dashboard dietary therapy?')..."
            className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#006b4d] focus:bg-white focus:ring-1 focus:ring-[#006b4d] rounded-lg py-2 px-3 text-xs text-slate-700 placeholder:text-slate-400 transition-colors font-sans outline-none"
            id="chatbot-input-field"
          />
          <button
            onClick={() => handleSendMessage(input)}
            id="btn-chatbot-send"
            className="bg-[#006b4d] hover:bg-[#00513a] active:scale-95 text-white p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
            disabled={isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-center gap-1 text-[9px] text-slate-400 leading-none">
          <AlertCircle className="w-3 h-3 text-slate-300" />
          Always cross-verify machine logs with clinical gold-standards.
        </div>
      </div>
    </div>
  );
}