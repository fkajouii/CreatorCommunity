import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileCheck, 
  Video, 
  HelpCircle,
  LogOut,
  Bell
} from 'lucide-react';
import { cn } from '../../utils/cn';

const CreatorLayout = ({ children }) => {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Home', icon: Home, path: '/portal' },
    { name: 'Agreement', icon: FileCheck, path: '/portal/agreement' },
    { name: 'My Videos', icon: Video, path: '/portal/videos' },
    { name: 'Instructions', icon: HelpCircle, path: '/portal/instructions' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9E5]">
      {/* Mobile Top Bar */}
      <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-10 lg:hidden safe-top">
        <span className="text-xl font-black italic text-pok-blue tracking-tighter">Pok Pok</span>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400">
            <Bell className="h-6 w-6" />
          </button>
          <div className="w-8 h-8 rounded-full bg-pok-yellow" />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-72 bg-white flex-col border-r border-gray-100">
          <div className="p-8">
            <h1 className="text-3xl font-black text-pok-blue italic">Pok Pok</h1>
          </div>
          
          <nav className="flex-1 px-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/portal'}
                className={({ isActive }) => cn(
                  "flex items-center px-6 py-4 text-lg font-bold rounded-2xl transition-all duration-200",
                  isActive 
                    ? "bg-pok-yellow text-pok-dark translate-x-2" 
                    : "text-gray-500 hover:bg-yellow-50 hover:text-pok-dark"
                )}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-6">
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center w-full px-6 py-4 text-gray-500 font-bold hover:text-pok-red transition-colors"
            >
              <LogOut className="mr-4 h-6 w-6" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-12 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center sticky bottom-0 z-10">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/portal'}
            className={({ isActive }) => cn(
              "flex flex-col items-center p-2 rounded-xl transition-colors",
              isActive ? "text-pok-blue" : "text-gray-400"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] mt-1 font-bold">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default CreatorLayout;
