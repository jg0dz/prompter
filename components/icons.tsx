import React from 'react';

export const KeyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 017.743-5.743z" />
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const ChevronUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

export const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l1.58-1.58a2.25 2.25 0 00-1.06-1.06l-1.58 1.58a2.25 2.25 0 102.12 2.12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.75l-4.5 4.5 1.061 1.061 4.5-4.5-1.06-1.06z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l8.25-8.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 13.5l3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 3.75l.75.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6l.75.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 8.25l.75.75" />
    </svg>
);

export const ExpandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
    </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const OpenAIIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-2.9022c-.1679-.6218-.426-1.204-.758-1.7346a5.9847 5.9847 0 0 0-2.8878-2.8878c-.5306-.332-1.1128-.59-1.7346-.758a5.9847 5.9847 0 0 0-2.9022-.5157A5.9847 5.9847 0 0 0 9.8211 1.718c-.6218.168-1.204.426-1.7346.758a5.9847 5.9847 0 0 0-2.8878 2.8878c-.332.5306-.59 1.1128-.758 1.7346a5.9847 5.9847 0 0 0-.5156 2.9022A5.9847 5.9847 0 0 0 1.718 13.4833c.168.6218.426 1.204.758 1.7346a5.9847 5.9847 0 0 0 2.8878 2.8878c.5306.332 1.1128.59 1.7346.758a5.9847 5.9847 0 0 0 2.9022.5156A5.9847 5.9847 0 0 0 13.4833 22.282c.6218-.168 1.204-.426 1.7346-.758a5.9847 5.9847 0 0 0 2.8878-2.8878c.332-.5306.59-1.1128.758-1.7346a5.9847 5.9847 0 0 0 .5157-2.9022A5.9847 5.9847 0 0 0 22.2819 9.8211Zm-4.6953 2.2275a.748.748 0 0 1-.2134.5207l-2.4064 2.4064a.748.748 0 0 1-.5207.2133.748.748 0 0 1-.5207-.2133.748.748 0 0 1-.2133-.5207V9.4533a.748.748 0 0 1 .2133-.5207.748.748 0 0 1 .5207-.2133.748.748 0 0 1 .5207.2133l2.4064 2.4064a.748.748 0 0 1 .2134.5207Zm-2.1488 4.848a.748.748 0 0 1-.5207.2134.748.748 0 0 1-.5207-.2134l-2.4064-2.4064a.748.748 0 0 1-.2133-.5207.748.748 0 0 1 .2133-.5207.748.748 0 0 1 .5207-.2133.748.748 0 0 1 .5207.2133l2.4064 2.4064a.748.748 0 0 1 .2133.5207.748.748 0 0 1-.2133.5207Zm-5.385-2.2274a.748.748 0 0 1-.2133.5207L5.3047 17.076a.748.748 0 0 1-.5207.2133.748.748 0 0 1-.5207-.2133.748.748 0 0 1-.2133-.5207V14.128a.748.748 0 0 1 .2133-.5207.748.748 0 0 1 .5207-.2133.748.748 0 0 1 .5207.2133l2.4064 2.4064a.748.748 0 0 1 .2133.5207Zm-2.4064-5.3725a.748.748 0 0 1-.5207.2133.748.748 0 0 1-.5207-.2133.748.748 0 0 1-.2133-.5207V6.923a.748.748 0 0 1 .2133-.5207A.748.748 0 0 1 4.784 6.189a.748.748 0 0 1 .5207.2133l2.4064 2.4064a.748.748 0 0 1 .2133.5207.748.748 0 0 1-.2133.5207Zm5.3725 2.2275a.748.748 0 0 1 .2133-.5207l2.4064-2.4064a.748.748 0 0 1 .5207-.2133.748.748 0 0 1 .5207.2133.748.748 0 0 1 .2133.5207v2.4064a.748.748 0 0 1-.2133.5207.748.748 0 0 1-.5207.2133.748.748 0 0 1-.5207-.2133L9.8211 9.4533a.748.748 0 0 1-.2133-.5207Zm2.4064 5.3725a.748.748 0 0 1 .5207-.2133.748.748 0 0 1 .5207.2133l2.4064 2.4064a.748.748 0 0 1 .2133.5207.748.748 0 0 1-.2133.5207.748.748 0 0 1-.5207.2133.748.748 0 0 1-.5207-.2133l-2.4064-2.4064a.748.748 0 0 1-.2133-.5207Z" />
    </svg>
);

export const GeminiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,1.75a8.75,8.75,0,0,0,0,17.5A8.75,8.75,0,0,0,12,1.75ZM12,21a10,10,0,1,1,10-10A10,10,0,0,1,12,21ZM16.09,14.53a.75.75,0,0,1-.54-.22L12,10.74l-3.55,3.57a.75.75,0,0,1-1.06-1.06L10.94,9.68a.75.75,0,0,1,1.06,0l4.09,4.09a.75.75,0,0,1-.5,1.26Z" />
    </svg>
);

export const OpenRouterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 12.5L12 13.25 8.5 14.5l1.22-3.83-3.22-2.17 4-.25 1.5-3.75 1.5 3.75 4 .25-3.22 2.17L15.5 14.5z" />
    </svg>
);

export const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);