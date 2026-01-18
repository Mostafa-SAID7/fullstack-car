import React from 'react';
import { Wrench, ShoppingCart, Tag, Settings, Users, MessageCircle, Image as ImageIcon, X, Upload } from 'lucide-react';
import type { AgentType } from '../../../types/ai-agent';

interface TestMessageFormProps {
  selectedAgent: AgentType;
  testMessage: string;
  context: Record<string, any>;
  images: string[];
  onAgentChange: (agent: AgentType) => void;
  onMessageChange: (message: string) => void;
  onContextChange: (context: Record<string, any>) => void;
  onImagesChange: (images: string[]) => void;
}

const agentOptions: Array<{ value: AgentType; label: string; icon: React.ReactNode; description: string }> = [
  {
    value: 'general',
    label: 'General Chat',
    icon: <MessageCircle className="w-5 h-5" />,
    description: 'General conversation and assistance'
  },
  {
    value: 'mechanic',
    label: 'Mechanic',
    icon: <Wrench className="w-5 h-5" />,
    description: 'Maintenance and diagnostics expert'
  },
  {
    value: 'buyer_guide',
    label: "Buyer's Guide",
    icon: <ShoppingCart className="w-5 h-5" />,
    description: 'Car buying assistance'
  },
  {
    value: 'seller_assistant',
    label: "Seller's Assistant",
    icon: <Tag className="w-5 h-5" />,
    description: 'Help with selling cars'
  },
  {
    value: 'modification_expert',
    label: 'Modification Expert',
    icon: <Settings className="w-5 h-5" />,
    description: 'Car modifications and upgrades'
  },
  {
    value: 'community_helper',
    label: 'Community Helper',
    icon: <Users className="w-5 h-5" />,
    description: 'Platform features and community'
  }
];

export const TestMessageForm: React.FC<TestMessageFormProps> = ({
  selectedAgent,
  testMessage,
  context,
  images,
  onAgentChange,
  onMessageChange,
  onContextChange,
  onImagesChange
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleContextChange = (key: string, value: string) => {
    onContextChange({
      ...context,
      [key]: value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        if (base64String) {
          onImagesChange([...images, base64String]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Test Configuration</h3>

        {/* Agent Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">Select Agent</label>
          <div className="grid grid-cols-1 gap-2">
            {agentOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAgentChange(option.value)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selectedAgent === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedAgent === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {option.icon}
                </div>
                <div className="flex-1 text-start">
                  <p className="text-sm font-medium text-card-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Test Message & Vision */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-card-foreground flex items-center justify-between">
          <span>Test Message</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Add Image (Vision)
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
        </label>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                <img
                  src={`data:image/jpeg;base64,${img}`}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={testMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Enter a test message for the agent..."
          className="w-full h-32 px-4 py-3 bg-muted border border-border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Context Configuration */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-card-foreground">Context (Optional)</label>
        <div className="space-y-2">
          <input
            type="text"
            value={context.user_id || ''}
            onChange={(e) => handleContextChange('user_id', e.target.value)}
            placeholder="User ID"
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={context.car_make || ''}
            onChange={(e) => handleContextChange('car_make', e.target.value)}
            placeholder="Car Make (e.g., Toyota)"
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={context.car_model || ''}
            onChange={(e) => handleContextChange('car_model', e.target.value)}
            placeholder="Car Model (e.g., Camry)"
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={context.car_year || ''}
            onChange={(e) => handleContextChange('car_year', e.target.value)}
            placeholder="Car Year (e.g., 2020)"
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};
