
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Globe, 
  Share2, 
  Settings, 
  PlusCircle, 
  X, 
  Menu, 
  ChevronLeft
} from 'lucide-react';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mes contenus', path: '/dashboard/contents', icon: FileText },
    { name: 'Sites WordPress', path: '/dashboard/wordpress', icon: Globe },
    { name: 'Réseaux sociaux', path: '/dashboard/social', icon: Share2 },
    { name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-white shadow-md"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar for Desktop */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-all duration-300 bg-white border-r shadow-sm hidden md:block
        ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="h-full flex flex-col">
          <div className={`flex items-center justify-between h-16 px-4 border-b ${collapsed ? 'justify-center' : ''}`}>
            {!collapsed && (
              <Link to="/dashboard" className="text-xl font-bold gradient-text">
                Wimbi Master
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className={collapsed ? 'mx-auto' : ''}
            >
              <ChevronLeft className={`h-5 w-5 transition-all ${collapsed ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-md transition-colors
                    ${location.pathname === item.path 
                      ? 'bg-wimbi text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    } ${collapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <Link to="/dashboard/new-content">
              <Button className={`w-full ${collapsed ? 'p-2' : ''}`}>
                <PlusCircle className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
                {!collapsed && <span>Nouveau contenu</span>}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <div className={`fixed inset-0 z-40 transform transition-transform duration-300 md:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileOpen(false)}></div>
        <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link to="/dashboard" className="text-xl font-bold gradient-text">
                Wimbi Master
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileOpen(false)} 
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 py-4 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-md transition-colors
                      ${location.pathname === item.path 
                        ? 'bg-wimbi text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="p-4 border-t">
              <Link to="/dashboard/new-content" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  <span>Nouveau contenu</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 transition-all duration-300 ${!collapsed ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
