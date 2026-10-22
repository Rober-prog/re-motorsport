import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { createI18n } from '../lib/i18n';
import { localeFromPath } from '../lib/routing';
import { ContactForm } from '../components/forms/ContactForm';
import { CatalogPage } from '../pages/ContentPages';
import { VehiclePopup } from '../components/vehicle/VehiclePopup';
import {
  VehicleInteractionProvider,
  useVehicleInteraction,
} from '../components/vehicle/VehicleInteractionProvider';
function wrap(children: React.ReactNode, entry = '/contacto') {
  return (
    <I18nextProvider i18n={createI18n(localeFromPath(entry))}>
      <MemoryRouter initialEntries={[entry]}>{children}</MemoryRouter>
    </I18nextProvider>
  );
}
describe('Formularios accesibles', () => {
  it('preselecciona la categoría recibida y anuncia errores', async () => {
    render(wrap(<ContactForm />, '/contacto?categoria=frenos'));
    expect(screen.getByLabelText('Categoría de producto')).toHaveValue('frenos');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));
    expect(await screen.findByText('Introduce un correo electrónico válido.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Revisa los campos indicados');
  });
  it('no envía ni simula éxito cuando no está configurado', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(wrap(<ContactForm />));
    await userEvent.type(screen.getByLabelText(/Nombre y apellidos/), 'Cliente de prueba');
    await userEvent.type(screen.getByLabelText(/Correo electrónico/), 'test@example.com');
    await userEvent.type(
      screen.getByLabelText(/Cuéntanos qué necesitas/),
      'Necesito información sobre los frenos de mi vehículo.',
    );
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));
    expect(await screen.findByText(/No se ha enviado tu consulta/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
describe('Catálogo', () => {
  it('busca y muestra un estado vacío recuperable', async () => {
    render(wrap(<CatalogPage />, '/catalogo'));
    const search = screen.getByRole('searchbox');
    await userEvent.type(search, 'zzzz');
    expect(screen.getByText('No encontramos esa categoría.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(screen.getByRole('status')).toHaveTextContent('11 categorías');
  });
});
function HotspotTrigger() {
  const { select } = useVehicleInteraction();
  return <button onClick={(e) => select('frenos', e.currentTarget)}>Seleccionar frenos</button>;
}
describe('Popup de vehículo', () => {
  it('fija selección, ofrece categoría en CTA y devuelve el foco con Escape', async () => {
    render(
      wrap(
        <VehicleInteractionProvider>
          <HotspotTrigger />
          <VehiclePopup />
        </VehicleInteractionProvider>,
      ),
    );
    const trigger = screen.getByRole('button', { name: 'Seleccionar frenos' });
    await userEvent.click(trigger);
    const popup = screen.getByRole('dialog');
    await waitFor(() => expect(popup).toHaveFocus());
    expect(screen.getByRole('link', { name: 'Consultar esta categoría' })).toHaveAttribute(
      'href',
      '/contacto?categoria=frenos',
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
