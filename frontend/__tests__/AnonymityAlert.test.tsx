import { render, screen } from '@testing-library/react';
import AnonymityAlert from '@/app/features/chat/components/AnonymityAlert';

describe('CP-004: Componente AnonymityAlert', () => {
  test('muestra el mensaje de advertencia correctamente', () => {
    render(<AnonymityAlert hasUserStartedChat={false} />);
    expect(screen.getByText(/Estás en modo anónimo/i)).toBeInTheDocument();
  });

  test('usa clase amarilla si el usuario NO ha iniciado el chat', () => {
    render(<AnonymityAlert hasUserStartedChat={false} />);
    const alert = screen.getByText(/Estás en modo anónimo/i);
    expect(alert).toHaveClass('bg-yellow-500');
  });

  test('usa clase gris si el usuario ya inició el chat', () => {
    render(<AnonymityAlert hasUserStartedChat={true} />);
    const alert = screen.getByText(/Estás en modo anónimo/i);
    expect(alert).toHaveClass('bg-gray-800');
  });
});
