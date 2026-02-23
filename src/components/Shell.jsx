import { useState } from 'react';
import {
  LayoutDashboard, Settings, Users, Phone, Globe, FileText,
  Shield, Calendar, Bell, Search, ChevronDown, Sliders,
  Radio, Hash, Monitor, MapPin, GitBranch, Archive,
  UserCheck, UserCog, Network, ChevronRight
} from 'lucide-react';

const NAV = [
  {
    section: 'ACCOUNT',
    items: [
      { icon: Settings, label: 'Customization' },
      { icon: Sliders, label: 'Preferences' },
      { icon: Calendar, label: 'Holiday Hours' },
      { icon: Shield, label: 'Security Settings' },
      { icon: Phone, label: 'Emergency Calls' },
    ],
  },
  {
    section: 'PEOPLE',
    items: [
      { icon: Users, label: 'Users' },
      { icon: UserCheck, label: 'Teams' },
      { icon: UserCog, label: 'Roles & Permissions' },
    ],
  },
  {
    section: 'SERVICE SETTINGS',
    items: [
      { icon: Network, label: 'SIP Trunks', active: true },
      { icon: Hash, label: 'Numbers' },
      { icon: Monitor, label: 'Devices' },
      { icon: MapPin, label: 'Sites' },
      { icon: GitBranch, label: 'Call Patterns' },
    ],
  },
  {
    section: 'ROUTING',
    items: [
      { icon: Archive, label: 'Dispositions' },
      { icon: FileText, label: 'Storage and Retention' },
    ],
  },
];

export default function Shell({ children }) {
  const [searchVal, setSearchVal] = useState('');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-4 h-12 flex-shrink-0" style={{ background: '#5a3ea0' }}>
        <div className="flex items-center gap-3">
          {/* Talkdesk logo wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
              <Radio size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm hidden md:block">Talkdesk</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search apps, actions and more..."
              className="w-full bg-white/15 text-white placeholder-white/50 text-sm rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:bg-white/20 transition-colors"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={16} className="text-white/80 cursor-pointer hover:text-white" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">2</span>
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-semibold">
              A
            </div>
            <span className="text-white/80 text-xs hidden md:block">Admin</span>
            <ChevronDown size={12} className="text-white/60" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-100 overflow-y-auto flex-shrink-0">
          {/* Account label */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-td-purple-hover cursor-pointer">
              <div className="w-6 h-6 rounded bg-td-purple flex items-center justify-center text-white text-xs font-bold">A</div>
              <div>
                <div className="text-xs font-semibold text-gray-800 leading-none">Admin</div>
              </div>
              <ChevronRight size={12} className="text-gray-400 ml-auto" />
            </div>
          </div>

          <nav className="pb-4">
            {NAV.map((section) => (
              <div key={section.section} className="mt-1">
                <div className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {section.section}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 mx-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${
                        item.active
                          ? 'bg-td-purple-light text-td-purple font-semibold border-l-2 border-td-purple'
                          : 'text-gray-600 hover:bg-td-purple-hover hover:text-gray-800'
                      }`}
                    >
                      <Icon size={15} className={item.active ? 'text-td-purple' : 'text-gray-400'} />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#f5f4f8]">
          {children}
        </main>
      </div>
    </div>
  );
}
