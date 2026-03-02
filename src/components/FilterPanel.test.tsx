import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from './FilterPanel';
import { FilterOptions } from '../types/models';

describe('FilterPanel', () => {
  const mockOnFilterChange = vi.fn();

  const defaultProps = {
    filters: {} as FilterOptions,
    onFilterChange: mockOnFilterChange,
  };

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render the filter panel with title', () => {
      render(<FilterPanel {...defaultProps} />);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('should render all filter sections', () => {
      render(<FilterPanel {...defaultProps} />);
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Price Range')).toBeInTheDocument();
      expect(screen.getByText('Size')).toBeInTheDocument();
      expect(screen.getByText('Color')).toBeInTheDocument();
    });

    it('should render default categories', () => {
      render(<FilterPanel {...defaultProps} />);
      expect(screen.getByText('Casual')).toBeInTheDocument();
      expect(screen.getByText('Formal')).toBeInTheDocument();
      expect(screen.getByText('Embroidered')).toBeInTheDocument();
      expect(screen.getByText('Plain')).toBeInTheDocument();
    });

    it('should render custom categories when provided', () => {
      render(
        <FilterPanel
          {...defaultProps}
          availableCategories={['custom1', 'custom2']}
        />
      );
      expect(screen.getByText('Custom1')).toBeInTheDocument();
      expect(screen.getByText('Custom2')).toBeInTheDocument();
    });

    it('should render default sizes', () => {
      render(<FilterPanel {...defaultProps} />);
      expect(screen.getByText('S')).toBeInTheDocument();
      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('L')).toBeInTheDocument();
      expect(screen.getByText('XL')).toBeInTheDocument();
      expect(screen.getByText('XXL')).toBeInTheDocument();
    });

    it('should render default colors', () => {
      render(<FilterPanel {...defaultProps} />);
      expect(screen.getByText('Black')).toBeInTheDocument();
      expect(screen.getByText('Navy')).toBeInTheDocument();
      expect(screen.getByText('White')).toBeInTheDocument();
    });
  });

  describe('Active Filter Count', () => {
    it('should not display badge when no filters are active', () => {
      render(<FilterPanel {...defaultProps} />);
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('should display badge with count 1 when category is selected', () => {
      const filters: FilterOptions = { category: 'casual' };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      expect(screen.getByLabelText('1 active filters')).toBeInTheDocument();
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should display badge with count 2 when category and price range are set', () => {
      const filters: FilterOptions = {
        category: 'formal',
        priceRange: { min: 1000, max: 2000 },
      };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      expect(screen.getByLabelText('2 active filters')).toBeInTheDocument();
    });

    it('should count each selected size as a separate filter', () => {
      const filters: FilterOptions = {
        sizes: ['S', 'M', 'L'],
      };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      expect(screen.getByLabelText('3 active filters')).toBeInTheDocument();
    });

    it('should count each selected color as a separate filter', () => {
      const filters: FilterOptions = {
        colors: ['Black', 'Navy'],
      };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      expect(screen.getByLabelText('2 active filters')).toBeInTheDocument();
    });

    it('should display correct total count with multiple filter types', () => {
      const filters: FilterOptions = {
        category: 'casual',
        priceRange: { min: 500, max: 1500 },
        sizes: ['M', 'L'],
        colors: ['Black'],
      };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      // 1 (category) + 1 (price) + 2 (sizes) + 1 (color) = 5
      expect(screen.getByLabelText('5 active filters')).toBeInTheDocument();
    });
  });

  describe('Category Selection', () => {
    it('should call onFilterChange when category is selected', () => {
      render(<FilterPanel {...defaultProps} />);
      const casualBtn = screen.getByText('Casual');
      fireEvent.click(casualBtn);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        category: 'casual',
      });
    });

    it('should deselect category when clicked again', () => {
      const filters: FilterOptions = { category: 'casual' };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const casualBtn = screen.getByText('Casual');
      fireEvent.click(casualBtn);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        category: undefined,
      });
    });

    it('should mark selected category as active', () => {
      const filters: FilterOptions = { category: 'formal' };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const formalBtn = screen.getByText('Formal');
      expect(formalBtn).toHaveClass('filter-panel__category-btn--active');
    });

    it('should have correct aria-pressed attribute', () => {
      const filters: FilterOptions = { category: 'embroidered' };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const embroideredBtn = screen.getByText('Embroidered');
      expect(embroideredBtn).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Price Range', () => {
    it('should display default price range', () => {
      render(<FilterPanel {...defaultProps} />);
      expect(screen.getByText('0 ETB - 4000 ETB')).toBeInTheDocument();
    });

    it('should display custom price range when provided', () => {
      render(
        <FilterPanel
          {...defaultProps}
          minPrice={500}
          maxPrice={3000}
        />
      );
      expect(screen.getByText('500 ETB - 3000 ETB')).toBeInTheDocument();
    });

    it('should call onFilterChange when min price is changed', () => {
      render(<FilterPanel {...defaultProps} />);
      const minInput = screen.getByLabelText('Minimum price');
      
      fireEvent.change(minInput, { target: { value: '1000' } });
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        priceRange: { min: 1000, max: 4000 },
      });
    });

    it('should call onFilterChange when max price is changed', () => {
      render(<FilterPanel {...defaultProps} />);
      const maxInput = screen.getByLabelText('Maximum price');
      
      fireEvent.change(maxInput, { target: { value: '2000' } });
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        priceRange: { min: 0, max: 2000 },
      });
    });

    it('should update slider when price range changes', () => {
      const filters: FilterOptions = {
        priceRange: { min: 1000, max: 2500 },
      };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      expect(screen.getByText('1000 ETB - 2500 ETB')).toBeInTheDocument();
    });

    it('should call onFilterChange when slider is moved', () => {
      render(<FilterPanel {...defaultProps} />);
      const slider = screen.getByLabelText('Price range slider');
      
      fireEvent.change(slider, { target: { value: '3000' } });
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        priceRange: { min: 0, max: 3000 },
      });
    });
  });

  describe('Size Selection', () => {
    it('should call onFilterChange when size is checked', () => {
      render(<FilterPanel {...defaultProps} />);
      const sizeCheckbox = screen.getByLabelText('Filter by size M');
      
      fireEvent.click(sizeCheckbox);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        sizes: ['M'],
      });
    });

    it('should add multiple sizes', () => {
      render(<FilterPanel {...defaultProps} />);
      
      fireEvent.click(screen.getByLabelText('Filter by size S'));
      fireEvent.click(screen.getByLabelText('Filter by size M'));
      
      expect(mockOnFilterChange).toHaveBeenLastCalledWith({
        sizes: ['S', 'M'],
      });
    });

    it('should remove size when unchecked', () => {
      const filters: FilterOptions = { sizes: ['S', 'M', 'L'] };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const mCheckbox = screen.getByLabelText('Filter by size M');
      fireEvent.click(mCheckbox);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        sizes: ['S', 'L'],
      });
    });

    it('should set sizes to undefined when last size is unchecked', () => {
      const filters: FilterOptions = { sizes: ['M'] };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const mCheckbox = screen.getByLabelText('Filter by size M');
      fireEvent.click(mCheckbox);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        sizes: undefined,
      });
    });

    it('should check boxes for selected sizes', () => {
      const filters: FilterOptions = { sizes: ['S', 'L'] };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const sCheckbox = screen.getByLabelText('Filter by size S') as HTMLInputElement;
      const lCheckbox = screen.getByLabelText('Filter by size L') as HTMLInputElement;
      const mCheckbox = screen.getByLabelText('Filter by size M') as HTMLInputElement;
      
      expect(sCheckbox.checked).toBe(true);
      expect(lCheckbox.checked).toBe(true);
      expect(mCheckbox.checked).toBe(false);
    });
  });

  describe('Color Selection', () => {
    it('should call onFilterChange when color is checked', () => {
      render(<FilterPanel {...defaultProps} />);
      const colorCheckbox = screen.getByLabelText('Filter by color Black');
      
      fireEvent.click(colorCheckbox);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        colors: ['Black'],
      });
    });

    it('should add multiple colors', () => {
      render(<FilterPanel {...defaultProps} />);
      
      fireEvent.click(screen.getByLabelText('Filter by color Black'));
      fireEvent.click(screen.getByLabelText('Filter by color Navy'));
      
      expect(mockOnFilterChange).toHaveBeenLastCalledWith({
        colors: ['Black', 'Navy'],
      });
    });

    it('should remove color when unchecked', () => {
      const filters: FilterOptions = { colors: ['Black', 'Navy', 'White'] };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const navyCheckbox = screen.getByLabelText('Filter by color Navy');
      fireEvent.click(navyCheckbox);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        colors: ['Black', 'White'],
      });
    });

    it('should set colors to undefined when last color is unchecked', () => {
      const filters: FilterOptions = { colors: ['Black'] };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const blackCheckbox = screen.getByLabelText('Filter by color Black');
      fireEvent.click(blackCheckbox);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        colors: undefined,
      });
    });

    it('should check boxes for selected colors', () => {
      const filters: FilterOptions = { colors: ['Black', 'White'] };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const blackCheckbox = screen.getByLabelText('Filter by color Black') as HTMLInputElement;
      const whiteCheckbox = screen.getByLabelText('Filter by color White') as HTMLInputElement;
      const navyCheckbox = screen.getByLabelText('Filter by color Navy') as HTMLInputElement;
      
      expect(blackCheckbox.checked).toBe(true);
      expect(whiteCheckbox.checked).toBe(true);
      expect(navyCheckbox.checked).toBe(false);
    });
  });

  describe('Clear All Filters', () => {
    it('should clear all filters except search query', () => {
      const filters: FilterOptions = {
        category: 'casual',
        priceRange: { min: 1000, max: 2000 },
        sizes: ['M', 'L'],
        colors: ['Black'],
        searchQuery: 'abaya',
      };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const clearBtn = screen.getByText('Clear All');
      fireEvent.click(clearBtn);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        searchQuery: 'abaya',
      });
    });

    it('should clear all filters when no search query exists', () => {
      const filters: FilterOptions = {
        category: 'formal',
        sizes: ['S'],
      };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const clearBtn = screen.getByText('Clear All');
      fireEvent.click(clearBtn);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        searchQuery: undefined,
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for filter sections', () => {
      render(<FilterPanel {...defaultProps} />);
      
      expect(screen.getByRole('region', { name: 'Product filters' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Category filters' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Size filters' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Color filters' })).toBeInTheDocument();
    });

    it('should have proper labels for price inputs', () => {
      render(<FilterPanel {...defaultProps} />);
      
      expect(screen.getByLabelText('Minimum price')).toBeInTheDocument();
      expect(screen.getByLabelText('Maximum price')).toBeInTheDocument();
      expect(screen.getByLabelText('Price range slider')).toBeInTheDocument();
    });

    it('should have proper aria-label for clear button', () => {
      const filters: FilterOptions = { category: 'casual' };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      
      const clearBtn = screen.getByLabelText('Clear all filters');
      expect(clearBtn).toBeInTheDocument();
    });

    it('should have proper aria-labels for category buttons', () => {
      render(<FilterPanel {...defaultProps} />);
      
      expect(screen.getByLabelText('Filter by casual category')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by formal category')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty filters object', () => {
      render(<FilterPanel {...defaultProps} filters={{}} />);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('should handle filters with only search query', () => {
      const filters: FilterOptions = { searchQuery: 'test' };
      render(<FilterPanel {...defaultProps} filters={filters} />);
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('should handle custom available options', () => {
      render(
        <FilterPanel
          {...defaultProps}
          availableCategories={['cat1']}
          availableSizes={['XS']}
          availableColors={['Red']}
        />
      );
      
      expect(screen.getByText('Cat1')).toBeInTheDocument();
      expect(screen.getByText('XS')).toBeInTheDocument();
      expect(screen.getByText('Red')).toBeInTheDocument();
    });

    it('should handle price range at boundaries', () => {
      render(
        <FilterPanel
          {...defaultProps}
          minPrice={0}
          maxPrice={10000}
        />
      );
      
      expect(screen.getByText('0 ETB - 10000 ETB')).toBeInTheDocument();
    });
  });
});
