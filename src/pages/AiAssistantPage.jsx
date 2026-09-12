import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { useStations } from '../context/StationContext';
import { aiApi } from '../api/aiApi';
import { AiModeSelector } from '../components/ai/AiModeSelector';
import { AiQuickActions } from '../components/ai/AiQuickActions';
import { PriceBadge } from '../components/common/PriceBadge';
import { GreenScoreBadge } from '../components/common/GreenScoreBadge';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sun,
  Flame,
  Calendar,
  Layers
} from 'lucide-react';

export const AiAssistantPage = () => {
  const navigate = useNavigate();
  const { primaryVehicle } = useVehicles();
  const { setSelectedStation, setFilters } = useStations();

  const [aiMode, setAiMode] = useState('smart');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initial chat state with realistic assistant introduction
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello! I'm **GreenCharge AI**, your specialized smart EV charging co-pilot for India. I monitor Western grid tariffs, solar feed-in, and local station queues to find your optimum charge.`,
      timestamp: 'Just now'
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendQuery = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await aiApi.askGreenChargeAi(text, primaryVehicle, aiMode);
      const aiMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        data: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: 'Unable to reach the charging optimization engine. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExecuteAction = (action) => {
    if (!action) return;
    if (action.type === 'VIEW_STATION' && action.stationId) {
      navigate(`/charging/${action.stationId}`);
    } else if (action.type === 'FILTER_MAP') {
      navigate('/map');
    } else if (action.type === 'SCHEDULE_CHARGE') {
      navigate('/dashboard');
    } else if (action.type === 'VIEW_VEHICLE') {
      navigate('/vehicles');
    } else {
      navigate('/map');
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-white pb-24 md:pb-12 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-4 sm:pt-6 flex-1 flex flex-col space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-forest/10 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest to-forest-2 text-white flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-amber" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-xl text-forest dark:text-white">
                  GreenCharge AI
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/80 text-forest dark:text-emerald-300 text-[10px] font-heading font-semibold">
                  Active
                </span>
              </div>
              <span className="text-xs text-ink-soft dark:text-ink-muted">
                India Smart Charging &amp; Tariff Assistant
              </span>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-ink-soft dark:text-ink-muted block">Selected EV</span>
            <b className="font-heading text-xs text-forest dark:text-emerald-400">
              {primaryVehicle?.name || 'Tata Nexon EV'} ({primaryVehicle?.currentBatteryPct}%)
            </b>
          </div>
        </div>

        {/* AI Mode Selector: Smart, Cheapest, Greenest, Fastest, Emergency */}
        <div className="space-y-1">
          <span className="text-[11px] font-heading font-semibold uppercase text-ink-soft dark:text-ink-muted pl-1">
            Optimization Strategy
          </span>
          <AiModeSelector activeMode={aiMode} onModeChange={setAiMode} />
        </div>

        {/* Chat History & Assistant Messages */}
        <div className="flex-1 bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 rounded-3xl p-4 sm:p-6 shadow-soft overflow-y-auto max-h-[520px] space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-emerald-300" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-xl rounded-2xl p-4 text-xs sm:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-forest text-white shadow-soft rounded-tr-xs'
                    : 'bg-paper-card dark:bg-paper-surface border border-forest/10 dark:border-white/5 rounded-tl-xs space-y-3'
                }`}
              >
                {/* Standard Text */}
                {msg.text && (
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                )}

                {/* Structured Specialized AI Response Card (Prompt Section 25) */}
                {msg.data && (
                  <div className="space-y-3">
                    {/* Recommendation Title */}
                    <div className="font-medium text-ink dark:text-white leading-relaxed">
                      {msg.data.recommendation}
                    </div>

                    {/* Confidence & Freshness Header */}
                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-forest/10 dark:border-white/10">
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-heading font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {msg.data.confidence} Confidence ({msg.data.confidenceScore}%)
                      </span>
                      <span className="text-[10px] text-ink-soft dark:text-ink-muted">
                        {msg.data.dataFreshness}
                      </span>
                    </div>

                    {/* Station & Specs Box */}
                    {msg.data.station && (
                      <div className="p-3 rounded-xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10.5px] font-heading font-semibold text-forest-600 dark:text-emerald-300">
                              {msg.data.station.network}
                            </span>
                            <h4 className="font-heading font-bold text-sm text-ink dark:text-white">
                              {msg.data.station.name}
                            </h4>
                          </div>
                          <PriceBadge price={msg.data.station.pricePerKwh} size="xs" priceType={msg.data.priceType} />
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs py-1.5 bg-paper-card dark:bg-paper-surface rounded-lg">
                          <div>
                            <span className="text-[9px] text-ink-soft dark:text-ink-muted uppercase">Distance</span>
                            <b className="font-heading block">{msg.data.distance}</b>
                          </div>
                          <div>
                            <span className="text-[9px] text-ink-soft dark:text-ink-muted uppercase">Duration</span>
                            <b className="font-heading block text-forest dark:text-emerald-400">{msg.data.chargingTime}</b>
                          </div>
                          <div>
                            <span className="text-[9px] text-ink-soft dark:text-ink-muted uppercase">Renewable</span>
                            <b className="font-heading block text-emerald-600">{msg.data.renewablePct}%</b>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Reasons Bullet List */}
                    {msg.data.reasons && msg.data.reasons.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-heading font-semibold tracking-wider text-ink-soft dark:text-ink-muted">
                          Why this recommendation:
                        </span>
                        <ul className="space-y-1">
                          {msg.data.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-ink-soft dark:text-ink-muted">
                              <CheckCircle2 className="w-3.5 h-3.5 text-leaf shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Trigger UI Action Button (Prompt Section 26) */}
                    {msg.data.action && (
                      <button
                        onClick={() => handleExecuteAction(msg.data.action)}
                        className="w-full min-h-[42px] py-2 px-3 rounded-xl bg-forest hover:bg-forest-600 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer mt-2"
                      >
                        <span>{msg.data.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                <div
                  className={`text-[9px] text-right mt-1 ${
                    msg.sender === 'user' ? 'text-emerald-200' : 'text-ink-soft dark:text-ink-muted'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-ink-soft dark:text-ink-muted p-2">
              <div className="w-7 h-7 rounded-xl bg-forest text-white flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <span className="flex items-center gap-1 font-heading">
                Analyzing Gujarat SLDC grid tariffs &amp; nearby stations
                <span className="animate-pulse">...</span>
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Inquiries */}
        <AiQuickActions onSelectAction={(q) => handleSendQuery(q)} />

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything: e.g. Where should I charge? When is tariff lowest today?"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 min-h-[48px] px-4 rounded-2xl bg-white dark:bg-paper-cardDark border border-forest/15 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:border-forest"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="min-h-[48px] min-w-[48px] px-4 rounded-2xl bg-forest hover:bg-forest-600 disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
