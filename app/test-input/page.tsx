'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TestInputPage() {
  const [inputValue, setInputValue] = useState('');
  
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-2xl font-bold">Test Input Component</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium mb-2">Input Value: {inputValue}</h2>
          <Input
            placeholder="Type something..."
            value={inputValue}
            onChange={(e) => {
              console.log('Input changed:', e.target.value);
              setInputValue(e.target.value);
            }}
            className="w-full max-w-md"
          />
        </div>
        
        <div className="space-x-2">
          <Button onClick={() => setInputValue('')}>Clear</Button>
          <Button onClick={() => alert(`Current value: ${inputValue}`)}>
            Show Value
          </Button>
        </div>
      </div>
    </div>
  );
} 