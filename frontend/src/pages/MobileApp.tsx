import { useState } from 'react';
import {
  ShieldCheck,
  Watch,
  QrCode,
  History,
  AlertTriangle,
  Plus,
  User,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  MapPin,
  ChevronRight,
  FileText,
  Smartphone,
  Bell,
  TrendingUp,
  Activity,
  Shield,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';
import {
  MOCK_WATCHES,
  getMockWatchHistory,
  MOCK_NOTIFICATIONS,
  MOCK_MARKET_TRENDS,
  MOCK_ACTIVITY_FEED,
  MOCK_PORTFOLIO_STATS,
  MOCK_INSURANCE_POLICIES,
  MOCK_CERTIFICATIONS,
  MOCK_SERVICE_REMINDERS,
  MOCK_AUCTION_RESULTS
} from '../lib/mockData';

// Main Mobile App Component
export const MobileApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedWatch, setSelectedWatch] = useState<any>(null);
  const [watches, setWatches] = useState(MOCK_WATCHES);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const goToPassport = (watch: any) => {
    setSelectedWatch(watch);
    setCurrentView('passport');
  };

  const handleStolenDeclaration = () => {
    const updatedWatches = watches.map(w =>
      w.id === selectedWatch.id ? { ...w, status: 'stolen' } : w
    );
    setWatches(updatedWatches);
    setSelectedWatch({ ...selectedWatch, status: 'stolen' });
  };

  const goToAddWatch = () => {
    setCurrentView('addWatch');
  };

  const goToScanQR = () => {
    setCurrentView('scanQR');
  };

  const goToBrandDetails = (brand: string) => {
    setSelectedBrand(brand);
    setCurrentView('brandDetails');
  };

  const goToCertificate = (watch: any) => {
    setSelectedWatch(watch);
    setCurrentView('certificate');
  };

  const goToInsuranceDetails = (watch: any) => {
    setSelectedWatch(watch);
    setCurrentView('insuranceDetails');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-900">

      {/* Status Bar */}
      <StatusBar />

      {/* Header */}
      <Header
        view={currentView}
        onBack={() => {
            if (currentView === 'passport') setCurrentView('dashboard');
            else if (currentView === 'transfer') setCurrentView('passport');
            else if (currentView === 'stolen') setCurrentView('passport');
            else if (currentView === 'notifications') setCurrentView('dashboard');
            else if (currentView === 'insights') setCurrentView('dashboard');
            else if (currentView === 'addWatch') setCurrentView('dashboard');
            else if (currentView === 'scanQR') setCurrentView('dashboard');
            else if (currentView === 'brandDetails') setCurrentView('insights');
            else if (currentView === 'certificate') setCurrentView('passport');
            else if (currentView === 'insuranceDetails') setCurrentView('passport');
            else setCurrentView('dashboard');
          }}
        onNotifications={() => setCurrentView('notifications')}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-24 bg-[#F8F9FA]">

          {currentView === 'dashboard' && (
            <DashboardView
              watches={watches}
              onSelectWatch={goToPassport}
              onAddWatch={goToAddWatch}
              onScanQR={goToScanQR}
            />
          )}

          {currentView === 'passport' && selectedWatch && (
            <PassportView
              watch={selectedWatch}
              onTransfer={() => setCurrentView('transfer')}
              onReportStolen={() => setCurrentView('stolen')}
              onViewCertificate={() => goToCertificate(selectedWatch)}
              onViewInsurance={() => goToInsuranceDetails(selectedWatch)}
            />
          )}

          {currentView === 'transfer' && selectedWatch && (
            <TransferView watch={selectedWatch} />
          )}

          {currentView === 'stolen' && selectedWatch && (
            <StolenDeclarationView
              watch={selectedWatch}
              onConfirm={() => {
                handleStolenDeclaration();
                setCurrentView('passport');
              }}
            />
          )}

          {currentView === 'notifications' && (
            <NotificationsView onSelectWatch={goToPassport} />
          )}

          {currentView === 'insights' && (
            <InsightsView onSelectBrand={goToBrandDetails} />
          )}

          {currentView === 'addWatch' && (
            <AddWatchView onComplete={() => setCurrentView('dashboard')} />
          )}

          {currentView === 'scanQR' && (
            <ScanQRView />
          )}

          {currentView === 'brandDetails' && selectedBrand && (
            <BrandDetailsView brand={selectedBrand} />
          )}

          {currentView === 'certificate' && selectedWatch && (
            <CertificateView watch={selectedWatch} />
          )}

          {currentView === 'insuranceDetails' && selectedWatch && (
            <InsuranceDetailsView watch={selectedWatch} />
          )}

      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={currentView} onNavigate={setCurrentView} onScanQR={goToScanQR} />

    </div>
  );
};

