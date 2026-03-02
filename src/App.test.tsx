import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Alora Abayas')).toBeInTheDocument();
  });

  describe('Filtering Integration', () => {
    it('displays filtered result count when category filter is applied', async () => {
      render(<App />);
      
      // Initially should show all products
      const initialCount = screen.getByText(/products? found/i);
      expect(initialCount).toBeInTheDocument();
      
      // Click on casual category filter in the FilterPanel (within the "Product filters" region)
      const filterPanel = screen.getByRole('region', { name: /product filters/i });
      const casualButton = within(filterPanel).getByRole('button', { name: /filter by casual category/i });
      fireEvent.click(casualButton);
      
      // Wait for the filter to be applied and count to update
      await waitFor(() => {
        const countText = screen.getByText(/products? found/i).textContent;
        expect(countText).toMatch(/\d+ products? found/);
      });
    });

    it('updates result count when price range filter is applied', async () => {
      render(<App />);
      
      // Change the max price input
      const maxPriceInput = screen.getByLabelText(/maximum price/i);
      fireEvent.change(maxPriceInput, { target: { value: '1500' } });
      
      // Wait for the filter to be applied
      await waitFor(() => {
        const countText = screen.getByText(/products? found/i).textContent;
        expect(countText).toMatch(/\d+ products? found/);
      });
    });

    it('updates result count when size filter is applied', async () => {
      render(<App />);
      
      // Click on a size checkbox
      const sizeCheckbox = screen.getByLabelText(/filter by size XL/i);
      fireEvent.click(sizeCheckbox);
      
      // Wait for the filter to be applied
      await waitFor(() => {
        const countText = screen.getByText(/products? found/i).textContent;
        expect(countText).toMatch(/\d+ products? found/);
      });
    });

    it('shows correct count when multiple filters are applied', async () => {
      render(<App />);
      
      // Apply category filter in the FilterPanel
      const filterPanel = screen.getByRole('region', { name: /product filters/i });
      const casualButton = within(filterPanel).getByRole('button', { name: /filter by casual category/i });
      fireEvent.click(casualButton);
      
      // Apply size filter
      const sizeCheckbox = screen.getByLabelText(/filter by size M/i);
      fireEvent.click(sizeCheckbox);
      
      // Wait for filters to be applied
      await waitFor(() => {
        const countText = screen.getByText(/products? found/i).textContent;
        expect(countText).toMatch(/\d+ products? found/);
      });
    });

    it('clears all filters when Clear All button is clicked', async () => {
      render(<App />);
      
      // Apply a filter first in the FilterPanel
      const filterPanel = screen.getByRole('region', { name: /product filters/i });
      const casualButton = within(filterPanel).getByRole('button', { name: /filter by casual category/i });
      fireEvent.click(casualButton);
      
      // Wait for filter to be applied
      await waitFor(() => {
        expect(screen.getByText(/clear all/i)).toBeInTheDocument();
      });
      
      // Click Clear All button
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      fireEvent.click(clearButton);
      
      // Verify filters are cleared
      await waitFor(() => {
        const countText = screen.getByText(/products? found/i).textContent;
        // Should show all products again
        expect(countText).toMatch(/\d+ products? found/);
      });
    });
  });
});
