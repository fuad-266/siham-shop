import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render search input with default placeholder', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Search abayas...');
    });

    it('should render search input with custom placeholder', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} placeholder="Find your abaya" />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      expect(input).toHaveAttribute('placeholder', 'Find your abaya');
    });

    it('should render search icon', () => {
      const mockOnSearch = vi.fn();
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      const icon = container.querySelector('.search-bar__icon');
      expect(icon).toBeInTheDocument();
    });

    it('should not render clear button when input is empty', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const clearButton = screen.queryByRole('button', { name: /clear search/i });
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should render clear button when input has value', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'test' } });

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Debounced Search', () => {
    it('should debounce search input with default delay (300ms)', async () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });

      // Type multiple characters quickly
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'aba' } });

      // Should not call onSearch immediately
      expect(mockOnSearch).not.toHaveBeenCalled();

      // Fast-forward time by 300ms
      vi.advanceTimersByTime(300);

      // Should call onSearch once with final value
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('aba');
      });
    });

    it('should debounce search input with custom delay', async () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} debounceMs={500} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'test' } });

      // Should not call after 300ms
      vi.advanceTimersByTime(300);
      expect(mockOnSearch).not.toHaveBeenCalled();

      // Should call after 500ms
      vi.advanceTimersByTime(200);
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('test');
      });
    });

    it('should reset debounce timer on each keystroke', async () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });

      // Type first character
      fireEvent.change(input, { target: { value: 'a' } });
      vi.advanceTimersByTime(200);

      // Type second character before debounce completes
      fireEvent.change(input, { target: { value: 'ab' } });
      vi.advanceTimersByTime(200);

      // Type third character before debounce completes
      fireEvent.change(input, { target: { value: 'aba' } });

      // Should not have called yet
      expect(mockOnSearch).not.toHaveBeenCalled();

      // Complete the debounce
      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('aba');
      });
    });
  });

  describe('Clear Functionality', () => {
    it('should clear input when clear button is clicked', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'test query' } });

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);

      expect(input).toHaveValue('');
    });

    it('should call onSearch with empty string when cleared', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'test query' } });

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);

      expect(mockOnSearch).toHaveBeenCalledWith('');
    });

    it('should hide clear button after clearing', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'test' } });

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);

      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should trigger immediate search on form submit', async () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      const form = screen.getByRole('search');

      fireEvent.change(input, { target: { value: 'abaya' } });
      fireEvent.submit(form);

      // Should call immediately without waiting for debounce
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('abaya');
      });
    });

    it('should prevent default form submission', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const form = screen.getByRole('search');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

      form.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const form = screen.getByRole('search', { name: /product search/i });
      expect(form).toBeInTheDocument();

      const input = screen.getByRole('textbox', { name: /search products/i });
      expect(input).toBeInTheDocument();
    });

    it('should have aria-label on clear button', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'test' } });

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toHaveAttribute('aria-label', 'Clear search');
    });

    it('should have aria-hidden on decorative icons', () => {
      const mockOnSearch = vi.fn();
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      const searchIcon = container.querySelector('.search-bar__icon');
      expect(searchIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should be keyboard accessible', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      
      // Input should be focusable
      input.focus();
      expect(document.activeElement).toBe(input);

      // Type with keyboard
      fireEvent.change(input, { target: { value: 'test' } });
      expect(input).toHaveValue('test');

      // Clear button should be focusable
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      clearButton.focus();
      expect(document.activeElement).toBe(clearButton);
    });

    it('should have autocomplete off', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      expect(input).toHaveAttribute('autocomplete', 'off');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string input', async () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: '' } });

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('');
      });
    });

    it('should handle whitespace-only input', async () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: '   ' } });

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('   ');
      });
    });

    it('should handle special characters', async () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      const specialChars = '!@#$%^&*()';
      fireEvent.change(input, { target: { value: specialChars } });

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(specialChars);
      });
    });

    it('should handle very long input strings', async () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      const longString = 'a'.repeat(1000);
      fireEvent.change(input, { target: { value: longString } });

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(longString);
      });
    });
  });

  describe('Component Cleanup', () => {
    it('should cleanup debounce timer on unmount', () => {
      const mockOnSearch = vi.fn();
      const { unmount } = render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'test' } });

      // Unmount before debounce completes
      unmount();

      // Advance timers
      vi.advanceTimersByTime(300);

      // Should not call onSearch after unmount
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });
});