// Dashboard View
const DashboardView = ({ watches, onSelectWatch, onAddWatch, onScanQR }: any) => {
  const totalValue = watches.reduce((acc: number, curr: any) =>
    acc + (curr.status !== 'stolen' ? curr.estimatedValue : 0), 0
  );

  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
  const upcomingReminders = MOCK_SERVICE_REMINDERS.filter(r => !r.dismissed && new Date(r.dueDate) > new Date()).length;

  return (
    <div className="px-6 pt-2 animate-fadeIn">

      {/* Net Worth Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
        <div className="relative z-10">
          <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Valeur Portefeuille</span>
          <div className="flex items-baseline gap-1 mt-1">
            <h1 className="text-4xl font-bold text-slate-900">€{totalValue.toLocaleString()}</h1>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +{MOCK_PORTFOLIO_STATS.appreciationPercentage.toFixed(1)}%
            </span>
            <span className="text-slate-400 text-xs">€{MOCK_PORTFOLIO_STATS.totalAppreciation.toLocaleString()} de plus-value</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-100">
          <div className="text-slate-400 text-xs mb-1">Montres</div>
          <div className="text-2xl font-bold text-slate-900">{MOCK_PORTFOLIO_STATS.numberOfWatches}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100">
          <div className="text-slate-400 text-xs mb-1">Valeur moy.</div>
          <div className="text-2xl font-bold text-slate-900">€{Math.round(MOCK_PORTFOLIO_STATS.averageWatchValue / 1000)}K</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={onAddWatch}
          className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">Ajouter une montre</span>
        </button>
        <button
          onClick={onScanQR}
          className="bg-white text-slate-900 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Scanner QR</span>
        </button>
      </div>

      {/* Activity Feed */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Activité récente
        </h3>
        <div className="space-y-2">
          {MOCK_ACTIVITY_FEED.slice(0, 3).map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl p-3 border border-slate-100 flex items-center gap-3">
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900">{activity.title}</div>
                <div className="text-xs text-slate-500 truncate">{activity.description}</div>
              </div>
              <div className="text-xs text-slate-400">{new Date(activity.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Tendances du marché
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(MOCK_MARKET_TRENDS).slice(0, 4).map(([brand, data]: any) => (
            <div key={brand} className="bg-white rounded-xl p-3 border border-slate-100">
              <div className="text-xs text-slate-500 mb-1 capitalize">{brand === 'patekPhilippe' ? 'Patek Philippe' : brand === 'audemarsPiguet' ? 'AP' : brand === 'tagHeuer' ? 'TAG' : brand}</div>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-bold ${data.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {data.change > 0 ? '+' : ''}{data.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watch List */}
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-slate-900">Ma Collection</h2>
      </div>

      <div className="space-y-4 pb-4">
        {watches.map((watch: any) => (
          <div
            key={watch.id}
            onClick={() => onSelectWatch(watch)}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
              {watch.status === 'stolen' && (
                <div className="absolute inset-0 bg-red-500/20 z-10 flex items-center justify-center backdrop-blur-[1px]">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
              )}
              <Watch className="w-10 h-10 text-slate-300" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 truncate">{watch.model}</h3>
                {watch.status === 'stolen' ? (
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">VOLÉE</span>
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50" />
                )}
              </div>
              <p className="text-xs text-slate-500">{watch.brand} • {watch.yearOfProduction}</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">€{watch.estimatedValue.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Passport View
const PassportView = ({ watch, onTransfer, onReportStolen, onViewCertificate, onViewInsurance }: any) => {
  const isStolen = watch.status === 'stolen';
  const history = getMockWatchHistory(watch.id);
  const insurance = MOCK_INSURANCE_POLICIES.find(p => p.watchId === watch.id);
  const certification = MOCK_CERTIFICATIONS.find(c => c.watchId === watch.id);

  return (
    <div className="animate-slideUp">
      {/* Watch Hero */}
      <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-6 rounded-b-[40px] overflow-hidden">
        <Watch className="w-32 h-32 text-slate-300 drop-shadow-2xl" />

        <div className="absolute bottom-4 right-6 flex items-center gap-2 opacity-60">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Veritas Certified</span>
        </div>

        {isStolen && (
          <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="bg-white p-3 rounded-full shadow-xl mb-2">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 uppercase tracking-widest">Volée</h2>
            <p className="text-white font-medium text-sm bg-red-500 px-3 py-1 rounded-full mt-2">Blockchain Locked</p>
          </div>
        )}
      </div>

      <div className="px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{watch.brand}</h2>
          <p className="text-lg text-slate-600">{watch.model}</p>
          <div className="flex justify-center items-center gap-2 mt-2 flex-wrap">
            <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-xs font-mono">REF: {watch.referenceNumber}</span>
            <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-xs font-mono break-all max-w-[180px]">SN: {watch.serialNumber.substring(0, 15)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={onTransfer}
            disabled={isStolen}
            className={`flex-1 bg-slate-900 text-white py-3 rounded-xl font-medium shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 ${isStolen ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ArrowUpRight className="w-4 h-4" /> Transférer
          </button>
          <button
            onClick={onViewCertificate}
            className="flex-1 bg-white text-slate-900 border border-slate-200 py-3 rounded-xl font-medium shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Certificat
          </button>
        </div>

        {/* Insurance & Certification Info */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {insurance && (
            <button
              onClick={onViewInsurance}
              className="bg-blue-50 border border-blue-100 rounded-2xl p-3 active:scale-95 transition-transform text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-900">Assuré</span>
              </div>
              <div className="text-lg font-bold text-blue-900">€{insurance.coverageAmount.toLocaleString()}</div>
              <div className="text-xs text-blue-700 mt-1">{insurance.provider}</div>
            </button>
          )}
          {certification && (
            <button
              onClick={onViewCertificate}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 active:scale-95 transition-transform text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">Certifié</span>
              </div>
              <div className="text-lg font-bold text-emerald-900">{certification.conditionGrade}</div>
              <div className="text-xs text-emerald-700 mt-1">{certification.issuedBy}</div>
            </button>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-24">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <History className="w-4 h-4" /> Historique de vie
          </h3>

          <div className="relative border-l-2 border-slate-100 ml-2 space-y-6 pl-6">
            {history.map((item: any, index: number) => (
              <div key={index} className="relative">
                <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                  item.eventType === 'certification' ? 'bg-blue-500' :
                  item.eventType === 'service' ? 'bg-emerald-500' :
                  item.eventType === 'transfer' ? 'bg-purple-500' : 'bg-slate-400'
                }`}></div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">
                  {new Date(item.eventDate).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm font-bold text-slate-900">{item.description}</p>
                <p className="text-xs text-slate-500">{item.performedBy}</p>
              </div>
            ))}
          </div>

          {!isStolen && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={onReportStolen}
                className="w-full text-red-500 text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-50 py-3 rounded-xl transition-colors"
              >
                <AlertTriangle className="w-4 h-4" /> Déclarer perdue ou volée
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Transfer View
const TransferView = ({ watch }: any) => {
  return (
    <div className="px-6 pt-10 h-full flex flex-col items-center animate-fadeIn bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Transférer la propriété</h2>
        <p className="text-slate-500 text-sm mt-2">Demandez à l'acheteur de scanner ce code avec son application Veritas.</p>
      </div>

      <div className="relative w-64 h-64 bg-white p-4 rounded-2xl shadow-lg mb-8 animate-scaleIn">
        <QrCode className="w-full h-full text-slate-900" />
      </div>

      <div className="w-full max-w-xs bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3 animate-slideUp">
        <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">En attente du scan...</h4>
          <p className="text-xs text-blue-700 mt-1">Ce code est valide pour 2 minutes.</p>
        </div>
      </div>
    </div>
  );
};

// Stolen Declaration View
const StolenDeclarationView = ({ watch, onConfirm }: any) => {
  return (
    <div className="px-6 pt-6 h-full bg-white">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex gap-4 items-start">
        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="text-red-800 font-bold">Attention</h3>
          <p className="text-red-700 text-xs mt-1">Cette action est irréversible.</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6">Détails de l'incident</h2>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Date du vol</label>
          <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Numéro de PV (Police)</label>
          <input type="text" placeholder="ex: 2023/00192..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Lieu</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Paris, France" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm" />
          </div>
        </div>

        <div className="pt-8">
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all"
          >
            Confirmer le vol
          </button>
        </div>
      </form>
    </div>
  );
};

// Notifications View
const NotificationsView = ({ onSelectWatch }: any) => {
  return (
    <div className="px-6 pt-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Notifications</h2>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <button
            key={notif.id}
            className={`w-full bg-white rounded-2xl p-4 border border-slate-100 ${notif.read ? 'opacity-60' : ''} active:scale-95 transition-all text-left`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notif.type === 'reminder' ? 'bg-orange-50' :
                notif.type === 'valuation' ? 'bg-emerald-50' :
                'bg-blue-50'
              }`}>
                {notif.type === 'reminder' && <Calendar className="w-5 h-5 text-orange-600" />}
                {notif.type === 'valuation' && <TrendingUp className="w-5 h-5 text-emerald-600" />}
                {notif.type === 'document' && <FileText className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">{notif.title}</h3>
                  {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>}
                </div>
                <p className="text-xs text-slate-600">{notif.message}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Service Reminders */}
      <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">Rappels</h3>
      <div className="space-y-3">
        {MOCK_SERVICE_REMINDERS.filter(r => !r.dismissed).map((reminder) => (
          <div
            key={reminder.id}
            className={`bg-white rounded-2xl p-4 border ${
              reminder.urgency === 'high' ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <Calendar className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                reminder.urgency === 'high' ? 'text-orange-600' : 'text-slate-600'
              }`} />
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm mb-1">{reminder.title}</h4>
                <p className="text-xs text-slate-600 mb-2">{reminder.description}</p>
                <p className="text-xs text-slate-400">
                  Échéance: {new Date(reminder.dueDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Insights View
const InsightsView = ({ onSelectBrand }: any) => {
  return (
    <div className="px-6 pt-4 animate-fadeIn pb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Analyses</h2>

      {/* Portfolio Overview */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 mb-6 text-white">
        <h3 className="text-sm font-semibold opacity-80 mb-4">Vue d'ensemble</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs opacity-60 mb-1">Valeur totale</div>
            <div className="text-2xl font-bold">€{MOCK_PORTFOLIO_STATS.totalValue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs opacity-60 mb-1">Plus-value</div>
            <div className="text-2xl font-bold text-emerald-400">+{MOCK_PORTFOLIO_STATS.appreciationPercentage.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-xs opacity-60 mb-1">Montres</div>
            <div className="text-xl font-bold">{MOCK_PORTFOLIO_STATS.numberOfWatches}</div>
          </div>
          <div>
            <div className="text-xs opacity-60 mb-1">Valeur moy.</div>
            <div className="text-xl font-bold">€{Math.round(MOCK_PORTFOLIO_STATS.averageWatchValue).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Top Watch */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Montre la plus précieuse
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
            <Watch className="w-8 h-8 text-slate-300" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900">{MOCK_PORTFOLIO_STATS.mostValuableWatch.model}</div>
            <div className="text-xs text-slate-500">{MOCK_PORTFOLIO_STATS.mostValuableWatch.brand}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-900">€{MOCK_PORTFOLIO_STATS.mostValuableWatch.estimatedValue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Market Trends Full */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Tendances du marché
        </h3>
        <div className="space-y-3">
          {Object.entries(MOCK_MARKET_TRENDS).map(([brand, data]: any) => (
            <button
              key={brand}
              onClick={() => onSelectBrand(brand)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
            >
              <div className="text-left">
                <div className="text-sm font-medium text-slate-900 capitalize">
                  {brand === 'patekPhilippe' ? 'Patek Philippe' :
                   brand === 'audemarsPiguet' ? 'Audemars Piguet' :
                   brand === 'tagHeuer' ? 'TAG Heuer' : brand}
                </div>
                <div className="text-xs text-slate-500">Prix moy. €{data.avgPrice.toLocaleString()}</div>
              </div>
              <div className="text-right flex items-center gap-2">
                <div className={`text-lg font-bold ${data.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {data.change > 0 ? '+' : ''}{data.change}%
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Distribution */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Répartition par marque</h3>
        <div className="space-y-2">
          {Object.entries(MOCK_PORTFOLIO_STATS.brandDistribution).map(([brand, count]: any) => (
            <div key={brand} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-900">{brand}</div>
              </div>
              <div className="text-xs text-slate-500">{count} montre{count > 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add Watch View
const AddWatchView = ({ onComplete }: any) => {
  return (
    <div className="px-6 pt-4 animate-fadeIn pb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Ajouter une montre</h2>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onComplete(); }}>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Marque</label>
          <input type="text" placeholder="Rolex, Patek Philippe..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Modèle</label>
          <input type="text" placeholder="Submariner, Nautilus..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Numéro de série</label>
          <input type="text" placeholder="ABC-123-456..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Référence</label>
          <input type="text" placeholder="126610LN..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Année de production</label>
          <input type="number" placeholder="2023" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Valeur estimée (€)</label>
          <input type="number" placeholder="12500" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm" />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all"
          >
            Enregistrer la montre
          </button>
        </div>
      </form>
    </div>
  );
};

// Scan QR View
const ScanQRView = () => {
  return (
    <div className="px-6 pt-10 h-full flex flex-col items-center animate-fadeIn bg-slate-900">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Scanner un QR Code</h2>
        <p className="text-slate-300 text-sm mt-2">Positionnez le code QR dans le cadre</p>
      </div>

      <div className="relative w-72 h-72 mb-8">
        <div className="absolute inset-0 border-4 border-white/30 rounded-3xl"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white rounded-tl-3xl"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white rounded-bl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white rounded-br-3xl"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <QrCode className="w-32 h-32 text-white/20" />
        </div>
      </div>

      <div className="w-full max-w-xs bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
        <p className="text-white text-sm text-center">
          Scannez le code QR d'une montre pour voir son passeport ou accepter un transfert
        </p>
      </div>
    </div>
  );
};

// Brand Details View
const BrandDetailsView = ({ brand }: any) => {
  const brandData = MOCK_MARKET_TRENDS[brand as keyof typeof MOCK_MARKET_TRENDS];
  const brandName = brand === 'patekPhilippe' ? 'Patek Philippe' :
                    brand === 'audemarsPiguet' ? 'Audemars Piguet' :
                    brand === 'tagHeuer' ? 'TAG Heuer' :
                    brand.charAt(0).toUpperCase() + brand.slice(1);

  const auctionResults = MOCK_AUCTION_RESULTS.filter(a =>
    a.brand.toLowerCase().replace(/\s+/g, '') === brand.toLowerCase()
  );

  return (
    <div className="px-6 pt-4 animate-fadeIn pb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{brandName}</h2>
      <p className="text-slate-500 text-sm mb-6">Analyse de marché et tendances</p>

      {/* Trend Card */}
      <div className={`rounded-3xl p-6 mb-6 ${brandData.trend === 'up' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
        <div className="text-white">
          <div className="text-sm opacity-80 mb-2">Tendance 12 mois</div>
          <div className="text-5xl font-bold mb-2">{brandData.change > 0 ? '+' : ''}{brandData.change}%</div>
          <div className="text-sm opacity-90">Prix moyen: €{brandData.avgPrice.toLocaleString()}</div>
        </div>
      </div>

      {/* Auction Results */}
      {auctionResults.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Résultats d'enchères récentes</h3>
          <div className="space-y-3">
            {auctionResults.map((auction) => (
              <div key={auction.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{auction.model}</div>
                    <div className="text-xs text-slate-500">{auction.auctionHouse}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">€{auction.hammerPrice.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">{new Date(auction.auctionDate).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Estimation: €{auction.estimateLow.toLocaleString()} - €{auction.estimateHigh.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Stats */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Statistiques de marché</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Tendance</span>
            <span className={`text-sm font-bold ${brandData.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
              {brandData.trend === 'up' ? '📈 Hausse' : '📉 Baisse'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Prix moyen</span>
            <span className="text-sm font-bold text-slate-900">€{brandData.avgPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Variation annuelle</span>
            <span className={`text-sm font-bold ${brandData.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {brandData.change > 0 ? '+' : ''}{brandData.change}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Certificate View
const CertificateView = ({ watch }: any) => {
  const cert = MOCK_CERTIFICATIONS.find(c => c.watchId === watch.id);

  return (
    <div className="px-6 pt-4 animate-fadeIn pb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Certificat d'authenticité</h2>

      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 mb-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{watch.brand} {watch.model}</h3>
          <p className="text-sm text-slate-500">Certifié Authentique</p>
        </div>

        {cert && (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Numéro de certificat</span>
              <span className="text-sm font-mono font-bold text-slate-900">{cert.certificateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Émis par</span>
              <span className="text-sm font-bold text-slate-900">{cert.issuedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Date de certification</span>
              <span className="text-sm font-bold text-slate-900">
                {new Date(cert.certificationDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">État / Grade</span>
              <span className="text-sm font-bold text-emerald-600">{cert.conditionGrade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Valeur estimée</span>
              <span className="text-sm font-bold text-slate-900">€{cert.estimatedValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Expiration</span>
              <span className="text-sm font-bold text-slate-900">
                {new Date(cert.expiryDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
          <div className="text-xs text-slate-500 mb-2">Hash Blockchain</div>
          <div className="text-xs font-mono text-slate-900 break-all">{watch.blockchainHash}</div>
        </div>

        {cert && (
          <div className="mt-4">
            <div className="text-xs text-slate-500 mb-2">Notes</div>
            <p className="text-sm text-slate-700">{cert.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Insurance Details View
const InsuranceDetailsView = ({ watch }: any) => {
  const insurance = MOCK_INSURANCE_POLICIES.find(p => p.watchId === watch.id);

  if (!insurance) {
    return (
      <div className="px-6 pt-4 animate-fadeIn pb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Assurance</h2>
        <div className="bg-slate-50 rounded-3xl p-8 text-center">
          <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Aucune assurance enregistrée pour cette montre</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-4 animate-fadeIn pb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Détails de l'assurance</h2>

      {/* Policy Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8" />
          <div>
            <div className="text-sm opacity-80">Police d'assurance</div>
            <div className="text-xl font-bold">{insurance.provider}</div>
          </div>
        </div>
        <div className="text-3xl font-bold">€{insurance.coverageAmount.toLocaleString()}</div>
        <div className="text-sm opacity-90 mt-1">Couverture maximale</div>
      </div>

      {/* Policy Details */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Détails de la police</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Numéro de police</span>
            <span className="text-sm font-mono font-bold text-slate-900">{insurance.policyNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Prime annuelle</span>
            <span className="text-sm font-bold text-slate-900">€{insurance.premium}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Franchise</span>
            <span className="text-sm font-bold text-slate-900">€{insurance.deductible}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Fréquence de paiement</span>
            <span className="text-sm font-bold text-slate-900 capitalize">{insurance.paymentFrequency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Date de début</span>
            <span className="text-sm font-bold text-slate-900">
              {new Date(insurance.startDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Date de fin</span>
            <span className="text-sm font-bold text-slate-900">
              {new Date(insurance.endDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Renouvellement</span>
            <span className="text-sm font-bold text-slate-900">
              {new Date(insurance.renewalDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>

      {/* Coverage */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Couvertures incluses</h3>
        <div className="space-y-2">
          {insurance.coverage.map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-slate-700 capitalize">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// UI Components
const Header = ({ view, onBack, onNotifications }: any) => {
  const titles: any = {
    dashboard: 'Veritas',
    passport: 'Passeport',
    transfer: 'Transfert',
    stolen: 'Sécurité',
    notifications: 'Notifications',
    insights: 'Analyses',
    addWatch: 'Ajouter une montre',
    scanQR: 'Scanner QR',
    brandDetails: 'Détails marque',
    certificate: 'Certificat',
    insuranceDetails: 'Assurance',
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <header className="flex items-center justify-between px-6 py-4 z-20 bg-[#F8F9FA]/90 backdrop-blur-md sticky top-0">
      {view === 'dashboard' ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Veritas</span>
        </div>
      ) : (
        <button onClick={onBack} className="w-10 h-10 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-sm active:scale-95">
          <ChevronRight className="w-5 h-5 rotate-180 text-slate-600" />
        </button>
      )}

      <div className="flex-1 text-center font-bold text-slate-900">
        {view !== 'dashboard' && titles[view]}
      </div>

      <button
        onClick={onNotifications}
        className="w-10 h-10 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-sm relative active:scale-95 transition-transform"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">{unreadCount}</span>
          </div>
        )}
      </button>
    </header>
  );
};

const BottomNav = ({ activeTab, onNavigate, onScanQR }: any) => (
  <div className="fixed bottom-6 left-6 right-6 h-[72px] bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 flex items-center justify-around px-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-50">
    <button onClick={() => onNavigate('dashboard')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-slate-900' : 'text-slate-400'}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </svg>
      <span className="text-[10px] font-medium">Accueil</span>
    </button>
    <button
      onClick={onScanQR}
      className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center shadow-lg -mt-8 border-4 border-[#F8F9FA] cursor-pointer active:scale-95 transition-transform"
    >
      <QrCode className="w-6 h-6 text-white" />
    </button>
    <button onClick={() => onNavigate('insights')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'insights' ? 'text-slate-900' : 'text-slate-400'}`}>
      <BarChart3 className="w-6 h-6" />
      <span className="text-[10px] font-medium">Analyses</span>
    </button>
  </div>
);

const StatusBar = () => (
  <div className="flex justify-between px-6 pt-3 pb-1 text-xs font-medium text-slate-400">
    <span>09:41</span>
    <div className="flex gap-1.5 items-center">
      <div className="text-[10px]">100%</div>
    </div>
  </div>
);
