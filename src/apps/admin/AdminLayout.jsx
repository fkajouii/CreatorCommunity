import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  Settings,
  PenTool,
  Compass,
  BarChart3,
  Target,
  Search,
  Plus,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../shared/AuthContext';

const AdminLayout = ({ children }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Discover', icon: Compass, path: '/admin/discover' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { name: 'Campaigns', icon: Target, path: '/admin/campaigns' },
    { name: 'Creators', icon: Users, path: '/admin/creators' },
    { name: 'Agreements', icon: FileText, path: '/admin/agreements' },
    { name: 'Payouts', icon: DollarSign, path: '/admin/payouts' },
    { name: 'Content', icon: PenTool, path: '/admin/content' },
  ];

  return (
    <div className="flex h-screen bg-pok-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-pok-blue">Pok Pok Admin</h1>
        </div>
        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-pok-yellow text-pok-dark" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search creators..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pok-blue sm:text-sm"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pok-blue hover:bg-pok-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pok-blue">
            <Plus className="mr-2 h-4 w-4" />
            Add Creator
          </button>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
