import React, { useState, useMemo } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { 
  MessageSquare, 
  Users, 
  Sparkles, 
  KeyRound, 
  Globe, 
  HelpCircle, 
  Compass, 
  ShieldCheck, 
  ExternalLink,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
}

const FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'non-haze-general-discussion',
    title: 'General Haze Discussion & Travel Advice',
    description: 'Connect with fellow tourists, ask about current weather conditions, and share your Singapore haze experiences.',
    category: 'Community',
  },
  {
    id: 'non-haze-indoor-gems',
    title: 'Top Indoor Substitutions & Hidden Gems',
    description: 'Share your favorite air-conditioned museums, shopping galleries, conservatory domes, and indoor spots.',
    category: 'Itinerary',
  },
  {
    id: 'non-haze-mask-supplies',
    title: 'Where to Buy N95 Masks & Saline Drops',
    description: 'Exchange real-time stock updates from Watsons, Guardian, Unity pharmacies, and 7-Eleven stores across Singapore.',
    category: 'Supplies',
  },
  {
    id: 'non-haze-family-kids',
    title: 'Traveling with Kids & Elderly During Haze',
    description: 'Tips for families on keeping sensitive groups comfortable, indoor play parks, and quick clinic visits if needed.',
    category: 'Health',
  },
];

