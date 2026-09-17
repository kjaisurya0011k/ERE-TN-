import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, Send, X, RotateCcw, Sparkles, MessageSquare, 
  ExternalLink, ArrowRight, CheckCircle2, Compass, 
  GraduationCap, Briefcase, DollarSign, Users, Trash2, Plus, Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { novaApi } from '../../services/api';
import { RoadmapWidget, RoadmapData } from './RoadmapWidget';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  actionButtons?: Array<{
    type: string;
    label: string;
    url?: string;
    badge?: string;
  }>;
  roadmap?: RoadmapData;
  createdAt?: string;
}

interface NovaChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovaChatDrawer: React.FC<NovaChatDrawerProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [conversations, setConversations] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestedPrompts = [
    {
      icon: <GraduationCap className="w-4 h-4 text-blue-600" />,
      text: language === 'ta' ? '12ஆம் வகுப்புக்குப் பின் என்ன படிக்கலாம்?' : language === 'hi' ? '12वीं के बाद क्या करें?' : 'What can I do after 12th?',
    },
    {
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      text: language === 'ta' ? 'எனக்கான அரசு உதவித்தொகைகள் என்ன?' : language === 'hi' ? 'मेरे लिए सरकारी छात्रवृत्तियां खोजें' : 'Find verified scholarships for me',
    },
    {
      icon: <Compass className="w-4 h-4 text-indigo-600" />,
      text: language === 'ta' ? 'கிளவுட் & ஏஐ தொழில் ரோட்மேப்' : language === 'hi' ? 'डेटा साइंस करियर रोडमैप बनाएं' : 'Create my Data Science & AI career roadmap',
    },
    {
      icon: <Briefcase className="w-4 h-4 text-purple-600" />,
      text: language === 'ta' ? 'சிறந்த பொறியியல் துறையை தேர்வு செய்ய உதவுங்கள்' : language === 'hi' ? 'इंजीनियरिंग ब्रांच कैसे चुनें?' : 'Which engineering branch is best for me?',
    },
    {
      icon: <Users className="w-4 h-4 text-amber-600" />,
      text: language === 'ta' ? 'ERE-TN வழிகாட்டியுடன் ஆலோசனை' : language === 'hi' ? 'ERE-TN मेंटर से 1-ऑन-1 परामर्श लें' : 'Connect with an ERE-TN mentor',
    },
    {
      icon: <Sparkles className="w-4 h-4 text-cyan-600" />,
      text: language === 'ta' ? '2026-ன் புதிய தொழில்நுட்பங்கள் யாவை?' : language === 'hi' ? '2026 की उभरती टेक्नोलॉजी क्या हैं?' : 'What emerging tech should I learn in college?',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      if (isAuthenticated) {
        loadConversationList();
      }
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversationList = async () => {
    try {
      const data = await novaApi.getConversations();
      setConversations(data || []);
    } catch {
      // ignore
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputText.trim();
    if (!promptToSend || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: promptToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const sessionToken = !isAuthenticated ? localStorage.getItem('edunova_guest_session') || `guest_${Date.now()}` : undefined;
      if (sessionToken) localStorage.setItem('edunova_guest_session', sessionToken);

      const response = await novaApi.chat({
        message: promptToSend,
        conversationId,
        sessionToken,
        language,
      });

      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const assistantMessage: Message = {
        id: response.messageId,
        role: 'assistant',
        content: response.content,
        actionButtons: response.actionButtons,
        roadmap: response.roadmap,
        createdAt: response.createdAt,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content:
          language === 'ta'
            ? 'மன்னிக்கவும், AI சேவை தற்காலிகமாக கிடைக்கவில்லை. நீங்கள் ERE-TN-ன் சரிபார்க்கப்பட்ட வாய்ப்புகள் மற்றும் வழிகாட்டிகளை நேரடியாகப் பார்க்கலாம்.'
            : language === 'hi'
            ? 'क्षमा करें, NOVA AI सेवा अस्थायी रूप से अनुपलब्ध है। आप ERE-TN के सत्यापित अवसरों को सीधे देख सकते हैं।'
            : 'NOVA AI is temporarily unavailable. You can still explore verified scholarships and mentors directly on ERE-TN.',
        actionButtons: [
          { type: 'CHECK_ELIGIBILITY', label: 'Check Eligibility', url: '/opportunities?eligibility=true' },
          { type: 'OPPORTUNITY', label: 'Explore Opportunities', url: '/opportunities' },
          { type: 'MENTOR', label: 'View Mentors', url: '/mentors' },
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setConversationId(undefined);
    setShowHistory(false);
  };

  const handleSelectPastChat = async (convId: string) => {
    try {
      setLoading(true);
      setConversationId(convId);
      setShowHistory(false);
      const data = await novaApi.getMessages(convId);
      setMessages(data || []);
    } catch {
      alert('Could not load past conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await novaApi.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (conversationId === convId) {
        handleStartNewChat();
      }
    } catch {
      alert('Failed to delete conversation');
    }
  };

  const handleActionClick = (action: { type: string; url?: string }) => {
    if (action.url) {
      if (action.url.startsWith('http')) {
        window.open(action.url, '_blank', 'noopener,noreferrer');
      } else {
        onClose();
        navigate(action.url);
      }
    }
  };

  const renderMarkdown = (text: string) => {
    // Convert basic markdown formatting to styled elements
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-extrabold text-primary mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-black text-primary mt-2 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="p-2.5 my-2 rounded-xl bg-blue-50 border-l-4 border-blue-600 text-xs text-blue-900 font-medium">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs leading-relaxed text-slate-700 my-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line.substring(2)) }} />
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="text-xs leading-relaxed text-slate-700 my-1 flex items-start gap-1.5">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs leading-relaxed text-slate-700 my-0.5" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-blue-700">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-blue-600 hover:underline font-bold inline-flex items-center gap-0.5">$1 <span class="material-symbols-outlined text-[12px]">open_in_new</span></a>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full sm:w-[480px] h-[92vh] sm:h-[680px] max-h-[95vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 transition-all animate-scale-in"
        role="dialog"
        aria-label="NOVA AI Chat"
      >
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md relative">
              <Bot className="w-6 h-6" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-indigo-950 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-black tracking-tight">NOVA AI</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider border border-blue-400/30">
                  {language.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Your AI Guide for Education & Career</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isAuthenticated && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                title="Conversation History"
                className={`p-2 rounded-xl text-slate-300 hover:text-white transition-colors ${
                  showHistory ? 'bg-white/20 text-white' : 'hover:bg-white/10'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleStartNewChat}
              title="New Chat"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              title="Close"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50 relative">
          {/* History Sidebar Overlay */}
          {showHistory && (
            <div className="absolute inset-0 bg-white z-20 p-5 overflow-y-auto space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> Past Conversations
                </h4>
                <button
                  onClick={handleStartNewChat}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-3.5 h-3.5" /> New Chat
                </button>
              </div>

              {conversations.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No past chats yet.</p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectPastChat(conv.id)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 cursor-pointer flex items-center justify-between transition-all group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-900 truncate">{conv.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{conv.lastMessage}</div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all ml-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Welcome Screen when messages are empty */}
          {messages.length === 0 && (
            <div className="space-y-5 py-4 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl mx-auto">
                  <Bot className="w-8 h-8" />
                </div>
                <h4 className="font-display text-lg font-black text-slate-900">
                  {language === 'ta'
                    ? 'வணக்கம்! நான் நோவா (NOVA)'
                    : language === 'hi'
                    ? 'नमस्ते! मैं नोवा (NOVA) हूँ'
                    : "Hi! I'm NOVA AI"}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {language === 'ta'
                    ? 'உங்களின் உயர்கல்வி, உதவித்தொகைகள், தொழில் ரோட்மேப் மற்றும் திறன் மேம்பாட்டிற்கான AI வழிகாட்டி.'
                    : language === 'hi'
                    ? 'आपकी उच्च शिक्षा, छात्रवृत्ति, करियर रोडमैप और कौशल विकास के लिए आपका AI गाइड।'
                    : 'Ask me anything about scholarships, college choices, career roadmaps, or mentors.'}
                </p>
              </div>

              {/* Suggestion Chips */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                  Suggested Questions
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt.text)}
                      className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 text-left text-xs font-semibold text-slate-800 flex items-center gap-3 transition-all shadow-sm group active:scale-98"
                    >
                      <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors">
                        {prompt.icon}
                      </div>
                      <span className="flex-1">{prompt.text}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-br-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="space-y-1">{renderMarkdown(msg.content)}</div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}

                {/* Roadmap Widget if attached */}
                {msg.roadmap && <RoadmapWidget roadmap={msg.roadmap} />}

                {/* Action Buttons if attached */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                    {msg.actionButtons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={() => handleActionClick(btn)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 shadow-sm transition-all active:scale-95"
                      >
                        <span>{btn.label}</span>
                        {btn.url?.startsWith('http') ? (
                          <ExternalLink className="w-3 h-3 text-blue-500" />
                        ) : (
                          <ArrowRight className="w-3 h-3 text-blue-500" />
                        )}
                        {btn.badge && (
                          <span className="ml-1 px-1.5 py-0.2 rounded bg-blue-600 text-white text-[9px]">
                            {btn.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200/90 max-w-[120px] shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                language === 'ta'
                  ? 'நோவாவிடம் கேளுங்கள் (எ.கா. உதவித்தொகைகள், ரோட்மேப்)...'
                  : language === 'hi'
                  ? 'नोवा से पूछें (उदा. छात्रवृत्ति, करियर रोडमैप)...'
                  : 'Ask NOVA (e.g. scholarships, career roadmap)...'
              }
              className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-900 focus:outline-none resize-none max-h-24 min-h-[36px]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1 font-medium">
            <span>NOVA AI • Grounded in ERE-TN Verified Schemes</span>
            <span>Press Enter ↵ to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NovaChatDrawer;
