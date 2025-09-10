
import React from 'react';

const Header: React.FC = () => {

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a 
            href="#/"
            onClick={(e) => handleNav(e, '#/')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="bg-sky-600 p-2 rounded-lg">
                <i className="fa-solid fa-balance-scale text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 hidden sm:block">Lavoro Onesto</h1>
          </a>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <a
              href="#/"
              onClick={(e) => handleNav(e, '#/')}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
            >
              Home
            </a>
             <a
              href="#/segnala"
              onClick={(e) => handleNav(e, '#/segnala')}
              className="px-3 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors shadow"
            >
              Segnala
            </a>
            <a
              href="#/risorse"
              onClick={(e) => handleNav(e, '#/risorse')}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
            >
              Risorse Utili
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;