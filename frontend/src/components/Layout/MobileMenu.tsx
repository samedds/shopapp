import { Button } from '../ui/button';
import { X, BarChart3, Package, TrendingUp, ShoppingCart, FileText } from 'lucide-react';
import { TabType } from '../../types';

interface MobileMenuProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onClose: () => void;
}

const tabs = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
  { id: 'inventory' as TabType, label: 'Inventory', icon: Package },
  { id: 'stock' as TabType, label: 'Stock', icon: TrendingUp },
  { id: 'pos' as TabType, label: 'POS', icon: ShoppingCart },
  { id: 'reports' as TabType, label: 'Reports', icon: FileText },
];

export function MobileMenu({ activeTab, onTabChange, onClose }: MobileMenuProps) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Menu Panel */}
      <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onTabChange(tab.id)}
            >
              <tab.icon className="h-4 w-4 mr-3" />
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}