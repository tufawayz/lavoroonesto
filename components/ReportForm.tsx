import React, { useState } from 'react';
import { ExperienceReport, Sector, ReportType } from '../types';

interface ReportFormProps {
  onAddReport: (report: ExperienceReport) => Promise<void>;
  companies: string[];
  sectors: string[];
}

const EXPERIENCE_REPORT_TAGS: string[] = [
    "Mobbing",
    "Bossing",
    "Discriminazione",
    "Molestie",
    "Contratto non rispettato",
    "Contratto irregolare",
    "Lavoro in nero",
    "Stipendio basso",
    "Stipendio non pagato",
    "Straordinari non pagati",
    "Sicurezza sul lavoro",
    "Orari di lavoro massacranti",
    "Mancanza di formazione",
    "Pressioni psicologiche",
];

const UNKEPT_PROMISE_OPTIONS = [
    "RAL inferiore a quanto pattuito",
    "Ore straordinarie non pagate",
    "Mancato versamento dei contributi",
    "Inquadramento contrattuale non corretto",
    "Ferie non concesse o non pagate",
    "Formazione promessa ma mai erogata",
];


const ReportForm: React.FC<ReportFormProps> = ({ onAddReport, companies, sectors }) => {
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<Sector>('');
  const [customSector, setCustomSector] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [unkeptPromises, setUnkeptPromises] = useState<string[]>([]);
  const [customPromise, setCustomPromise] = useState('');
  const [showCustomPromiseInput, setShowCustomPromiseInput] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState('');
  const [showCustomTagsInput, setShowCustomTagsInput] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePromiseChange = (promise: string, isChecked: boolean) => {
    if (isChecked) {
        setUnkeptPromises(prev => [...prev, promise]);
    } else {
        setUnkeptPromises(prev => prev.filter(p => p !== promise));
    }
  };

  const handleTagChange = (tag: string, isChecked: boolean) => {
    if (isChecked) {
        setSelectedTags(prev => [...prev, tag]);
    } else {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    }
  };
  
  const handleCustomTagsCheck = (isChecked: boolean) => {
    setShowCustomTagsInput(isChecked);
    if (!isChecked) {
        setCustomTags('');
    }
  };

  const handleCustomPromiseCheck = (isChecked: boolean) => {
    setShowCustomPromiseInput(isChecked);
    if (!isChecked) {
        setCustomPromise('');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const finalSector = sector === 'Altro...' ? customSector.trim() : sector;

    if (!title || !companyName || !description || !finalSector) {
      setError('Tutti i campi contrassegnati con * sono obbligatori.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    const finalPromises = [...unkeptPromises];
    if (showCustomPromiseInput && customPromise.trim()) {
        finalPromises.push(customPromise.trim());
    }

    const customTagsArray = customTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const finalTags = Array.from(new Set([...selectedTags, ...customTagsArray]));

    const newReport: ExperienceReport = {
      id: crypto.randomUUID(),
      type: ReportType.Experience,
      title,
      companyName: companyName.trim(),
      sector: finalSector,
      description,
      isAnonymous,
      authorName: isAnonymous ? 'Anonimo' : authorName,
      createdAt: new Date(),
      supportCount: 0,
      tags: finalTags,
      unkeptPromises: finalPromises.length > 0 ? finalPromises : undefined,
    };

    try {
        await onAddReport(newReport);
    } catch (err) {
        // L'errore viene già mostrato da un alert in App.tsx
        // Il blocco `finally` gestirà lo stato di `isSubmitting`
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-800">Segnala la Tua Esperienza</h2>
        <p className="mt-3 text-lg text-slate-500">Descrivi un'esperienza lavorativa ingiusta. La tua voce può aiutare altri.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Titolo della Segnalazione *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Es. Mancato pagamento straordinari"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Nome Azienda *</label>
            <input
              type="text"
              id="companyName"
              list="company-list"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              placeholder="Inizia a scrivere il nome..."
            />
            <datalist id="company-list">
                {companies.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-slate-700 mb-1">Settore *</label>
            <select
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-white text-slate-800"
            >
              <option value="" disabled>Seleziona un settore</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="Altro...">Altro...</option>
            </select>
          </div>
        </div>

        {sector === 'Altro...' && (
            <div className="sm:col-start-2">
                <label htmlFor="customSector" className="block text-sm font-medium text-slate-700 mb-1">Specifica settore *</label>
                <input
                    type="text"
                    id="customSector"
                    value={customSector}
                    onChange={(e) => setCustomSector(e.target.value)}
                    className="w-full px-4 py-2 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    placeholder="Es. 'Animazione turistica'"
                />
            </div>
        )}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Descrizione Dettagliata *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Descrivi la situazione nel dettaglio. Includi informazioni su orari, stipendio, mansioni, e qualsiasi altra violazione."
          ></textarea>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h4 className="text-lg font-bold text-slate-800">Tag Principali</h4>
            <p className="text-sm text-slate-500 mb-4">Seleziona i tag che meglio descrivono la situazione.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {EXPERIENCE_REPORT_TAGS.map(tag => (
                     <div key={tag} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id={`tag-${tag}`}
                                name="tags"
                                type="checkbox"
                                onChange={(e) => handleTagChange(tag, e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor={`tag-${tag}`} className="font-medium text-slate-700">{tag}</label>
                        </div>
                    </div>
                ))}
                <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="tag-other"
                            name="tags-other"
                            type="checkbox"
                            onChange={(e) => handleCustomTagsCheck(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="tag-other" className="font-medium text-slate-700">Altro...</label>
                    </div>
                </div>
            </div>
            {showCustomTagsInput && (
                <div className="mt-4">
                    <label htmlFor="customTags" className="sr-only">Specifica altri tag</label>
                    <input
                        type="text"
                        id="customTags"
                        value={customTags}
                        onChange={e => setCustomTags(e.target.value)}
                        className="w-full px-4 py-2 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        placeholder="Aggiungi altri tag, separati da una virgola"
                    />
                </div>
            )}
        </div>
        
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h4 className="text-lg font-bold text-slate-800">Promesse non mantenute</h4>
            <p className="text-sm text-slate-500 mb-4">Seleziona una o più opzioni se applicabile.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {UNKEPT_PROMISE_OPTIONS.map(promise => (
                     <div key={promise} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id={promise}
                                name="unkept-promises"
                                type="checkbox"
                                onChange={(e) => handlePromiseChange(promise, e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor={promise} className="font-medium text-slate-700">{promise}</label>
                        </div>
                    </div>
                ))}
                 <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="other-promise"
                            name="unkept-promises"
                            type="checkbox"
                            onChange={(e) => handleCustomPromiseCheck(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="other-promise" className="font-medium text-slate-700">Altro...</label>
                    </div>
                </div>
            </div>
            {showCustomPromiseInput && (
                <div className="mt-4">
                    <label htmlFor="customPromise" className="sr-only">Specifica altro</label>
                    <input
                        type="text"
                        id="customPromise"
                        value={customPromise}
                        onChange={e => setCustomPromise(e.target.value)}
                        className="w-full px-4 py-2 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        placeholder="Specifica quale promessa non è stata mantenuta"
                    />
                </div>
            )}
        </div>


        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-800">Dati Personali</h4>
            <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                    <input
                        id="isAnonymous"
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="isAnonymous" className="font-medium text-slate-700">Voglio rimanere anonimo</label>
                    <p className="text-slate-500">Selezionando questa opzione, il tuo nome non sarà mostrato pubblicamente.</p>
                </div>
            </div>
            {!isAnonymous && (
                <div className="mt-4">
                    <label htmlFor="authorName" className="block text-sm font-medium text-slate-700 mb-1">Il tuo nome (opzionale)</label>
                    <input
                        type="text"
                        id="authorName"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full md:w-1/2 px-4 py-2 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        placeholder="Mario Rossi"
                    />
                </div>
            )}
        </div>
        
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex justify-center items-center space-x-3 px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 disabled:bg-slate-400 transition-colors shadow-lg"
          >
            {isSubmitting ? (
                <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Invio in corso...</span>
                </>
            ) : (
                <>
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Invia Segnalazione</span>
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;