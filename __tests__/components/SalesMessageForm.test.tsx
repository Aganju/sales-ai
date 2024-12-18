import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SalesMessageForm from '@/app/SalesMessageForm';

describe('SalesMessageForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('renders the form correctly', () => {
    render(<SalesMessageForm />);
    
    expect(screen.getByText('Generate Sales Message')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter details about your prospect/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate message/i })).toBeInTheDocument();
  });

  // it('handles form submission successfully', async () => {
  //   const mockJobId = '123';
  //   const mockMessage = 'Generated message';

  //   vi.mocked(global.fetch)
  //     .mockImplementationOnce(() => Promise.resolve({
  //       ok: true,
  //       json: () => Promise.resolve({ jobId: mockJobId })
  //     } as Response))
  //     .mockImplementationOnce(() => Promise.resolve({
  //       ok: true,
  //       json: () => Promise.resolve({
  //         state: 'completed',
  //         message: mockMessage
  //       })
  //     } as Response));

  //   render(<SalesMessageForm />);
    
  //   const textarea = screen.getByPlaceholderText(/enter details about your prospect/i);
  //   fireEvent.change(textarea, { target: { value: 'Test summary' } });
    
  //   const submitButton = screen.getByRole('button', { name: /generate message/i });
  //   fireEvent.click(submitButton);

  //   const messageElement = await screen.findByText(mockMessage);
  //   expect(messageElement).toBeInTheDocument();
  // });

  // it('handles API errors', async () => {
  //   vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
  //     ok: false,
  //     status: 500,
  //     json: () => Promise.resolve({ error: 'API Error' })
  //   } as Response));

  //   render(<SalesMessageForm />);
    
  //   const textarea = screen.getByPlaceholderText(/enter details about your prospect/i);
  //   fireEvent.change(textarea, { target: { value: 'Test summary' } });
    
  //   const submitButton = screen.getByRole('button', { name: /generate message/i });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(screen.getByText('Error')).toBeInTheDocument();
  //     expect(screen.getByText(/failed to generate message/i)).toBeInTheDocument();
  //   });
  // });
}); 