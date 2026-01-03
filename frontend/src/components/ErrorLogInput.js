import { useState } from 'react';
import { 
  Rocket, 
  Database, 
  Eye, 
  Droplet, 
  Plus, 
  Sparkles, 
  Settings,
  Clipboard,
  Info,
  ArrowLeft
} from 'lucide-react';
import { ShimmerButton } from "@/components/ui/shimmer-button";
import NeuralBackground from "@/components/NeuralBackground";

// Input Screen - One-Shot Fixes
const ErrorLogInput = ({ onGenerate, onBack, user, onOpenProfile }) => {
  const [errorLog, setErrorLog] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = [
    { id: 'deploy', label: 'Erro de Deploy', icon: Rocket },
    { id: 'database', label: 'Erro de Banco', icon: Database },
    { id: 'preview', label: 'Erro de Preview', icon: Eye },
    { id: 'hydration', label: 'Erro de Hydration', icon: Droplet },
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
      
      {/* Header - Same as Dashboard */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </button>
          {user && (
            <button onClick={onOpenProfile}>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer"
              />
            </button>
          )}
        </div>
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Settings className="w-6 h-6 text-white/60" />
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              One-Shot Fixes
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Cole seus logs de erro complexos abaixo para gerar prompts de correção simplificados e educativos instantaneamente.
          </p>
        </div>

        {/* Error Log Input Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
          {/* Input Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-mono text-sm">&lt;/&gt;</span>
              <span className="text-white/80 text-sm font-medium">ENTRADA DE LOG DE ERRO</span>
            </div>
            <button 
              onClick={handlePaste}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Clipboard className="w-4 h-4" />
              <span className="text-sm">Colar da Área de Transferência</span>
            </button>
          </div>
          
          {/* Text Area */}
          <textarea
            value={errorLog}
            onChange={(e) => setErrorLog(e.target.value)}
            placeholder={`// Cole seus logs de erro do Vercel, Console ou Supabase aqui...
ReferenceError: window is not defined
    at Page (./app/page.tsx:12:3)
...`}
            className="w-full h-64 bg-transparent text-white/90 font-mono text-sm p-4 resize-none focus:outline-none placeholder:text-white/30"
          />
          
          {/* Input Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Info className="w-4 h-4" />
              <span>Markdown suportado</span>
            </div>
            <span className="text-white/40 text-xs">{errorLog.length} caracteres</span>
          </div>
        </div>

        {/* Quick Context Tags */}
        <div className="mb-8">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-3">TAGS DE CONTEXTO RÁPIDO</p>
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
              <span className="text-sm">Adicionar tag</span>
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <ShimmerButton
            onClick={handleGenerate}
            disabled={!errorLog.trim()}
            shimmerColor="#a855f7"
            shimmerDuration="2.5s"
            className="gap-3 text-lg font-medium"
          >
            <Sparkles className="w-5 h-5" />
            <span>Gerar One-Shot Fix</span>
          </ShimmerButton>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6">
        <p className="text-white/40 text-sm">
          Lasy Assistant Hub v1.0 • <span className="text-green-400">Sistemas Operacionais</span>
        </p>
      </footer>
    </div>
  );
};

export default ErrorLogInput;
