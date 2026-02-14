import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface AIChatbotProps {
  displayState: 'collapsed' | 'expanded' | 'fullscreen';
  onStateChange: (state: 'collapsed' | 'expanded' | 'fullscreen') => void;
  circleName?: string;
  currentView?: string;
}

type AgentMode = 'analysis' | 'strategy' | 'benchmarking' | 'forecasting' | 'trends';

const suggestedPrompts = [
  "🎯 What should I prioritize this week?",
  "📊 How are my KPIs trending?",
  "💰 Am I ready to fundraise?",
  "🚀 What's blocking our growth?"
];

export default function AIChatbot({ displayState, onStateChange }: AIChatbotProps) {
  console.log('Athena initialized'); // Suppress unused warnings temporarily
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `I'm Athena, built to execute alongside startup teams.\n\nI learn from your execution, track what truly matters, and help you make smarter, faster decisions as you build based on the market.\n\nI turn your daily work into structured insight, so you always know:\n\n• What to prioritize\n• Where your biggest leverage is\n• And how you compare to top startups at your stage\n\n**I can help you:**\n• Focus on the highest-impact work\n• Track meaningful, investor-grade KPIs\n• Identify hidden risks and growth opportunities\n• Generate real-time insights from your progress\n• Prepare you for fundraising and scaling\n\nWhat would you like to explore?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState<AgentMode>('analysis');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showMoreIntelligence, setShowMoreIntelligence] = useState(false);
  const [showLiveIntelligence, setShowLiveIntelligence] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate intelligent AI responses based on the question
    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = '';
      
      const lowerText = messageText.toLowerCase();
      
      if (lowerText.includes('prioritize') || lowerText.includes('focus') || lowerText.includes('should i')) {
        aiResponse = `📋 **Priority Analysis**\n\nBased on your current stage and metrics, here's what matters most:\n\n**🎯 Top 3 Priorities:**\n1. **Customer Discovery** - You have 3 active customer conversations. Close these insights this week.\n2. **Product Iteration** - Your task completion rate suggests you're building. Focus on validating assumptions.\n3. **Metric Tracking** - Set up your core KPIs (retention, engagement) to measure what's working.\n\n💡 **Strategic Insight:**\nAt your stage, speed of learning > speed of building. Talk to more customers before scaling development.\n\n**Next Action:** Schedule 5 more customer interviews by Friday.`;
      } else if (lowerText.includes('kpi') || lowerText.includes('metric') || lowerText.includes('data')) {
        aiResponse = `📊 **KPI Health Check**\n\nLet me analyze your metrics:\n\n**Current Performance:**\n✅ Task completion: Strong (4/6 active tasks in progress)\n⚠️ Customer engagement: Need data\n⚠️ Revenue/pipeline: Not tracking yet\n\n**Recommendations:**\n1. Define your North Star Metric (What defines success?)\n2. Track weekly active engagement\n3. Set up a simple revenue/pipeline tracker\n\n💡 **Stage-Specific Advice:**\nFor pre-seed companies, focus on:\n• Customer retention rate\n• Time to value\n• Qualitative feedback themes\n\nThese matter more than vanity metrics.`;
      } else if (lowerText.includes('fundraise') || lowerText.includes('investor') || lowerText.includes('ready')) {
        aiResponse = `💰 **Fundraising Readiness Assessment**\n\n**Current Status:** Early Stage\n\n**Strengths:**\n✅ Active execution (team is shipping)\n✅ Organized system (using Circl)\n\n**Gaps to Address:**\n⚠️ Need clear traction metrics\n⚠️ Need customer validation proof\n⚠️ Need financial model\n\n**Timeline Recommendation:**\n🎯 **Not ready yet** - Focus on 2-3 months of execution first.\n\n**What to do now:**\n1. Get 10 paying customers (or 100 engaged users)\n2. Prove 2-3 core metrics are trending up\n3. Document your learnings\n\n💡 **Investor Insight:**\nInvestors want to see:\n• Problem validation\n• Solution traction\n• Market opportunity\n• Team execution\n\nYou're building #4. Focus on #1-2 next.`;
      } else if (lowerText.includes('block') || lowerText.includes('stuck') || lowerText.includes('growth')) {
        aiResponse = `🚧 **Blocker Analysis**\n\nLet me identify what's slowing you down:\n\n**Detected Issues:**\n1. **Paused Tasks** - 1 task is blocked (needs attention)\n2. **Data Gaps** - Missing key performance metrics\n3. **Unclear Next Steps** - Need strategic direction\n\n**Root Cause:**\nYou're building without clear validation. This creates uncertainty.\n\n**Unblocking Strategy:**\n✅ **This Week:**\n• Talk to 3 customers about their biggest pain\n• Define your core value proposition\n• Create a simple test to validate it\n\n✅ **Next Week:**\n• Build the minimum version of your solution\n• Get feedback from 5 users\n• Iterate based on data\n\n💡 **Growth Lever:**\nYour highest ROI activity right now is **customer discovery**, not feature development.`;
      } else {
        aiResponse = `🧠 **AI Analysis**\n\nI'm analyzing your question in the context of your company data...\n\n**What I know about your company:**\n• Stage: Early/Pre-seed\n• Team: Active execution mode\n• Focus: Product development + discovery\n• Metrics: Building baseline\n\n**My Recommendation:**\nLet's break this down into actionable insights. Could you tell me more about:\n\n1. What specific outcome you're trying to achieve?\n2. What's blocking you from getting there?\n3. What have you already tried?\n\nI'll provide stage-appropriate, data-driven guidance based on what's actually working for founders at your stage.\n\n💡 **Quick Tip:**\nThe most successful founders I've analyzed focus on:\n✅ Customer feedback loops\n✅ One key metric that matters\n✅ Weekly execution cadence\n\nAre you doing these?`;
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModeConfig = (mode: AgentMode) => {
    const configs = {
      analysis: { icon: '', label: 'Analysis', color: 'from-blue-600 to-blue-700' },
      strategy: { icon: '', label: 'Strategy', color: 'from-purple-600 to-purple-700' },
      benchmarking: { icon: '', label: 'Benchmarking', color: 'from-green-600 to-green-700' },
      forecasting: { icon: '', label: 'Forecasting', color: 'from-orange-600 to-orange-700' },
      trends: { icon: '', label: 'Trends', color: 'from-pink-600 to-pink-700' }
    };
    return configs[mode];
  };

  // Collapsed Icon State
  if (displayState === 'collapsed') {
    return (
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-16 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl border-l border-slate-700 flex flex-col items-center justify-start py-6 z-30">
        <button
          onClick={() => onStateChange('expanded')}
          className="group relative"
          title="Open Athena"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all hover:scale-110">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 512 512">
              <path fillRule="evenodd" d="M256 44 C218 44 186 64 168 96 C132 92 102 108 88 136 C66 181 78 244 124 282 C118 335 138 383 176 413 L176 425 C176 447 158 465 136 465 L120 465 C104 465 92 477 92 492 C92 503 101 512 112 512 L400 512 C411 512 420 503 420 492 C420 477 408 465 392 465 L376 465 C354 465 336 447 336 425 L336 413 C374 383 394 335 388 282 C434 244 446 181 424 136 C410 108 380 92 344 96 C326 64 294 44 256 44 Z"/>
            </svg>
          </div>
          {/* Active pulse indicator */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
        
        {/* Vertical "Athena" text */}
        <div className="mt-6 text-slate-400 text-xs font-semibold tracking-wider" style={{ writingMode: 'vertical-rl' }}>
          ATHENA
        </div>
      </div>
    );
  }

  // Fullscreen State - Placeholder for future expansion
  if (displayState === 'fullscreen') {
    return (
      <div className="fixed inset-0 top-16 bg-gradient-to-br from-slate-900 to-slate-800 z-40 flex flex-col">
        <div className="relative px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="relative flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 512 512">
                  <path fillRule="evenodd" d="M256 44 C218 44 186 64 168 96 C132 92 102 108 88 136 C66 181 78 244 124 282 C118 335 138 383 176 413 L176 425 C176 447 158 465 136 465 L120 465 C104 465 92 477 92 492 C92 503 101 512 112 512 L400 512 C411 512 420 503 420 492 C420 477 408 465 392 465 L376 465 C354 465 336 447 336 425 L336 413 C374 383 394 335 388 282 C434 244 446 181 424 136 C410 108 380 92 344 96 C326 64 294 44 256 44 Z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl">Athena</h2>
                <p className="text-slate-300 text-sm">Strategic Operating Partner • Mission Control</p>
              </div>
            </div>
            <button
              onClick={() => onStateChange('expanded')}
              className="text-slate-400 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-2"
              title="Exit fullscreen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden max-w-7xl mx-auto w-full p-8">
          <div className="h-full flex items-center justify-center text-slate-400 text-lg">
            <p>Fullscreen Strategic Mode - Coming Soon</p>
          </div>
        </div>
      </div>
    );
  }

  // Expanded State (Main View)
  if (displayState !== 'expanded') return null;

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl border-l border-slate-700 flex flex-col z-30 transition-all duration-300">
      {/* Header with Gradient */}
      <div className="relative px-4 py-4 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 512 512">
                  <path fillRule="evenodd" d="M256 44 C218 44 186 64 168 96 C132 92 102 108 88 136 C66 181 78 244 124 282 C118 335 138 383 176 413 L176 425 C176 447 158 465 136 465 L120 465 C104 465 92 477 92 492 C92 503 101 512 112 512 L400 512 C411 512 420 503 420 492 C420 477 408 465 392 465 L376 465 C354 465 336 447 336 425 L336 413 C374 383 394 335 388 282 C434 244 446 181 424 136 C410 108 380 92 344 96 C326 64 294 44 256 44 Z"/>
                </svg>
              </div>
              {/* Active indicator */}
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold text-base">
                Athena
              </h3>
              <p className="text-slate-300 text-xs font-medium">The Strategic Operating Partner • Always Learning</p>
            </div>
          </div>
          <button
            onClick={() => onStateChange('collapsed')}
            className="text-slate-400 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-1.5"
            title="Collapse Athena"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode Selector */}
        <div className="relative mt-3 flex items-center space-x-1.5">
          {(['analysis', 'strategy', 'benchmarking', 'forecasting', 'trends'] as AgentMode[]).map((mode) => {
            const config = getModeConfig(mode);
            return (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === mode
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Intelligence Layer - Real-time Signals */}
      <div className="bg-slate-900/50 border-b border-slate-700">
        <button
          onClick={() => setShowLiveIntelligence(!showLiveIntelligence)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-semibold text-slate-300">Live Intelligence</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-500 font-mono">142 decisions analyzed</span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${showLiveIntelligence ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {showLiveIntelligence && (
          <div className="px-4 pb-3">
            {activeMode === 'analysis' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
                  <span className="text-[10px]">⚠️</span>
                </div>
                <span className="text-xs text-slate-300">Revenue growth slowed 18%</span>
              </div>
              <span className="text-xs font-bold text-orange-400">-18%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                  <span className="text-[10px]">🎯</span>
                </div>
                <span className="text-xs text-slate-300">Biggest lever: Outbound</span>
              </div>
              <span className="text-xs font-bold text-blue-400">High</span>
            </div>
            {showMoreIntelligence && (
              <>
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-[10px]">✅</span>
                    </div>
                    <span className="text-xs text-slate-300">Task completion rate</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">67%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center">
                      <span className="text-[10px]">💰</span>
                    </div>
                    <span className="text-xs text-slate-300">Burn rate trend</span>
                  </div>
                  <span className="text-xs font-bold text-yellow-400">Stable</span>
                </div>
              </>
            )}
          </div>
        )}

        {activeMode === 'benchmarking' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <span className="text-xs text-slate-300">vs. 87 early-stage startups</span>
              <span className="text-xs font-bold text-emerald-400">Top 18%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <span className="text-xs text-slate-300">Growth velocity</span>
              <span className="text-xs font-bold text-emerald-400">Above avg</span>
            </div>
            {showMoreIntelligence && (
              <>
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <span className="text-xs text-slate-300">Activation rate</span>
                  <span className="text-xs font-bold text-orange-400">Below avg</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <span className="text-xs text-slate-300">Customer retention</span>
                  <span className="text-xs font-bold text-emerald-400">Above avg</span>
                </div>
              </>
            )}
          </div>
        )}

        {activeMode === 'forecasting' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <span className="text-xs text-slate-300">Runway projection</span>
              <span className="text-xs font-bold text-yellow-400">8.2 months</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <span className="text-xs text-slate-300">Fundraising readiness</span>
              <span className="text-xs font-bold text-orange-400">67%</span>
            </div>
            {showMoreIntelligence && (
              <>
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <span className="text-xs text-slate-300">Next milestone ETA</span>
                  <span className="text-xs font-bold text-blue-400">6 weeks</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <span className="text-xs text-slate-300">Revenue forecast (Q2)</span>
                  <span className="text-xs font-bold text-emerald-400">$45K</span>
                </div>
              </>
            )}
          </div>
        )}

        {activeMode === 'strategy' && (
          <div className="space-y-2">
            <div className="p-2 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-300">🎯 Your strongest traction is in <span className="font-bold text-purple-400">fintech</span></p>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-300">💼 Enterprise deals = <span className="font-bold text-emerald-400">highest leverage path</span></p>
            </div>
            {showMoreIntelligence && (
              <>
                <div className="p-2 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-300">📢 Focus on <span className="font-bold text-blue-400">content marketing</span> for lead gen</p>
                </div>
                <div className="p-2 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-300">⏰ Best time to raise: <span className="font-bold text-yellow-400">2-3 months</span></p>
                </div>
              </>
            )}
          </div>
        )}

        {activeMode === 'trends' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <span className="text-xs text-slate-300">User growth (30d)</span>
              <span className="text-xs font-bold text-emerald-400">↗ +24%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
              <span className="text-xs text-slate-300">Customer engagement</span>
              <span className="text-xs font-bold text-blue-400">↗ +12%</span>
            </div>
            {showMoreIntelligence && (
              <>
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <span className="text-xs text-slate-300">Churn rate</span>
                  <span className="text-xs font-bold text-emerald-400">↘ -8%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <span className="text-xs text-slate-300">Revenue per user</span>
                  <span className="text-xs font-bold text-purple-400">↗ +15%</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Show More Button */}
        <button
          onClick={() => setShowMoreIntelligence(!showMoreIntelligence)}
          className="w-full mt-2 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-300 transition-colors flex items-center justify-center space-x-1"
        >
          <span>{showMoreIntelligence ? 'Show less' : 'Show more'}</span>
          <svg
            className={`w-3 h-3 transition-transform ${showMoreIntelligence ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                message.isUser
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border border-blue-500'
                  : 'bg-slate-800 text-slate-100 border border-slate-700'
              }`}
            >
              {!message.isUser && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 512 512">
                      <path fillRule="evenodd" d="M256 44 C218 44 186 64 168 96 C132 92 102 108 88 136 C66 181 78 244 124 282 C118 335 138 383 176 413 L176 425 C176 447 158 465 136 465 L120 465 C104 465 92 477 92 492 C92 503 101 512 112 512 L400 512 C411 512 420 503 420 492 C420 477 408 465 392 465 L376 465 C354 465 336 447 336 425 L336 413 C374 383 394 335 388 282 C434 244 446 181 424 136 C410 108 380 92 344 96 C326 64 294 44 256 44 Z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Athena
                  </span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
              <span className={`text-xs mt-1.5 block ${message.isUser ? 'text-white/70' : 'text-slate-500'}`}>
                {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-slate-800 rounded-2xl px-4 py-3 shadow-md border border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 512 512">
                    <path fillRule="evenodd" d="M256 44 C218 44 186 64 168 96 C132 92 102 108 88 136 C66 181 78 244 124 282 C118 335 138 383 176 413 L176 425 C176 447 158 465 136 465 L120 465 C104 465 92 477 92 492 C92 503 101 512 112 512 L400 512 C411 512 420 503 420 492 C420 477 408 465 392 465 L376 465 C354 465 336 447 336 425 L336 413 C374 383 394 335 388 282 C434 244 446 181 424 136 C410 108 380 92 344 96 C326 64 294 44 256 44 Z"/>
                  </svg>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (only show when there are few messages) */}
      {messages.length <= 2 && (
        <>
          {/* Suggested Quick Actions */}
          <div className="border-t border-slate-700 bg-slate-900/50">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <p className="text-xs font-medium text-slate-400">Suggested quick actions</p>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${showQuickActions ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showQuickActions && (
              <div className="px-4 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-700 transition-all text-xs text-slate-300 hover:text-blue-400 font-medium"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-700 p-4 bg-slate-900">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about priorities, metrics, strategy..."
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none text-sm"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-3 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
