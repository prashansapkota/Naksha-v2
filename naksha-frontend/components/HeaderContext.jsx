'use client';

import { createContext, useContext, useState } from 'react';

const HeaderContext = createContext({
  rightContent: null,
  setRightContent: () => {},
});

export function HeaderProvider({ children }) {
  const [rightContent, setRightContent] = useState(null);

  return (
    <HeaderContext.Provider value={{ rightContent, setRightContent }}>
      {children}
    </HeaderContext.Provider>
  );
}

export const useHeader = () => useContext(HeaderContext);
