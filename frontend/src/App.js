import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Zap, AlertTriangle, Clock, Sparkles, Star, Brain, Settings } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// MetricCard Component
const MetricCard = ({ icon: Icon, title, value, subtitle, colorClass, glowClass }) => {
  return (
    <div 
      data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className={`relative rounded-2xl p-5 ${colorClass} ${glowClass} transition-all duration-300 hover:scale-105`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium text-white/90">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="text-sm text-white/60">{subtitle}</span>
      </div>
    </div>
  );
};

// ToolCard Component
const ToolCard = ({ tool, onOpen }) => {
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'wand':
        return Sparkles;
      case 'star':
        return Star;
      case 'brain':
        return Brain;
      default:
        return Sparkles;
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'purple':
        return {
          card: 'bg-gradient-to-br from-purple-900/80 to-purple-950/90 border border-purple-500/30',
          glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
          icon: 'bg-gradient-to-br from-purple-500 to-purple-700',
          text: 'text-purple-400'
        };
      case 'red':
        return {
          card: 'bg-gradient-to-br from-red-900/80 to-red-950/90 border border-red-500/30',
          glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
          icon: 'bg-gradient-to-br from-red-500 to-red-700',
          text: 'text-red-400'
        };
      case 'blue':
        return {
          card: 'bg-gradient-to-br from-blue-900/80 to-blue-950/90 border border-blue-500/30',
          glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
          icon: 'bg-gradient-to-br from-blue-500 to-blue-700',
          text: 'text-blue-400'
        };
      default:
        return {
          card: 'bg-gradient-to-br from-gray-900/80 to-gray-950/90 border border-gray-500/30',
          glow: 'shadow-[0_0_30px_rgba(156,163,175,0.15)]',
          icon: 'bg-gradient-to-br from-gray-500 to-gray-700',
          text: 'text-gray-400'
        };
    }
  };

  const Icon = getIconComponent(tool.icon);
  const colors = getColorClasses(tool.color);

  return (
    <div 
      data-testid={`tool-card-${tool.id}`}
      className={`relative rounded-2xl p-5 ${colors.card} ${colors.glow} transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${colors.icon}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">{tool.name}</h3>
            {tool.available && (
              <span className="px-3 py-1 text-xs font-medium bg-green-500 text-white rounded-full">
                Disponível
              </span>
            )}
          </div>
          <p className="text-sm text-white/60 mb-4 leading-relaxed">
            {tool.description}
          </p>
          <button
            data-testid={`open-tool-${tool.id}`}
            onClick={() => onOpen(tool.id)}
            className="px-4 py-2 bg-white text-gray-900 font-medium rounded-lg text-sm hover:bg-gray-100 transition-colors"
          >
            Abrir Ferramenta
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [user, setUser] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, userRes, toolsRes] = await Promise.all([
          axios.get(`${API}/dashboard/metrics`),
          axios.get(`${API}/dashboard/user`),
          axios.get(`${API}/dashboard/tools`)
        ]);
        
        setMetrics(metricsRes.data);
        setUser(userRes.data);
        setTools(toolsRes.data);
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleOpenTool = async (toolId) => {
    try {
      await axios.post(`${API}/dashboard/tool/${toolId}/open`);
      alert(`Ferramenta aberta: ${toolId}`);
    } catch (e) {
      console.error("Error opening tool:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div data-testid="dashboard" className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {user && (
              <img
                data-testid="user-avatar"
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-white/10"
              />
            )}
          </div>
          <button 
            data-testid="settings-button"
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Settings className="w-6 h-6 text-white/60" />
          </button>
        </header>

        {/* Title Section */}
        <div className="mb-10">
          <h1 data-testid="dashboard-title" className="text-3xl sm:text-4xl font-bold text-white mb-2">
            AI Assistant Dashboard
          </h1>
          {user && (
            <>
              <p data-testid="welcome-message" className="text-xl text-white/90 mb-1">
                Bem-vindo, {user.name}
              </p>
              <p className="text-white/50">
                Escolha uma ferramenta para turbinar seu fluxo.
              </p>
            </>
          )}
        </div>

        {/* Key Metrics Section */}
        <section className="mb-10">
          <h2 data-testid="metrics-title" className="text-lg font-semibold text-white mb-4">
            Métricas Chave
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              icon={Zap}
              title="Análises"
              value={metrics?.analyses || 12}
              subtitle={`+${metrics?.analyses_today || 3} hoje`}
              colorClass="bg-gradient-to-br from-purple-900/60 to-purple-950/80 border border-purple-500/20"
              glowClass="shadow-[0_0_40px_rgba(168,85,247,0.15)]"
            />
            <MetricCard
              icon={AlertTriangle}
              title="Erros"
              value={metrics?.errors || 47}
              subtitle={`+${metrics?.errors_today || 8}`}
              colorClass="bg-gradient-to-br from-red-900/60 to-red-950/80 border border-red-500/20"
              glowClass="shadow-[0_0_40px_rgba(239,68,68,0.15)]"
            />
            <MetricCard
              icon={Clock}
              title="Tempo"
              value={`${metrics?.response_time || 1.2}s`}
              subtitle="Ponto"
              colorClass="bg-gradient-to-br from-teal-900/60 to-teal-950/80 border border-teal-500/20"
              glowClass="shadow-[0_0_40px_rgba(20,184,166,0.15)]"
            />
          </div>
        </section>

        {/* Available Tools Section */}
        <section>
          <h2 data-testid="tools-title" className="text-lg font-semibold text-white mb-4">
            Ferramentas Disponíveis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onOpen={handleOpenTool} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-white/40 text-sm">
            Feito com <span className="font-semibold text-white/60">Emergent</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
