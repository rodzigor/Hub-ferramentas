import { useState } from 'react';
import { 
  Settings, 
  Bookmark, 
  Plus, 
  Copy, 
  Check,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
  Pencil,
  ArrowLeft
} from 'lucide-react';
import NeuralBackground from "@/components/NeuralBackground";

// Diagnostic Result Screen
const DiagnosticResult = ({ analysisResult, onNewAnalysis, onBack, user, onOpenProfile }) => {
  const [copied, setCopied] = useState(false);

  // Use real data from API
  const diagnosticData = {
    logId: analysisResult?.log_id || '#0000-X',
    timestamp: analysisResult?.timestamp || new Date().toLocaleString('pt-BR'),
    framework: analysisResult?.framework || 'Não detectado',
    severity: analysisResult?.severity || 'Média',
    tokensUsed: analysisResult?.tokens_used || 0,
    processingTime: analysisResult?.processing_time || '0s',
    rootCause: analysisResult?.root_cause || 'Erro Desconhecido',
    rootCauseDescription: analysisResult?.root_cause_description || 'Não foi possível determinar a causa raiz.',
    solution: analysisResult?.solution || 'Não foi possível gerar uma solução.',
    prompt: analysisResult?.prompt || 'Não foi possível gerar o prompt.',
    relatedAnalyses: []
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(diagnosticData.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'alta':
        return { bg: 'bg-red-400', text: 'text-red-400' };
      case 'média':
        return { bg: 'bg-yellow-400', text: 'text-yellow-400' };
      case 'baixa':
        return { bg: 'bg-green-400', text: 'text-green-400' };
      default:
        return { bg: 'bg-yellow-400', text: 'text-yellow-400' };
    }
  };

  const severityColors = getSeverityColor(diagnosticData.severity);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Neural Network Animated Background */}
      <NeuralBackground />
      
      {/* Header - Same as Dashboard */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="Voltar"
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
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Badge and Title */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Diagnóstico Concluído
                </span>
                <span className="text-white/40 text-sm">Log ID: {diagnosticData.logId} • {diagnosticData.timestamp}</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Resultado do Diagnóstico</h1>
              <p className="text-white/60">
                Analisamos o log de erro e geramos um prompt otimizado para correção imediata (One-Shot Fix).
              </p>
            </div>

            {/* Prompt Card */}
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">O Prompt Perfeito</h3>
                    <p className="text-white/50 text-sm">Pronto para copiar e colar no Lovable</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar Prompt'}
                </button>
              </div>

              {/* Code Block */}
              <div className="bg-[#0d1117]/80 p-4 font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
                <pre className="text-white/90 whitespace-pre-wrap">
                  {diagnosticData.prompt.split('\n').map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="text-white/30 w-8 flex-shrink-0 select-none">{idx + 1}</span>
                      <span className={
                        line.startsWith('#') 
                          ? 'text-green-400 italic' 
                          : line.includes('`') 
                            ? 'text-white/90' 
                            : 'text-white/70'
                      }>
                        {line.split('`').map((part, i) => 
                          i % 2 === 1 
                            ? <code key={i} className="text-cyan-400 bg-cyan-400/10 px-1 rounded">{part}</code>
                            : <span key={i}>{part}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-white/20 text-white/80 hover:bg-white/5 rounded-lg transition-colors">
                <Bookmark className="w-4 h-4" />
                Salvar no Histórico
              </button>
              <button 
                onClick={onNewAnalysis}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Nova Análise
              </button>
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Insight Educativo */}
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold">Insight Educativo</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">CAUSA RAIZ</p>
                  <h4 className="text-white text-xl font-bold mb-2">{diagnosticData.rootCause}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {diagnosticData.rootCauseDescription.split('`').map((part, i) => 
                      i % 2 === 1 
                        ? <code key={i} className="text-cyan-400 bg-cyan-400/10 px-1 rounded">{part}</code>
                        : <span key={i}>{part}</span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">A SOLUÇÃO</p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {diagnosticData.solution.split('`').map((part, i) => 
                      i % 2 === 1 
                        ? <code key={i} className="text-purple-400 bg-purple-400/10 px-1 rounded">{part}</code>
                        : <span key={i}>{part}</span>
                    )}
                  </p>
                </div>

                <button className="flex items-center gap-2 w-full justify-center py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors">
                  Ler Documentação Técnica
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metadados */}
            <div className="bg-[#161b22]/80 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">METADADOS DA ANÁLISE</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/40 text-xs mb-1">Framework Detectado</p>
                  <p className="text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    {diagnosticData.framework}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Gravidade</p>
                  <p className="text-white flex items-center gap-2">
                    <span className={`w-2 h-2 ${severityColors.bg} rounded-full`}></span>
                    <span className={severityColors.text}>{diagnosticData.severity}</span>
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Tokens Usados</p>
                  <p className="text-white">{diagnosticData.tokensUsed} tokens</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Tempo de Proc.</p>
                  <p className="text-white">{diagnosticData.processingTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiagnosticResult;
