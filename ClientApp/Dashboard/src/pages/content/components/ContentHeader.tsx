import { FileText } from 'lucide-react';

export const ContentHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-card/80 border border-border/50 p-6 md:p-8 shadow-xl">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-36 h-36 md:w-48 md:h-48 bg-cyan-500/5 rounded-full blur-xl md:blur-2xl -translate-y-18 md:-translate-y-24 -translate-x-18 md:-translate-x-24" />
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-teal-500/5 rounded-full blur-xl md:blur-xl translate-y-16 md:translate-y-20 translate-x-16 md:translate-x-20" />

      <div className="relative flex items-center gap-4 md:gap-6">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl">
          <FileText className="w-7 h-7 md:w-8 md:h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-1">
            Content Management
          </h1>
          <div className="w-20 h-1 md:w-24 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mb-3" />
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Monitor and moderate user-generated content with advanced analytics and real-time insights
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground font-medium">Content Moderation Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};