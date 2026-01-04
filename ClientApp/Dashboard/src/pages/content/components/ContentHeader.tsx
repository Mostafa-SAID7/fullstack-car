import { FileText } from 'lucide-react';

export const ContentHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8 shadow-lg">
      {/* Background decoration */}

      <div className="relative flex items-center gap-4 md:gap-6">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl">
          <FileText className="w-7 h-7 md:w-8 md:h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-1">
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