'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBoxProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export function SearchBox({ onSearch, placeholder = "Search..." }: SearchBoxProps) {
  // Local state for the input value
  const [inputValue, setInputValue] = useState('');
  
  // Effect to propagate the value to parent when it changes
  useEffect(() => {
    console.log('SearchBox: Propagating search term:', inputValue);
    onSearch(inputValue);
  }, [inputValue, onSearch]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('SearchBox: Input changed:', newValue);
    setInputValue(newValue);
  }, []);
  
  const handleClear = useCallback(() => {
    console.log('SearchBox: Clearing search term');
    setInputValue('');
  }, []);
  
  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-9 pr-10 w-full"
        value={inputValue}
        onChange={handleChange}
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
} 