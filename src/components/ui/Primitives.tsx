import { Component, useEffect, useRef, type ReactNode } from 'react';
import { ArrowUpRight, X, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localeFromPath, localPath } from '../../lib/routing';
import { useLocation } from 'react-router-dom';

export function useLocalPath() {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  return (path: string) => localPath(path, locale);
}
export function ActionLink({
  to,
  children,
  secondary = false,
  className = '',
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  const path = useLocalPath();
  return (
    <Link
      className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`}
      to={path(to)}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {text && <p className="section-description">{text}</p>}
      </div>
      {children}
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {text && <p className="intro-text">{text}</p>}
    </div>
  );
}
export function Breadcrumbs({ title }: { title: string }) {
  const { t } = useTranslation();
  const path = useLocalPath();
  return (
    <nav className="breadcrumbs" aria-label={t('common.section')}>
      <Link to={path('/')}>{t('common.home')}</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{title}</span>
    </nav>
  );
}
export function PendingNotice({ children }: { children?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <p className="pending-note">
      <span aria-hidden="true" />
      {children || t('common.pending')}
    </p>
  );
}
export function Spinner({ label }: { label: string }) {
  return (
    <span className="spinner" role="status">
      <LoaderCircle size={18} className="spin" aria-hidden="true" />
      {label}
    </span>
  );
}
export function Skeleton() {
  return (
    <div className="skeleton" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className="tooltip-wrap">
      {children}
      <span className="tooltip" role="tooltip">
        {text}
      </span>
    </span>
  );
}
export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="modal-heading"
    >
      <button className="icon-button modal-close" aria-label={t('common.close')} onClick={onClose}>
        <X />
      </button>
      <h2 id="modal-heading">{title}</h2>
      {children}
    </dialog>
  );
}
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError?: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
