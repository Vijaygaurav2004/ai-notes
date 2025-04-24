'use client';

import { useState } from 'react';
import { SearchBox } from '@/components/dashboard/search-box';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data
const sampleData = [
  { id: 1, title: 'React Hooks', content: 'Understanding useState and useEffect in React applications' },
  { id: 2, title: 'TypeScript Types', content: 'How to define proper interfaces and types' },
  { id: 3, title: 'Next.js App Router', content: 'Learning the new app directory structure' },
  { id: 4, title: 'CSS Grid Layout', content: 'Creating responsive layouts with CSS Grid' },
  { id: 5, title: 'JavaScript Promises', content: 'Async/await and Promise chaining patterns' },
];

export default function TestSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter function
  const filteredItems = sampleData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-2xl font-bold">Test Search Component</h1>
      
      <div className="space-y-6">
        <div className="w-full max-w-md">
          <SearchBox 
            placeholder="Search items..."
            onSearch={setSearchTerm}
          />
        </div>
        
        <div className="border rounded p-4 bg-muted/10">
          <h2 className="text-lg font-medium mb-2">Debug Info</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ searchTerm, itemCount: filteredItems.length }, null, 2)}
          </pre>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {filteredItems.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.content}</p>
              </CardContent>
            </Card>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full p-12 text-center border border-dashed rounded">
              No items found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 