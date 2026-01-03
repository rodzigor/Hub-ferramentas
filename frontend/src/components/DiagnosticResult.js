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
const DiagnosticResult = ({ errorData, onNewAnalysis, onBack, user, onOpenProfile }) => {
  const [copied, setCopied] = useState(false);

  // Sample data - this would come from AI processing
  const diagnosticData = {
    logId: '#8291-A',
    timestamp: '24/10/2023 14:30',
    framework: 'Next.js 14',
    severity: 'Média',
    tokensUsed: 420,
    processingTime: '1.2s',
    rootCause: 'Hydration Mismatch',
    rootCauseDescription: 'O erro ocorre porque o HTML gerado no servidor (SSR) difere do HTML gerado no navegador. Isso é comum ao usar dados como datas, números aleatórios ou acessar `window` diretamente no corpo do componente.',
    solution: 'O prompt gerado instrui a IA a mover a lógica não-determinística para um `useEffect`, garantindo que o servidor e o cliente inicial renderizem o mesmo conteúdo base.',
    prompt: `# Contexto e Objetivo
Você é um desenvolvedor expert em React/Next.js. Estou encontrando um erro "Hydration failed because the initial UI does not match what was rendered on the server".

# Instruções de Correção
Por favor, corrija este problema garantindo renderização determinística.
1. Verifique usos de \`window\` ou \`localStorage\` durante a renderização inicial.
2. Implemente um hook \`useEffect\` para lidar com dados apenas do lado do cliente ou use \`dynamic import\` com ssr: false.
3. Verifique se valores aleatórios (Math.random, UUIDs) são gerados dentro de useEffect ou useState, não no corpo do componente.

# Código Problemático Detectado
O componente <DashboardHeader /> parece renderizar um timestamp \`new Date().toISOString()\` diretamente no JSX, causando a incompatibilidade.

# Formato de Saída Esperado
Forneça o bloco de código corrigido apenas para DashboardHeader.tsx. Não explique a teoria, apenas corrija o código.`,
    relatedAnalyses: [
      {
        id: 1,
        type: 'error',
        title: 'TypeError: Cannot read properties of un...',
        time: 'Há 2 horas'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Warning: Missing key prop in list',
        time: 'Ontem'
      }
    ]
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

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header - Same as Dashboard */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-6xl mx-auto">
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">O Prompt Perfeito</h3>
                    <p className="text-white/50 text-sm">Pronto para copiar e colar no Lasy/Lovable</p>
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
              <div className="bg-[#0d1117] p-4 font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
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
            <div className="bg-[#161b22] border border-white/10 rounded-xl p-5">
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
            <div className="bg-[#161b22] border border-white/10 rounded-xl p-5">
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
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span className="text-yellow-400">{diagnosticData.severity}</span>
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

            {/* Análises Relacionadas */}
            <div className="bg-[#161b22] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Análises Relacionadas</h3>
                <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">Ver tudo</button>
              </div>
              <div className="space-y-3">
                {diagnosticData.relatedAnalyses.map((analysis) => (
                  <div 
                    key={analysis.id}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      analysis.type === 'error' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                    }`}>
                      {analysis.type === 'error' 
                        ? <AlertCircle className="w-4 h-4 text-red-400" />
                        : <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{analysis.title}</p>
                      <p className="text-white/40 text-xs">{analysis.time}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiagnosticResult;
