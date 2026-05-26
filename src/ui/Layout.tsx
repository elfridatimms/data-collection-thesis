import type { ReactNode } from 'react';

type Props = {
  sidebar: ReactNode;
  topbar: ReactNode;
  main: ReactNode;
};

export function Layout({ sidebar, topbar, main }: Props) {
  return (
    <div className="layout">
      <div className="layout__content">
        <div className="layout__topbar">{topbar}</div>
        <div className="layout__main">{main}</div>
      </div>
      <aside className="layout__sidebar">{sidebar}</aside>
    </div>
  );
}
