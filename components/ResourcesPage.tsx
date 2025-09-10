import React from 'react';

const ResourceCard = ({ icon, title, children }: { icon: string, title: string, children: React.ReactNode }) => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
            <div className="bg-sky-100 text-sky-600 rounded-full p-3 mr-4">
                <i className={`fa-solid ${icon} w-6 h-6 text-center leading-6`}></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <div className="text-slate-600 space-y-2 pl-1 sm:pl-16">
            {children}
        </div>
    </div>
);

const ResourcesPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <i className="fa-solid fa-book-open text-6xl text-sky-500 mb-4"></i>
                <h2 className="text-4xl font-extrabold text-slate-800">Risorse per i lavoratori</h2>
                <p className="mt-3 text-lg text-slate-500">Conosci i tuoi diritti e gli strumenti a tua disposizione.</p>
            </div>

            <div className="space-y-8">
                <ResourceCard icon="fa-file-contract" title="I tuoi diritti fondamentali">
                    <p>Ogni lavoratore possiede diritti inalienabili. Conoscerli è il primo passo per la loro tutela.</p>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                        <li><strong>Contratto di lavoro:</strong> Deve essere chiaro e specificare mansioni, livello, orario e retribuzione. Un contratto verbale è valido, ma di più difficile dimostrazione in sede legale.</li>
                        <li><strong>Orario di lavoro:</strong> La legge stabilisce limiti massimi (di norma 40 ore settimanali) e il diritto a pause, riposi giornalieri e settimanali.</li>
                        <li><strong>Ferie e permessi:</strong> Il lavoratore ha diritto a un periodo irrinunciabile di ferie retribuite ogni anno (minimo 4 settimane).</li>
                        <li><strong>Sicurezza sul lavoro:</strong> Il datore di lavoro ha l'obbligo di garantire un ambiente di lavoro sicuro, informando i lavoratori sui rischi specifici e fornendo i dispositivi di protezione individuale (DPI).</li>
                    </ul>
                </ResourceCard>

                <ResourceCard icon="fa-users" title="A chi rivolgersi">
                    <p>In caso di violazione dei propri diritti, esistono diverse entità a cui è possibile rivolgersi per ottenere assistenza e tutela.</p>
                     <ul className="mt-2 space-y-4">
                        <li>
                            <a href="https://www.ispettorato.gov.it/" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-sky-600 transition-colors block">
                                Ispettorato Nazionale del Lavoro (INL)
                            </a>
                            <p className="mt-1">Ente pubblico di vigilanza sul rispetto della legislazione in materia di lavoro. È competente per la segnalazione di irregolarità contrattuali, lavoro sommerso e violazioni della normativa sulla sicurezza.</p>
                        </li>
                        <li>
                            <strong className="text-slate-700 block">Sindacati di categoria (es. CGIL, CISL, UIL)</strong>
                             <p className="mt-1">Offrono tutela individuale e collettiva, consulenza legale e supporto nelle vertenze aziendali. È possibile trovare la sede territoriale di competenza sui siti ufficiali di 
                                <a href="https://www.cgil.it/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline mx-1">CGIL</a>,
                                <a href="https://www.cisl.it/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline mx-1">CISL</a> o
                                <a href="https://www.uil.it/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline ml-1">UIL</a>.
                            </p>
                        </li>
                         <li>
                            <strong className="text-slate-700 block">Patronati (es. INCA, ACLI, INAS)</strong>
                            <p className="mt-1">Forniscono assistenza gratuita per pratiche previdenziali e assistenziali, come domande di disoccupazione (NASpI), infortuni sul lavoro e malattie professionali. I principali patronati sono 
                                <a href="https://www.inca.it/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline mx-1">INCA CGIL</a>,
                                <a href="https://www.patronato.acli.it/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline mx-1">Patronato ACLI</a> e
                                <a href="https://www.inas.it/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline ml-1">INAS CISL</a>.
                            </p>
                        </li>
                    </ul>
                </ResourceCard>
                
                <ResourceCard icon="fa-camera" title="Come documentare abusi e irregolarità">
                    <p>Per far valere le proprie ragioni, le prove sono fondamentali. Ecco come raccoglierle in modo efficace:</p>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                        <li><strong>Conservare ogni documento:</strong> contratto, buste paga, email, messaggi e qualsiasi comunicazione scritta che dimostri le condizioni di lavoro.</li>
                        <li><strong>Tenere un diario dettagliato:</strong> annotare date, orari, eventi specifici, persone presenti e dialoghi intercorsi. La precisione è essenziale.</li>
                        <li><strong>Effettuare screenshot:</strong> catturare immagini di turni, comunicazioni digitali o qualsiasi prova che potrebbe essere rimossa o alterata.</li>
                        <li><strong>Cercare testimoni:</strong> se possibile, individuare colleghi fidati che possano confermare la versione dei fatti. La loro testimonianza può avere un valore significativo.</li>
                    </ul>
                </ResourceCard>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                    <h4 className="font-bold text-amber-900 flex items-center"><i className="fa-solid fa-shield-halved mr-2"></i> L'importanza della privacy</h4>
                    <p className="text-amber-800 mt-2">Quando si effettua una denuncia, è fondamentale proteggere la propria identità in caso di timore di ritorsioni. L'anonimato è un diritto e piattaforme come questa esistono per garantirlo. Condividere la propria esperienza contribuisce a rendere l'intera comunità di lavoratori più consapevole e forte.</p>
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;