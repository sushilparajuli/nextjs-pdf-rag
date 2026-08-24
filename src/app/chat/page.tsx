"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

import { Spinner } from "@/components/ui/spinner";

export default function RAGChatBot() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    const text = (message.text ?? input).trim();
    if (!text) return;

    sendMessage({ text });
    setInput("");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_30%),linear-gradient(180deg,#020817_0%,#0f172a_100%)] text-slate-50">
      <div className="mx-auto flex h-screen max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-2xl shadow-slate-950/60 backdrop-blur-sm">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300/80">
                AI Assistant
              </p>
              <h1 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                PDF RAG Chat
              </h1>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              {status === "streaming" ? "Generating" : "Online"}
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-hidden">
            <Conversation className="h-full">
              <ConversationContent className="px-4 py-5 sm:px-6">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="max-w-md rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 p-6 text-center text-slate-300 shadow-lg shadow-slate-950/20">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-2xl text-sky-300">
                        ✦
                      </div>
                      <h2 className="text-lg font-semibold text-white">
                        Ask anything
                      </h2>
                      <p className="mt-2 text-sm text-slate-300">
                        Start a conversation and I’ll answer from the current
                        chat context.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto flex max-w-3xl flex-col gap-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="max-w-[85%]">
                          {message.parts.map((part, index) => {
                            switch (part.type) {
                              case "text":
                                return (
                                  <Fragment key={`${message.id}-${index}`}>
                                    <Message from={message.role}>
                                      <MessageContent
                                        className={
                                          message.role === "user"
                                            ? "bg-sky-600 text-white"
                                            : "border border-white/10 bg-slate-800 text-slate-100"
                                        }
                                      >
                                        <MessageResponse>
                                          {part.text}
                                        </MessageResponse>
                                      </MessageContent>
                                    </Message>
                                  </Fragment>
                                );
                              default:
                                return null;
                            }
                          })}
                        </div>
                      </div>
                    ))}

                    {(status === "submitted" || status === "streaming") && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-200 shadow-lg shadow-slate-950/20">
                          <div className="flex items-center gap-3">
                            <Spinner className="text-sky-300" />
                            <span className="text-sm text-slate-300">
                              Thinking…
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          <div className="border-t border-white/10 bg-slate-950/40 px-4 pb-4 pt-3 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <PromptInput
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-[22px] border border-white/10 bg-slate-800/80 shadow-lg shadow-slate-950/30"
              >
                <PromptInputBody>
                  <PromptInputTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[60px] bg-transparent text-base text-slate-100 placeholder:text-slate-400"
                    placeholder="What would you like to know?"
                  />
                </PromptInputBody>

                <PromptInputFooter className="justify-between border-t border-white/10 px-3 py-2">
                  <PromptInputTools>
                    {/* Model selector, web search etc.. */}
                  </PromptInputTools>
                  <PromptInputSubmit className="h-11 w-11 rounded-full bg-white text-slate-900 hover:bg-sky-200" />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
