'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, FileText, Shield, Mail, Smartphone, AlertTriangle, Eye, EyeOff, MoonStar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/form';

export default function RegistrationCompleteView() {
  const router = useRouter();
  const [settings, setSettings] = useState([
    { id: 1, title: 'Enable eStatements', description: 'Go paperless and access statements online', enabled: false, icon: <FileText size={20} /> },
    { id: 2, title: 'Account notifications', description: 'Receive payment reminders and account updates', enabled: false, icon: <Bell size={20} /> },
    { id: 3, title: 'Transaction alerts', description: 'Get notified about transactions over $100', enabled: false, icon: <AlertTriangle size={20} /> },
    { id: 4, title: 'Email communications', description: 'Receive account offers and updates via email', enabled: true, icon: <Mail size={20} /> },
    { id: 5, title: 'SMS notifications', description: 'Receive text alerts for important events', enabled: false, icon: <Smartphone size={20} /> },
    { id: 6, title: 'Two-factor authentication', description: 'Secure your account with 2FA on login', enabled: true, icon: <Shield size={20} /> },
    { id: 7, title: 'Biometric login', description: 'Use fingerprint or face ID to sign in', enabled: false, icon: <Zap size={20} /> },
    { id: 8, title: 'Hide balances', description: 'Hide account balances on the dashboard', enabled: false, icon: <EyeOff size={20} /> },
    { id: 9, title: 'Dark mode', description: 'Use dark theme across the app', enabled: true, icon: <MoonStar size={20} /> }
  ]);

  const toggleSetting = (id: number) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  // Calculate completion percentage
  const enabledCount = settings.filter(setting => setting.enabled).length;
  const completionPercentage = Math.round((enabledCount / settings.length) * 100);
  
  // Group settings by category
  const securitySettings = settings.filter(s => [6, 7].includes(s.id));
  const notificationSettings = settings.filter(s => [2, 3, 4, 5].includes(s.id));
  const displaySettings = settings.filter(s => [1, 8, 9].includes(s.id));

  const handleContinue = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-neutral-200 p-6 flex flex-col">
      {/* Logo and Header */}
      <div className="mb-8">
        <div className="h-12 w-12 md:h-14 md:w-14 bg-white rounded-lg flex items-center justify-center mb-6">
          <img 
            src="/images/icons/logo-light.svg" 
            alt="Logo" 
            className="h-8 w-8 md:h-10 md:w-10 object-contain"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-extralight text-white mb-2 tracking-tight">
          Account <span className="font-normal">settings</span>
        </h1>
        <p className="text-neutral-400 text-sm font-light mb-6">Configure your preferences to get started</p>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto">
        {/* Security Settings */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-white mb-3">Security</h2>
          <div className="space-y-3">
            {securitySettings.map((setting) => (
              <div 
                key={setting.id}
                className="bg-neutral-800 rounded-lg p-4 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors"
              >
                <div className="mr-3 text-white">
                  {setting.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">
                    {setting.title}
                  </h3>
                  <p className="text-neutral-400 text-sm">{setting.description}</p>
                </div>
                {/* Toggle Switch */}
                <div 
                  onClick={() => toggleSetting(setting.id)} 
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${setting.enabled ? 'bg-white' : 'bg-neutral-700'}`}
                >
                  <div 
                    className={`bg-neutral-800 w-4 h-4 rounded-full shadow-md transform transition-transform ${setting.enabled ? 'translate-x-6' : ''}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-white mb-3">Notifications</h2>
          <div className="space-y-3">
            {notificationSettings.map((setting) => (
              <div 
                key={setting.id}
                className="bg-neutral-800 rounded-lg p-4 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors"
              >
                <div className="mr-3 text-white">
                  {setting.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">
                    {setting.title}
                  </h3>
                  <p className="text-neutral-400 text-sm">{setting.description}</p>
                </div>
                {/* Toggle Switch */}
                <div 
                  onClick={() => toggleSetting(setting.id)} 
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${setting.enabled ? 'bg-white' : 'bg-neutral-700'}`}
                >
                  <div 
                    className={`bg-neutral-800 w-4 h-4 rounded-full shadow-md transform transition-transform ${setting.enabled ? 'translate-x-6' : ''}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-white mb-3">Display & Preferences</h2>
          <div className="space-y-3">
            {displaySettings.map((setting) => (
              <div 
                key={setting.id}
                className="bg-neutral-800 rounded-lg p-4 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors"
              >
                <div className="mr-3 text-white">
                  {setting.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">
                    {setting.title}
                  </h3>
                  <p className="text-neutral-400 text-sm">{setting.description}</p>
                </div>
                {/* Toggle Switch */}
                <div 
                  onClick={() => toggleSetting(setting.id)} 
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${setting.enabled ? 'bg-white' : 'bg-neutral-700'}`}
                >
                  <div 
                    className={`bg-neutral-800 w-4 h-4 rounded-full shadow-md transform transition-transform ${setting.enabled ? 'translate-x-6' : ''}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-6">
        <Button onClick={handleContinue}>
          CONTINUE TO DASHBOARD
        </Button>
      </div>
    </div>
  );
}
