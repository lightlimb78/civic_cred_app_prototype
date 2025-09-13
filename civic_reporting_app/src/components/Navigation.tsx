import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Home, 
  Plus, 
  Map, 
  Wallet, 
  User, 
  LogOut,
  Bell,
  Shield
} from 'lucide-react';
import { useAuth } from './AuthProvider';

export type NavigationView = 'dashboard' | 'create' | 'map' | 'wallet' | 'profile';

interface NavigationProps {
  currentView: NavigationView;
  onViewChange: (view: NavigationView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavigationView, icon: Home, label: 'Home' },
    { id: 'create' as NavigationView, icon: Plus, label: 'Report' },
    { id: 'map' as NavigationView, icon: Map, label: 'Map' },
    { id: 'wallet' as NavigationView, icon: Wallet, label: 'Wallet' },
    { id: 'profile' as NavigationView, icon: User, label: 'Profile' }
  ];

  return (
    <>
      {/* Top Header - Mobile First */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-lg">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center shadow-md">
                <span className="text-accent-foreground font-bold text-lg">C</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-primary-foreground">CivicCred</h1>
                <p className="text-xs text-primary-foreground/70">Civic Reporting</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 touch-target">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 border-2 border-primary-foreground/20">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary-foreground">{user?.name}</span>
                  {user?.aadhaarVerified && (
                    <Shield className="h-4 w-4 text-accent" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">
                    {user?.meritsPoints || 0} pts
                  </Badge>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={logout} className="text-primary-foreground hover:bg-primary-foreground/10 touch-target md:hidden">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation - Mobile First */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl md:hidden">
        <div className="flex justify-around py-2 px-2">
          {navItems.map(({ id, icon: Icon, label }) => {
            const isActive = currentView === id;
            return (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                className={`flex flex-col gap-1 h-auto py-3 px-4 min-h-[60px] touch-target transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={() => onViewChange(id)}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-primary-foreground' : ''}`}>
                  {label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-accent rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-64 border-r bg-background/95 backdrop-blur flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {navItems.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant={currentView === id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewChange(id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarFallback>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {user?.meritsPoints || 0} points
                </Badge>
                {user?.aadhaarVerified && (
                  <Shield className="h-3 w-3 text-green-600" />
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
};