export const TalkToUsForum: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(FORUM_TOPICS[0].id);
  const [enableSSO, setEnableSSO] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'zh_TW'>('en');
  
  // SSO configuration state (matching prompt specification)
  const [ssoConfig, setSsoConfig] = useState({
    name: 'CaptainHazeUser',
    button: 'https://images.unsplash.com/photo-1579208575657-c595a053b9b7?w=100&h=40&fit=crop',
    icon: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop',
    url: 'https://non-haze-activities.app/login/',
    logout: 'https://non-haze-activities.app/logout/',
    profile_url: 'https://non-haze-activities.app/profileUrlTemplate/{username}',
    remoteAuthS3: '',
    apiKey: '',
  });

  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);

  const currentTopic = useMemo(() => {
    return FORUM_TOPICS.find(t => t.id === selectedTopicId) || FORUM_TOPICS[0];
  }, [selectedTopicId]);

  // Construct current article object
  const currentArticle = useMemo(() => {
    const origin = typeof window !== 'undefined' && window.location.origin 
      ? window.location.origin 
      : 'https://non-haze-activities.app';

    return {
      url: `${origin}/talk#${currentTopic.id}`,
      id: currentTopic.id,
      title: `${currentTopic.title} | Non-Haze Activities`,
    };
  }, [currentTopic]);

  // Disqus configuration object passed to DiscussionEmbed
  const disqusConfig = useMemo(() => {
    if (enableSSO) {
      return {
        url: currentArticle.url,
        identifier: currentArticle.id,
        title: currentArticle.title,
        language: selectedLanguage,
        remoteAuthS3: ssoConfig.remoteAuthS3,
        apiKey: ssoConfig.apiKey,
        sso: {
          name: ssoConfig.name,
          button: ssoConfig.button,
          icon: ssoConfig.icon,
          url: ssoConfig.url,
          logout: ssoConfig.logout,
          profile_url: ssoConfig.profile_url,
          width: '800',
          height: '400',
        },
      };
    }

    return {
      url: currentArticle.url,
      identifier: currentArticle.id,
      title: currentArticle.title,
      language: selectedLanguage,
    };
  }, [currentArticle, enableSSO, selectedLanguage, ssoConfig]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Community Forum & Feedback</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Talk to Us
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Have questions about outdoor plans, real-time PSI readings, or want to recommend a great indoor spot? Join the conversation below with fellow tourists and locals.
            </p>
          </div>

          {/* Quick Metrics / Disqus Shortname Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Disqus Forum</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Live
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <span>non-haze-activities</span>
                <a
                  href="https://disqus.com/home/forums/non-haze-activities/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-700"
                  title="Open on Disqus.com"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Channel Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Select Discussion Topic
            </span>
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Embed Options & SSO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FORUM_TOPICS.map((topic) => {
              const isSelected = topic.id === selectedTopicId;
              const topicArticle = {
                url: typeof window !== 'undefined' && window.location.origin 
                  ? `${window.location.origin}/talk#${topic.id}` 
                  : `https://non-haze-activities.app/talk#${topic.id}`,
                id: topic.id,
                title: topic.title,
              };

              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                        isSelected
                          ? 'bg-slate-800 text-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {topic.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold line-clamp-1">
                      {topic.title}
                    </h4>
                    <p
                      className={`text-[11px] line-clamp-2 mt-1 leading-snug ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/20 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 opacity-70" />
                      {/* Live CommentCount component per topic */}
                      <CommentCount
                        shortname="non-haze-activities"
                        config={{
                          url: topicArticle.url,
                          identifier: topicArticle.id,
                          title: topicArticle.title,
                        }}
                      >
                        Comments
                      </CommentCount>
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-medium text-amber-400">Active</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Embed Config Drawer (Language & SSO) */}
        {showConfigDrawer && (
          <div className="mt-6 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                Disqus Embed Configuration & SSO Settings
              </h3>
              <button
                onClick={() => setShowConfigDrawer(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Language selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'zh_TW')}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                >
                  <option value="en">English (en)</option>
                  <option value="zh_TW">繁體中文 Traditional Chinese (zh_TW)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Switches the Disqus widget interface language.
                </p>
              </div>

              {/* Single Sign-On (SSO) Toggle */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Single Sign-On (SSO)
                </label>
                <button
                  type="button"
                  onClick={() => setEnableSSO(!enableSSO)}
                  className={`w-full py-2 px-3 rounded-lg font-semibold text-xs border text-left flex items-center justify-between ${
                    enableSSO
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{enableSSO ? 'SSO Enabled' : 'SSO Disabled'}</span>
                  <span className="text-[10px] opacity-80">{enableSSO ? 'ON' : 'OFF'}</span>
                </button>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enables Disqus Single Sign-On integration payload.
                </p>
              </div>

              {/* Current Shortname */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Disqus Shortname
                </label>
                <input
                  type="text"
                  readOnly
                  value="non-haze-activities"
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 text-xs cursor-not-allowed font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Official registered shortname for Non-Haze Activities.
                </p>
              </div>
            </div>

            {enableSSO && (
              <div className="pt-3 border-t border-slate-200 text-xs space-y-3">
                <span className="font-semibold text-slate-700 block">
                  SSO Custom Configuration Parameters
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Site / Brand Name</label>
                    <input
                      type="text"
                      value={ssoConfig.name}
                      onChange={(e) => setSsoConfig({ ...ssoConfig, name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Login URL</label>
                    <input
                      type="text"
                      value={ssoConfig.url}
                      onChange={(e) => setSsoConfig({ ...ssoConfig, url: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Remote Auth S3 (Optional)</label>
                    <input
                      type="text"
                      placeholder="HMAC SHA1 message"
                      value={ssoConfig.remoteAuthS3}
                      onChange={(e) => setSsoConfig({ ...ssoConfig, remoteAuthS3: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Disqus Public API Key</label>
                    <input
                      type="text"
                      placeholder="Public API Key"
                      value={ssoConfig.apiKey}
                      onChange={(e) => setSsoConfig({ ...ssoConfig, apiKey: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Forum Discussion Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Active Thread Banner with CommentCount */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {currentTopic.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">
                ID: {currentTopic.id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {currentTopic.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {currentTopic.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {/* Active Thread CommentCount Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <CommentCount
                shortname="non-haze-activities"
                config={{
                  url: currentArticle.url,
                  identifier: currentArticle.id,
                  title: currentArticle.title,
                }}
              >
                Comments
              </CommentCount>
            </div>
          </div>
        </div>

        {/* Embedded Disqus Discussion */}
        <div className="min-h-[450px] relative">
          <DiscussionEmbed
            key={`${currentTopic.id}-${selectedLanguage}-${enableSSO}`}
            shortname="non-haze-activities"
            config={disqusConfig}
          />

          {/* Helpful Tips / Fallback Note */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                If comments do not load immediately, please allow third-party widgets or check your adblocker settings.
              </span>
            </div>
            <a
              href={`https://disqus.com/home/forums/non-haze-activities/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-blue-600 transition-colors shrink-0"
            >
              <span>View discussion on Disqus.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
