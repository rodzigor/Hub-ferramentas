import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { Zap, Star, Bookmark, Sparkles, Settings } from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";
import ErrorLogInput from "@/components/ErrorLogInput";
import DiagnosticResult from "@/components/DiagnosticResult";
import UserProfile from "@/components/UserProfile";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// MetricCard Component - Compact for mobile
const MetricCard = ({ icon: Icon, title, value, subtitle, colorClass, glowClass }) => {
  return (
    <div 
      data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-5 ${colorClass} ${glowClass} transition-all duration-300 hover:scale-105`}
    >
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm font-medium text-white/90">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl sm:text-4xl font-bold text-white">{value}</span>
        <span className="text-[10px] sm:text-sm text-white/60">{subtitle}</span>
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
  const navigate = useNavigate();
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
      // Navigate to the tool page
      if (toolId === 'tool-1') {
        navigate('/correcoes');
      }
    } catch (e) {
      console.error("Error opening tool:", e);
    }
  };

  const handleOpenProfile = () => {
    navigate('/perfil');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div data-testid="dashboard" className="min-h-screen relative overflow-hidden">
      {/* Neural Network Animated Background */}
      <NeuralBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {user && (
              <button onClick={handleOpenProfile}>
                <img
                  data-testid="user-avatar"
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer"
                />
              </button>
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
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <MetricCard
              icon={Zap}
              title="Correções"
              value={metrics?.corrections || 0}
              subtitle="One-Shot"
              colorClass="bg-gradient-to-br from-purple-900/60 to-purple-950/80 border border-purple-500/20"
              glowClass="shadow-[0_0_40px_rgba(168,85,247,0.15)]"
            />
            <MetricCard
              icon={Star}
              title="Designs"
              value={metrics?.designs || 0}
              subtitle="Criados"
              colorClass="bg-gradient-to-br from-red-900/60 to-red-950/80 border border-red-500/20"
              glowClass="shadow-[0_0_40px_rgba(239,68,68,0.15)]"
            />
            <MetricCard
              icon={Bookmark}
              title="Salvos"
              value={metrics?.saved || 0}
              subtitle="Histórico"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onOpen={handleOpenTool} />
            ))}
          </div>
        </section>

        {/* Spacer */}
        <div className="mt-8"></div>
      </div>
    </div>
  );
};

// Correções Tool Page
const CorrecoesPage = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('input'); // 'input', 'loading', or 'result'
  const [analysisResult, setAnalysisResult] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await axios.get(`${API}/dashboard/user`);
        setUser(userRes.data);
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    };
    fetchUser();
  }, []);

  const handleGenerate = async (data) => {
    setCurrentView('loading');
    setError(null);
    
    try {
      const response = await axios.post(`${API}/analyze-error`, {
        error_log: data.errorLog,
        tags: data.tags
      });
      
      setAnalysisResult(response.data);
      setCurrentView('result');
    } catch (e) {
      console.error("Error analyzing:", e);
      setError(e.response?.data?.detail || "Erro ao analisar. Tente novamente.");
      setCurrentView('input');
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
    setCurrentView('input');
  };

  const handleBack = () => {
    if (currentView === 'result') {
      setCurrentView('input');
    } else {
      navigate('/');
    }
  };

  const handleOpenProfile = () => {
    navigate('/perfil');
  };

  if (currentView === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Analisando erro...</p>
          <p className="text-white/50 mt-2">A IA está gerando o prompt perfeito</p>
        </div>
      </div>
    );
  }

  if (currentView === 'result' && analysisResult) {
    return (
      <DiagnosticResult 
        analysisResult={analysisResult} 
        onNewAnalysis={handleNewAnalysis}
        onBack={handleBack}
        user={user}
        onOpenProfile={handleOpenProfile}
      />
    );
  }

  return (
    <ErrorLogInput 
      onGenerate={handleGenerate}
      onBack={handleBack}
      user={user}
      onOpenProfile={handleOpenProfile}
      error={error}
    />
  );
};

// Profile Page
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await axios.get(`${API}/dashboard/user`);
        setUser(userRes.data);
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    };
    fetchUser();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleLogout = () => {
    // Implement logout logic
    alert('Você saiu da conta com sucesso!');
    navigate('/');
  };

  return (
    <UserProfile 
      user={user}
      onBack={handleBack}
      onLogout={handleLogout}
    />
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/correcoes" element={<CorrecoesPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
