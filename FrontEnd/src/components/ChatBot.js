import { useState, useRef, useEffect } from "react";
import AIResponseRenderer from "./AIResponseRenderer";
import {
  getChatHistory,
  getChatConversations,
  deleteChatConversation,
  sendChatMessage,
} from "../service/productService";
/**
 * Professional ChatGPT-like AI Chatbot Component
 * Features:
 * - Multi-conversation management with sidebar
 * - Streaming AI responses (Server-Sent Events)
 * - Chat history loading and persistence
 * - Conversation deletion
 * - Voice input support
 * - Auto-scrolling and typing indicators
 */
const ChatBot = ({ onRecommendation }) => {
  const chatEndRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ==================== STATE MANAGEMENT ====================

  // UI State
  const [open, setOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Conversation State
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  // Message State
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState(""); // Partial response during streaming
  const [input, setInput] = useState("");

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Generate new unique conversation ID
   */
  const generateConversationId = () => {
    return crypto.randomUUID();
  };

  /**
   * Scroll to bottom of chat
   */
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  // ==================== CONVERSATION MANAGEMENT ====================

  /**
   * Create new conversation
   * - Generate new ID
   * - Add to sidebar
   * - Switch to new conversation
   */
  const createNewChat = () => {
    const newId = generateConversationId();
    const newConversation = {
      id: newId,
      title: "New Chat",
      timestamp: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
    setMessages([]);
    setInput("");
  };

  /**
   * Load chat history from backend
   * GET /springai/chat/history/{conversationId}
   */
  const loadChatHistory = async (conversationId) => {
    try {
      setLoading(true);
      const history = await getChatHistory(conversationId);

      // Convert backend format to message format
      // Backend: [{ role: "user|assistant", content: "..." }] or [{ role, content, data }]
      const formattedMessages = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
        data: msg.aiResponse || null,
      }));

      console.log("Loaded chat history:", formattedMessages);
      setMessages(formattedMessages);
      setStreamingText("");
      scrollToBottom();
    } catch (error) {
      console.error("Error loading chat history:", error);
      setMessages([]);
      alert("Failed to load chat history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await getChatConversations();

      console.log("Loaded conversations:", data);

      const mapped = data.map((conv) => ({
        id: conv.conversationId,
        title: conv.title,
        timestamp: conv.lastUpdated,
      }));
      setConversations(mapped);

      if (mapped.length > 0 && !activeConversationId) {
        setActiveConversationId(mapped[0].id);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  /**
   * Switch to different conversation
   * - Load chat history from backend
   * - Update active conversation
   */
  const switchConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    loadChatHistory(conversationId);
  };

  /**
   * Delete conversation
   * DELETE /springai/chat/{conversationId}
   */
  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation();

    try {
      await deleteChatConversation(conversationId);

      // Remove from sidebar
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId),
      );

      // If deleted conversation was active, create new chat
      if (activeConversationId === conversationId) {
        createNewChat();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete conversation");
    }
  };

  // ==================== STREAMING CHAT ====================

  /**
   * Send message with SSE streaming
   * POST /springai/chat with text/event-stream response
   *
   * Flow:
   * 1. Add user message to state
   * 2. Fetch POST request with streaming response
   * 3. Parse text/event-stream format
   * 4. Append chunks to streamingText progressively (like ChatGPT typing)
   * 5. When stream ends, move streamingText to messages array
   */

  const sendMessage = async () => {
    if (!input.trim() || !activeConversationId) {
      return;
    }

    const userInput = input;

    // ================= USER MESSAGE =================

    const userMessage = {
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setLoading(true);

    try {
      // ================= API CALL =================

      const aiResponse = await sendChatMessage(userInput, activeConversationId);

      // ================= JSON RESPONSE =================

      console.log("Full AI Response:", aiResponse);

      console.log("AI Response:", aiResponse);

      // ================= ASSISTANT MESSAGE =================

      // ================= ASSISTANT CONTENT FALLBACK =================

      const assistantContent =
        aiResponse.summary ||
        aiResponse.recommendationReason ||
        aiResponse.budgetAnalysis ||
        "No response available";

      // ================= ASSISTANT MESSAGE =================

      const assistantMessage = {
        role: "assistant",
        content: assistantContent,
        data: aiResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // ================= OPTIONAL =================
      // Send recommended products
      // to homepage/product cards

      /*
    setRecommendedProducts(
      aiResponse.products || []
    );
    */

      // ================= UPDATE CHAT TITLE =================

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId && conv.title === "New Chat") {
            return {
              ...conv,

              title: userInput.substring(0, 50),
            };
          }

          return conv;
        }),
      );
    } catch (error) {
      console.error("Send message error:", error);

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          content: "AI service temporarily unavailable.",
        },
      ]);
    } finally {
      setLoading(false);

      scrollToBottom();
    }
  };

  // ==================== VOICE INPUT ====================

  /**
   * Handle voice input using Web Speech API
   */
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  /**
   * Speak assistant response using Web Speech API
   */
  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // ==================== EFFECTS ====================

  /**
   * Initialize: Create first conversation on mount
   */
  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open]);

  /**
   * Auto-scroll when messages  changes
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (activeConversationId) {
      loadChatHistory(activeConversationId);
    }
  }, [activeConversationId]);

  // ==================== RENDER ====================

  return (
    <>
      {/* 💬 Floating Toggle Button */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999,
        }}
      >
        <button
          className="btn btn-primary rounded-circle"
          style={{
            width: "60px",
            height: "60px",
            fontSize: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          onClick={() => setOpen(!open)}
          title={open ? "Close chat" : "Open chat"}
        >
          💬
        </button>
      </div>

      {/* 🧠 Main Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "90vw",
            maxWidth: "1000px",
            height: "80vh",
            maxHeight: "700px",
            zIndex: 1000,
            display: "flex",
            borderRadius: "12px",
            boxShadow: "0 5px 40px rgba(0,0,0,0.16)",
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          {/* ==================== LEFT SIDEBAR ====================  */}
          <div
            style={{
              width: "260px",
              borderRight: "1px solid #e5e5e5",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
            }}
          >
            {/* New Chat Button */}
            <button
              onClick={createNewChat}
              style={{
                margin: "12px",
                padding: "10px 16px",
                backgroundColor: "#10a37f",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
              }}
              title="Start new conversation"
            >
              ➕ New Chat
            </button>

            {/* Conversations List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              {conversations.length === 0 ? (
                <div
                  style={{
                    padding: "16px",
                    color: "#999",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => switchConversation(conv.id)}
                    style={{
                      padding: "12px 16px",
                      marginX: "8px",
                      marginY: "4px",
                      backgroundColor:
                        activeConversationId === conv.id
                          ? "#e7e7e7"
                          : "transparent",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background-color 0.2s",
                      borderLeft:
                        activeConversationId === conv.id
                          ? "3px solid #10a37f"
                          : "3px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (activeConversationId !== conv.id) {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeConversationId !== conv.id) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#000",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={conv.title}
                      >
                        {conv.title}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#999",
                          marginTop: "2px",
                        }}
                      >
                        {new Date(conv.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => deleteConversation(conv.id, e)}
                      style={{
                        marginLeft: "8px",
                        background: "none",
                        border: "none",
                        color: "#d1d5db",
                        cursor: "pointer",
                        fontSize: "16px",
                        padding: "4px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#d1d5db";
                      }}
                      title="Delete conversation"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ==================== MAIN CHAT AREA ====================  */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e5e5e5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h6 style={{ margin: 0, color: "#000", fontWeight: "600" }}>
                🤖 AI Assistant
              </h6>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#999",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                      💬
                    </div>

                    <div>Start a conversation by typing a message</div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems:
                          msg.role === "user" ? "flex-end" : "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      {/* Chat Bubble */}
                      <div
                        style={{
                          backgroundColor:
                            msg.role === "user" ? "#10a37f" : "#f5f5f5",

                          color: msg.role === "user" ? "white" : "#000",

                          padding: "12px 16px",

                          borderRadius: "12px",

                          maxWidth: "70%",

                          wordWrap: "break-word",

                          fontSize: "14px",

                          lineHeight: "1.6",
                        }}
                      >
                        {msg.content ||
                          (msg.role === "assistant"
                            ? "Loading response..."
                            : "Message")}
                      </div>

                      {/* AI Dynamic Renderer */}

                      {msg.role === "assistant" && msg.data && (
                        <AIResponseRenderer
                          data={msg.data}
                          BASE_URL={BASE_URL}
                        />
                      )}
                    </div>
                  ))}

                  {/* Loading */}
                  {loading && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#f5f5f5",
                          color: "#999",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          fontSize: "14px",
                        }}
                      >
                        Thinking...
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "16px",
                borderTop: "1px solid #e5e5e5",
                display: "flex",
                gap: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  opacity: loading ? 0.6 : 1,
                }}
              />

              {/* Mic Button */}
              <button
                onClick={handleVoiceInput}
                disabled={loading}
                style={{
                  padding: "10px 12px",
                  backgroundColor: isListening ? "#ef4444" : "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  opacity: loading ? 0.6 : 1,
                }}
                title={isListening ? "Listening..." : "Click to speak"}
              >
                {isListening ? "🎙️" : "🎤"}
              </button>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#10a37f",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  opacity: loading || !input.trim() ? 0.6 : 1,
                }}
                title="Send message (Enter)"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blinking Cursor Animation */}
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
