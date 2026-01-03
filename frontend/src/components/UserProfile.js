import { useState } from 'react';
import { 
  ArrowLeft,
  Settings,
  User,
  Mail,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  Camera,
  Check,
  Moon,
  Sun,
  Globe,
  Key,
  Trash2,
  ChevronRight,
  Zap,
  History,
  Award
} from 'lucide-react';

const UserProfile = ({ user, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true
  });
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('pt-BR');

  // Mock user stats
  const userStats = {
    totalAnalyses: 127,
    savedPrompts: 45,
    tokensUsed: 15420,
    memberSince: 'Outubro 2023'
  };

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'assinatura', label: 'Assinatura', icon: CreditCard },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full border-4 border-purple-500/30"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full hover:bg-purple-500 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.name || 'Usuário'}</h2>
                <p className="text-white/60">Membro desde {userStats.memberSince}</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userStats.totalAnalyses}</p>
                <p className="text-white/50 text-sm">Análises</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <History className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userStats.savedPrompts}</p>
                <p className="text-white/50 text-sm">Prompts Salvos</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userStats.tokensUsed.toLocaleString()}</p>
                <p className="text-white/50 text-sm">Tokens Usados</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Nome Completo</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="rodzigor@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Idioma Preferido</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                >
                  <option value="pt-BR" className="bg-[#161b22]">Português (Brasil)</option>
                  <option value="en-US" className="bg-[#161b22]">English (US)</option>
                  <option value="es" className="bg-[#161b22]">Español</option>
                </select>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                <div>
                  <p className="text-white font-medium">Modo Escuro</p>
                  <p className="text-white/50 text-sm">Alternar tema da interface</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-white/20'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Save Button */}
            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Salvar Alterações
            </button>
          </div>
        );

      case 'notificacoes':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Preferências de Notificação</h3>
            
            {[
              { key: 'email', label: 'Notificações por Email', desc: 'Receber atualizações importantes por email' },
              { key: 'push', label: 'Notificações Push', desc: 'Receber alertas em tempo real no navegador' },
              { key: 'updates', label: 'Novidades e Atualizações', desc: 'Ser informado sobre novas funcionalidades' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications[item.key] ? 'bg-purple-600' : 'bg-white/20'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'seguranca':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Segurança da Conta</h3>
            
            <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <p className="text-white font-medium">Alterar Senha</p>
                  <p className="text-white/50 text-sm">Última alteração: há 30 dias</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <div className="text-left">
                  <p className="text-white font-medium">Autenticação em Duas Etapas</p>
                  <p className="text-white/50 text-sm">Adicione uma camada extra de segurança</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Ativo</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <p className="text-white font-medium">Sessões Ativas</p>
                  <p className="text-white/50 text-sm">Gerenciar dispositivos conectados</p>
                </div>
              </div>
              <span className="text-white/60 text-sm">2 dispositivos</span>
            </button>

            <div className="pt-4 border-t border-white/10">
              <button className="w-full flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <div className="text-left">
                    <p className="text-red-400 font-medium">Excluir Conta</p>
                    <p className="text-red-400/60 text-sm">Esta ação é irreversível</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400/40" />
              </button>
            </div>
          </div>
        );

      case 'assinatura':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">PRO</span>
                  <h3 className="text-2xl font-bold text-white mt-2">Plano Profissional</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">R$49</p>
                  <p className="text-white/60 text-sm">/mês</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {[
                  'Análises ilimitadas',
                  '50.000 tokens/mês',
                  'Histórico completo',
                  'Suporte prioritário'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-white/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-sm">Próxima cobrança: 15 de Novembro, 2023</p>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">Método de Pagamento</p>
                    <p className="text-white/50 text-sm">•••• •••• •••• 4242</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">Histórico de Faturas</p>
                    <p className="text-white/50 text-sm">Ver todas as faturas</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>

              <button className="w-full py-3 border border-white/20 text-white/80 hover:bg-white/5 rounded-lg transition-colors">
                Alterar Plano
              </button>

              <button className="w-full py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                Cancelar Assinatura
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </button>
          <h1 className="text-xl font-semibold text-white">Meu Perfil</h1>
        </div>
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Settings className="w-6 h-6 text-white/60" />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
              
              <div className="pt-4 border-t border-white/10 mt-4">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair da Conta</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="md:col-span-3 bg-[#161b22] border border-white/10 rounded-xl p-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
