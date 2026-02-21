'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

const SidebarOffsetContext = createContext<{
  sidebarOffset: boolean;
  setSidebarOffset: (v: boolean) => void;
}>({ sidebarOffset: false, setSidebarOffset: () => {} });

export function SidebarOffsetProvider({ children }: { children: ReactNode }) {
  const [sidebarOffset, setSidebarOffset] = useState(false);
  return (
    <SidebarOffsetContext.Provider value={{ sidebarOffset, setSidebarOffset }}>
      {children}
    </SidebarOffsetContext.Provider>
  );
}

export function useSidebarOffset() {
  return useContext(SidebarOffsetContext);
}
