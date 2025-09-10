import React from 'react';

const Dashboard: React.FC = () => {

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  return (
    <div className="space-y-12">
      {/* Mission/Vision Hero Section */}
      <div className="text-center py-12 bg-sky-600 text-white rounded-2xl shadow-xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Offerte di lavoro ridicole? È ora di farsi sentire.</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-sky-100">
          Lavoro onesto è la piattaforma per denunciare anonimamente le offerte di lavoro e le esperienze lavorative inique in Italia.
          La tua voce conta.
        </p>
      </div>

       {/* Call to Action Section */}
       <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Ti hanno proposto un lavoro malpagato o condizioni inaccettabili?</h2>
            <p className="mt-2 text-slate-600">Non rimanere in silenzio. Condividi la tua esperienza per aiutare la community e creare consapevolezza.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                    href="#/segnala"
                    onClick={(e) => handleNav(e, '#/segnala')}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors shadow-lg font-semibold text-lg animate-pulse"
                >
                    <i className="fa-solid fa-bullhorn"></i>
                    <span>Segnala Ora</span>
                </a>
                 <a 
                    href="#/segnalazioni"
                    onClick={(e) => handleNav(e, '#/segnalazioni')}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors shadow-lg font-semibold text-lg"
                >
                    <i className="fa-solid fa-list-ul"></i>
                    <span>Vedi le Segnalazioni</span>
                </a>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;