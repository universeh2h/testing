'use client';

import { useState } from 'react';
import AllCategories from './all-categories';
import { CategoryTypeSelector } from './header-state';

export default function Categories() {
  const [select, setSelect] = useState<string>('gamelainnya');
  return (
    <section className="container mx-auto space-y-4 py-12 ">
      <h1 className="text-3xl font-bold  text-white ">
        <span className="relative inline-block mb-2">
          All Categories
          <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-orange-500 rounded-full"></span>
        </span>
      </h1>
      <CategoryTypeSelector
        initialType={select}
        onTypeChange={(type) => setSelect(type)}
      />
      <AllCategories type={select} />
    </section>
  );
}
