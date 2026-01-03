import { useState } from 'react';
import { 
  Rocket, 
  Database, 
  Eye, 
  Droplet, 
  Plus, 
  Sparkles, 
  Clock, 
  Settings, 
  User,
  Clipboard,
  Info,
  ArrowLeft
} from 'lucide-react';

// Input Screen - Translate Logs to One-Shot Fixes
const ErrorLogInput = ({ onGenerate, onBack }) => {
  const [errorLog, setErrorLog] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = [
    { id: 'deploy', label: 'Deploy Error', icon: Rocket },
    { id: 'database', label: 'Database Error', icon: Database },
    { id: 'preview', label: 'Preview Error', icon: Eye },
    { id: 'hydration', label: 'Hydration Error', icon: Droplet },
  ];

  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setErrorLog(text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleGenerate = () => {
    if (errorLog.trim()) {
      onGenerate({ errorLog, tags: selectedTags });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-white font-medium">Lasy Assistant Hub</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
          <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full">
            Lasy
          </button>
          <button className="px-4 py-1.5 text-white/60 text-sm font-medium rounded-full hover:text-white transition-colors">
            Lovable
          </button>
        </div>
        
        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Clock className="w-5 h-5 text-white/60" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-white/60" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <User className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Translate Logs to </span>
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              One-Shot Fixes
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Paste your complex error logs below to generate simplified, educational fix prompts instantly.
          </p>
        </div>

        {/* Error Log Input Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
          {/* Input Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-mono text-sm">&lt;/&gt;</span>
              <span className="text-white/80 text-sm font-medium">ERROR LOG INPUT</span>
            </div>
            <button 
              onClick={handlePaste}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Clipboard className="w-4 h-4" />
              <span className="text-sm">Paste from Clipboard</span>
            </button>
          </div>
          
          {/* Text Area */}
          <textarea
            value={errorLog}
            onChange={(e) => setErrorLog(e.target.value)}
            placeholder={`// Paste your Vercel, Console, or Supabase error logs here...
ReferenceError: window is not defined
    at Page (./app/page.tsx:12:3)
...`}
            className="w-full h-64 bg-transparent text-white/90 font-mono text-sm p-4 resize-none focus:outline-none placeholder:text-white/30"
          />
          
          {/* Input Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Info className="w-4 h-4" />
              <span>Markdown supported</span>
            </div>
            <span className="text-white/40 text-xs">{errorLog.length} chars</span>
          </div>
        </div>

        {/* Quick Context Tags */}
        <div className="mb-8">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-3">QUICK CONTEXT TAGS</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const Icon = tag.icon;
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    isSelected 
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tag.label}</span>
                </button>
              );
            })}
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add tag</span>
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={!errorLog.trim()}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-2xl transition-all shadow-lg shadow-purple-500/20"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate One-Shot Fix</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6">
        <p className="text-white/40 text-sm">
          Lasy Assistant Hub v1.0 • <span className="text-green-400">Systems Operational</span>
        </p>
      </footer>
    </div>
  );
};

export default ErrorLogInput;
