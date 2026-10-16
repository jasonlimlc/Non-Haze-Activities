import React, { useMemo } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { MessageSquare, Users, Sparkles, Shield, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TalkToUs: React.FC = () => {
  const { language, t } = useApp();

  // Map app languages to Disqus language codes
  const disqusLang = useMemo(() => {
    switch (language) {
      case 'zh':
        return 'zh_TW';
      case 'ja':
        return 'ja';
      case 'ko':
        return 'ko';
      case 'th':
        return 'th';
      case 'vi':
        return 'vi';
      case 'en':
      default:
        return 'en';
    }
  }, [language]);

  const article = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sgitinerary.app';
    return {
      url: `${origin}/talk-to-us`,
      id: 'captainhaze-tourist-community-discussion',
      title: 'SG itinerary - Tourist Community Discussion & Live Forum',
    };
  }, []);

  const disqusConfig = useMemo(() => ({
    url: article.url,
    identifier: article.id,
    title: article.title,
    language: disqusLang,
  }), [article, disqusLang]);

  return (
    <div className="w-full space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <section className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-md text-slate-900 dark:text-white transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('tabTalk')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('talkToUsTitle')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              {t('talkToUsDesc')}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-500" />
              <CommentCount shortname="captainhaze" config={disqusConfig}>
                {t('comments')}
              </CommentCount>
            </div>
          </div>
        </div>

        {/* Community Guidelines Strip */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
            <HeartHandshake className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white">{t('travelerSupport')}</strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Share tips on covered routes and air-conditioned spots.</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white">{t('verifiedInfo')}</strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Keep discussions respectful and grounded in NEA facts.</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white">{t('liveFeedback')}</strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Request new attractions or report pharmacy mask stock.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Disqus Discussion Embed Container */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
        <div className="min-h-[350px]">
          <DiscussionEmbed
            shortname="captainhaze"
            config={disqusConfig}
          />
        </div>
      </section>
    </div>
  );
};
