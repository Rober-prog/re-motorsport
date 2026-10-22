import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, CircleAlert, CheckCircle2 } from 'lucide-react';
import { contactSchema, type ContactInput, type ContactData } from '../../lib/contactSchema';
import { activeCategories } from '../../data/categories';
import { localeFromPath } from '../../lib/routing';
import { Spinner, useLocalPath } from '../ui/Primitives';
export function ContactForm({ initialType = 'general' }: { initialType?: ContactData['type'] }) {
  const { t } = useTranslation();
  const locale = localeFromPath(useLocation().pathname);
  const path = useLocalPath();
  const [params] = useSearchParams();
  const id = useId();
  const requestedCategory = params.get('categoria') || '';
  const category = activeCategories().some((c) => c.id === requestedCategory)
    ? requestedCategory
    : '';
  const enabled = import.meta.env.VITE_CONTACT_ENABLED === 'true';
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      locale,
      name: '',
      email: '',
      phone: '',
      type: initialType,
      category,
      message: '',
      consent: false,
      website: '',
      company: '',
      brand: '',
      model: '',
      year: '',
      engine: '',
      part: '',
      reference: '',
    },
  });
  const type = watch('type');
  const input = (
    name: keyof ContactInput,
    label: string,
    options: { type?: string; required?: boolean } = {},
  ) => (
    <div className="form-field" key={name}>
      <label htmlFor={`${id}-${name}`}>
        {label}
        {options.required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={`${id}-${name}`}
        type={options.type || 'text'}
        autoComplete={
          name === 'name'
            ? 'name'
            : name === 'email'
              ? 'email'
              : name === 'phone'
                ? 'tel'
                : name === 'company'
                  ? 'organization'
                  : 'off'
        }
        {...register(name)}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${id}-${name}-error` : undefined}
      />
      {errors[name] && (
        <span id={`${id}-${name}-error`} className="field-error">
          {t(String(errors[name]?.message || 'form.required'))}
        </span>
      )}
    </div>
  );
  const onSubmit = async (data: ContactData) => {
    if (!enabled) {
      setStatus('error');
      setFeedback(t('form.unavailable'));
      return;
    }
    setStatus('sending');
    setFeedback('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      const result = (await response.json()) as { ok?: boolean };
      if (!response.ok || result.ok !== true) {
        setStatus('error');
        setFeedback(
          t(
            response.status === 503
              ? 'form.unavailable'
              : response.status === 429
                ? 'form.rate'
                : 'form.error',
          ),
        );
        return;
      }
      setStatus('success');
      setFeedback(t('form.success'));
      reset();
    } catch {
      setStatus('error');
      setFeedback(t('form.error'));
    }
  };
  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit(onSubmit, () => {
        setStatus('error');
        setFeedback(t('form.summary'));
      })}
      noValidate
      aria-label={t('contact.form')}
    >
      {!enabled && (
        <div className="form-notice">
          <CircleAlert size={20} aria-hidden="true" />
          <p>{t('contact.blocked')}</p>
        </div>
      )}
      <div className="form-grid">
        {input('name', t('form.name'), { required: true })}
        {input('email', t('form.email'), { type: 'email', required: true })}
        {input('phone', t('form.phone'), { type: 'tel' })}
        <div className="form-field">
          <label htmlFor={`${id}-type`}>{t('form.type')}</label>
          <select id={`${id}-type`} {...register('type')}>
            {['general', 'spare', 'professional', 'classic'].map((v) => (
              <option key={v} value={v}>
                {t(`form.${v}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field full-width">
          <label htmlFor={`${id}-category`}>{t('form.category')}</label>
          <select id={`${id}-category`} {...register('category')}>
            <option value="">{t('form.select')}</option>
            {activeCategories().map((c) => (
              <option key={c.id} value={c.id}>
                {c.name[locale]}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{t('form.required')}</span>}
        </div>
        {type === 'professional' && input('company', t('form.company'), { required: true })}
        {(type === 'spare' || type === 'classic') && (
          <>
            {input('brand', t('form.brand'), { required: true })}
            {input('model', t('form.model'), { required: true })}
            {input('year', t('form.year'), { type: 'text', required: true })}
            {input('engine', t('form.engine'))}
            {input('part', t('form.part'), { required: true })}
            {input('reference', t('form.reference'))}
          </>
        )}
        <div className="form-field full-width">
          <label htmlFor={`${id}-message`}>
            {t('form.message')} <span aria-hidden="true">*</span>
          </label>
          <textarea
            id={`${id}-message`}
            rows={5}
            {...register('message')}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
          />
          {errors.message && (
            <span id={`${id}-message-error`} className="field-error">
              {t(String(errors.message.message))}
            </span>
          )}
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} {...register('website')} tabIndex={-1} autoComplete="off" />
      </div>
      <div className="consent">
        <input
          id={`${id}-consent`}
          type="checkbox"
          {...register('consent')}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
        />
        <div>
          <label htmlFor={`${id}-consent`}>{t('form.privacy')}</label>
          <Link to={path('/privacidad')}>{t('form.privacyLink')}</Link>
          {errors.consent && (
            <span id={`${id}-consent-error`} className="field-error">
              {t('form.consentError')}
            </span>
          )}
        </div>
      </div>
      <button className="button button-primary" disabled={status === 'sending'} type="submit">
        {status === 'sending' ? (
          <Spinner label={t('form.sending')} />
        ) : (
          <>
            {t('form.send')}
            <ArrowUpRight size={18} />
          </>
        )}
      </button>
      <div
        className={`form-feedback ${status}`}
        role={status === 'error' ? 'alert' : 'status'}
        aria-live="polite"
      >
        {feedback && (
          <>
            {status === 'success' ? <CheckCircle2 size={19} /> : <CircleAlert size={19} />}
            <span>{feedback}</span>
          </>
        )}
      </div>
    </form>
  );
}
