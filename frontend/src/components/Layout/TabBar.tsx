import { Button } from '../ui/button';
import { BarChart3, Package, ShoppingCart, Settings, TrendingUp, FileText } from 'lucide-react';
import { TabType } from '../../types';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isMobile?: boolean;
}

const tabs = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
  { id: 'inventory' as TabType, label: 'Inventory', icon: Package },
  { id: 'stock' as TabType, label: 'Stock', icon: TrendingUp },
  { id: 'pos' as TabType, label: 'POS', icon: ShoppingCart },
  { id: 'reports' as TabType, label: 'Reports', icon: FileText },
];

export function TabBar({ activeTab, onTabChange, isMobile = false }: TabBarProps) {
  if (isMobile) {
    return (
      <div className="space-y-2">
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
      </div>
    );
  }

  return (
    <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => onTabChange(tab.id)}
        >
          <tab.icon className="h-4 w-4 mr-2" />
          {tab.label}
        </Button>
      ))}
    </div>
  );
}