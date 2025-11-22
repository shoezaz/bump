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
  Smartphone
} from 'lucide-react';
import { MOCK_WATCHES, getMockWatchHistory } from '../lib/mockData';

// Main Mobile App Component
export const MobileApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedWatch, setSelectedWatch] = useState<any>(null);
  const [watches, setWatches] = useState(MOCK_WATCHES);

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
            else setCurrentView('dashboard');
          }}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-24 bg-[#F8F9FA]">

          {currentView === 'dashboard' && (
            <DashboardView watches={watches} onSelectWatch={goToPassport} />
          )}

          {currentView === 'passport' && selectedWatch && (
            <PassportView
              watch={selectedWatch}
              onTransfer={() => setCurrentView('transfer')}
              onReportStolen={() => setCurrentView('stolen')}
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

      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={currentView} onNavigate={setCurrentView} />

    </div>
  );
};

// Dashboard View
const DashboardView = ({ watches, onSelectWatch }: any) => {
  const totalValue = watches.reduce((acc: number, curr: any) =>
    acc + (curr.status !== 'stolen' ? curr.estimatedValue : 0), 0
  );

  return (
    <div className="px-6 pt-2 animate-fadeIn">

      {/* Net Worth Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
        <div className="relative z-10">
          <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Valeur Portefeuille</span>
          <div className="flex items-baseline gap-1 mt-1">
            <h1 className="text-4xl font-bold text-slate-900">€{totalValue.toLocaleString()}</h1>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12.4%
            </span>
            <span className="text-slate-400 text-xs">depuis l'achat</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-lg active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">Ajouter une montre</span>
        </button>
        <button className="bg-white text-slate-900 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Scanner QR</span>
        </button>
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
const PassportView = ({ watch, onTransfer, onReportStolen }: any) => {
  const isStolen = watch.status === 'stolen';
  const history = getMockWatchHistory(watch.id);

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
        <div className="flex gap-3 mb-8">
          <button
            onClick={onTransfer}
            disabled={isStolen}
            className={`flex-1 bg-slate-900 text-white py-3 rounded-xl font-medium shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 ${isStolen ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ArrowUpRight className="w-4 h-4" /> Transférer
          </button>
          <button className="flex-1 bg-white text-slate-900 border border-slate-200 py-3 rounded-xl font-medium shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Certificat
          </button>
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

// UI Components
const Header = ({ view, onBack }: any) => {
  const titles: any = {
    dashboard: 'Veritas',
    passport: 'Passeport',
    transfer: 'Transfert',
    stolen: 'Sécurité',
  };

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

      <div className="w-10 h-10 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-sm relative">
        <User className="w-5 h-5 text-slate-600" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
      </div>
    </header>
  );
};

const BottomNav = ({ activeTab, onNavigate }: any) => (
  <div className="fixed bottom-6 left-6 right-6 h-[72px] bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 flex items-center justify-around px-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] z-50">
    <button onClick={() => onNavigate('dashboard')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-slate-900' : 'text-slate-400'}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </svg>
      <span className="text-[10px] font-medium">Accueil</span>
    </button>
    <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center shadow-lg -mt-8 border-4 border-[#F8F9FA] cursor-pointer active:scale-95 transition-transform">
      <QrCode className="w-6 h-6 text-white" />
    </div>
    <button className="flex flex-col items-center gap-1 text-slate-400">
      <Watch className="w-6 h-6" />
      <span className="text-[10px] font-medium">Coffre</span>
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
