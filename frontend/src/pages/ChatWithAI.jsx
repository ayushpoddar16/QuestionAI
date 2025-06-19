import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  MessageCircle,
  X,
  Copy,
  Check,
  Trash2,
} from "lucide-react";

const ChatWithAI = ({ isOpen, onClose, context = null }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Create a unique storage key based on context to separate different chat sessions
  const getStorageKey = () => {
  if (context) {
    // Create a hash of the context to make a unique key
    // First encode to UTF-8, then to base64 to handle Unicode characters
    const contextHash = btoa(encodeURIComponent(context.substring(0, 100))).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    return `chat_messages_${contextHash}`;
  }
  return "chat_messages_general";
};

  const STORAGE_KEY = getStorageKey();

  // Load messages from localStorage on component mount
  useEffect(() => {
    if (!isInitialized) {
      try {
        const savedMessages = localStorage.getItem(STORAGE_KEY);
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsedMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading messages from localStorage:", error);
        setIsInitialized(true);
      }
    }
  }, [isInitialized, STORAGE_KEY]);

  // Save messages to localStorage whenever messages change (but only after initialization)
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving messages to localStorage:", error);
      }
    }
  }, [messages, isInitialized, STORAGE_KEY]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Add welcome message when chat opens for first time (only if no messages exist and initialized)
  useEffect(() => {
    if (isOpen && isInitialized && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: "ai",
        content: context 
          ? "Hello! I'm your AI assistant. I have access to your question paper content and our previous conversation. Feel free to ask me anything about your studies!"
          : "Hello! I'm your AI assistant. I'm here to help you with your academic questions. Feel free to ask me anything!",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, isInitialized, context]);

  // Function to prepare conversation history for API
  const prepareConversationHistory = () => {
    // Get only the last 10 messages to avoid token limits (adjust as needed)
    const recentMessages = messages.slice(-10);
    
    return recentMessages
      .filter(msg => msg.type === 'user' || msg.type === 'ai') // Exclude error messages
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // Prepare conversation history
      const conversationHistory = prepareConversationHistory();
      
      const response = await fetch("http://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: context, // Pass any context from question papers
          conversationHistory: conversationHistory, // Send conversation history
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: "ai",
          content: data.response, // Keep original formatting
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || "Failed to get AI response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "error",
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const clearChat = () => {
    // Clear from localStorage first
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing messages from localStorage:", error);
    }
    
    // Clear messages state
    setMessages([]);
    
    // Add welcome message after clearing
    setTimeout(() => {
      const welcomeMessage = {
        id: Date.now(),
        type: "ai",
        content: context 
          ? "Chat cleared! I still have access to your question paper content. How can I help you today?"
          : "Chat cleared! How can I help you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  // Function to render formatted text (converts markdown to JSX)
  const renderFormattedText = (text) => {
    if (!text) return "";

    // Split text by line breaks to handle paragraphs
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      if (!line.trim()) return <br key={lineIndex} />;

      // Process the line for various formatting
      const elements = [];
      let lastIndex = 0;

      // Handle bold text (**text** or __text__)
      const boldRegex = /(\*\*|__)(.*?)\1/g;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          elements.push(line.slice(lastIndex, match.index));
        }
        // Add bold element
        elements.push(
          <strong key={`${lineIndex}-${match.index}`}>{match[2]}</strong>
        );
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < line.length) {
        elements.push(line.slice(lastIndex));
      }

      // If no formatting was found, return the original line
      if (elements.length === 0) {
        elements.push(line);
      }

      return (
        <div key={lineIndex} className="mb-1">
          {elements}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            {/* Enhanced AI Logo */}
            <div className="w-10 h-10 bg-blue-900 bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
              <div className="relative">
                <Bot className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <p className="text-sm opacity-90">
                {context ? "Context-aware chat" : "Ask me anything about your studies"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Enhanced Clear Button */}
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Clear all messages"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area - Changed background */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br bg-blue-100">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user"
                    ? "bg-blue-600 text-white shadow-lg"
                    : message.type === "error"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {message.type !== "user" && (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                        message.type === "error" ? "bg-red-200" : "bg-gray-800"
                      }`}
                    >
                      <Bot
                        className={`w-4 h-4 ${
                          message.type === "error"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm leading-relaxed">
                      {message.type === "ai"
                        ? renderFormattedText(message.content)
                        : message.content}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div
                        className={`text-xs ${
                          message.type === "user"
                            ? "text-blue-200"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      {message.type !== "user" && (
                        <button
                          onClick={() =>
                            copyToClipboard(message.content, message.id)
                          }
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {message.type === "user" && (
                    <div className="w-6 h-6 bg-blue-400 bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 max-w-[80%]">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your studies..."
                className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 max-h-32"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          {context && (
            <div className="mt-2 text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
              💡 I have access to your question paper content and our conversation history to provide more relevant answers
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWithAI;