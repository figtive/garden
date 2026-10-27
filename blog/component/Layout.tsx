import type { ReactNode } from "react";
import Row from "./Row.tsx";

export type Crumb = { label: string; href?: string };

type LayoutProps = {
  children: ReactNode;
  crumbs?: Crumb[];
  footer?: ReactNode;
};

function Layout({ children, crumbs = [], footer }: LayoutProps) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="page">
          <header className="site-header text-meta">
            <nav aria-label="Navigation">
              <ol className="crumbs">
                <li className="crumbs__item">
                  <a className="crumbs__link crumbs__root" href="/">
                    ~
                  </a>
                </li>
                {crumbs.map((crumb) => (
                  <li key={crumb.label} className="crumbs__item">
                    {crumb.href ? (
                      <a className="crumbs__link" href={crumb.href}>
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="crumbs__current" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>

              <div className="nav-menu">
                <ul>
                  <li>
                    <a href="/topics">topics</a>
                  </li>
                </ul>
              </div>
            </nav>
          </header>

          {children}

          <footer className="site-footer">
            <Row side={<>&copy; {new Date().getFullYear()}</>}>
              <div className="site-footer__links text-meta">{footer}</div>
            </Row>
          </footer>
        </div>
      </body>
    </html>
  );
}

export default Layout;
