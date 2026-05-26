import type { ReactNode } from 'react';

type Props = {
  sidebar: ReactNode;
  topbar: ReactNode;
  main: ReactNode;
};

export function Layout({ sidebar, topbar, main }: Props) {
  return (
    <div className="layout">
      <div className="layout__sidebar">{sidebar}</div>
      <div className="layout__right">
        <div className="layout__topbar">{topbar}</div>
        <div className="layout__main">{main}</div>
      </div>
    </div>
  );
}
