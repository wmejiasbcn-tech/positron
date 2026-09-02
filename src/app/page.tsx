'use client';

import { useState } from 'react';
import Sidebar, { ModuleId } from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardICP from '@/components/DashboardICP';
import ChatModule from '@/components/ChatModule';
import FileExplorer from '@/components/FileExplorer';
import CaptureModule from '@/components/CaptureModule';
import CommandCenter from '@/components/CommandCenter';
import PersonalModule from '@/components/PersonalModule';
import EcosystemModule from '@/components/EcosystemModule';
import EmailModule from '@/components/EmailModule';

const TITLES: Record<ModuleId, string> = {
  dashboard: 'Dashboard ICP - Vista General',
  chat: 'Chat Bidireccional con el Segundo Cerebro',
  archivos: 'Explorador de Archivos del Vault',
  capturas: 'Sistema de Capturas (NPC-CAP)',
  comandos: 'Centro de Comandos (NPCs)',
  personal: 'Compartimento Personal',
  ecosistema: 'Modulo Ecosistema',
  email: 'Sistema de Email',
};

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar active={activeModule} onSelect={setActiveModule} />
      <main style={{ flex: 1, padding: '0 24px 24px', overflow: 'hidden' }}>
        <Header title={TITLES[activeModule]} />
        <div className="fade-in" key={activeModule}>
          {activeModule === 'dashboard' && <DashboardICP />}
          {activeModule === 'chat' && <ChatModule />}
          {activeModule === 'archivos' && <FileExplorer />}
          {activeModule === 'capturas' && <CaptureModule />}
          {activeModule === 'comandos' && <CommandCenter />}
          {activeModule === 'personal' && <PersonalModule />}
          {activeModule === 'ecosistema' && <EcosystemModule />}
          {activeModule === 'email' && <EmailModule />}
        </div>
      </main>
    </div>
  );
}
