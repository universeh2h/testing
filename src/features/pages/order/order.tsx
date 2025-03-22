import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlansOrder } from './plans';
import { usePlansStore } from '@/hooks/use-select-plan';
import { PlansProps, SubCategories } from '@/types/category';
import { matchProductToCategory } from './components/match-product-to-cat';

interface OrderPageProps {
  plans: PlansProps[]  |  undefined
  subCategories: SubCategories[];
}

export function OrderPage({ plans, subCategories }: OrderPageProps) {
  // States
  const [selectedCategory, setSelectedCategory] =
    useState<SubCategories | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<PlansProps[]>([]);
  const [effectiveSubCategories, setEffectiveSubCategories] = useState<
    SubCategories[]
  >([]);
  const { selectPlans, setSelectPlans } = usePlansStore();

  const defaultTopUpCategory = useMemo(
    () => ({
      name: 'Top-up',
      id: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      code: 'top-up',
      categoryId: 0,
      active: true,
    }),
    []
  );
  useEffect(() => {
    if (!subCategories || subCategories.length === 0) {
      setEffectiveSubCategories([defaultTopUpCategory]);
      return;
    }

    const hasTopUp = subCategories.some(
      (cat) =>
        cat.name.toLowerCase() === 'top-up' ||
        cat.code?.toLowerCase() === 'top-up'
    );

    const processed = hasTopUp
      ? [...subCategories]
      : [...subCategories, defaultTopUpCategory];

    setEffectiveSubCategories(processed);
  }, [subCategories, defaultTopUpCategory]);

  useEffect(() => {
    if (effectiveSubCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(effectiveSubCategories[0]);
    }
  }, [effectiveSubCategories, selectedCategory]);

  useEffect(() => {
    if (!selectedCategory || !Array.isArray(plans)) {
      return;
    }

    let filtered: PlansProps[] = [];

    if (
      selectedCategory.id === 0 ||
      selectedCategory.name.toLowerCase() === 'top-up'
    ) {
      const realCategoryIds = effectiveSubCategories
        .filter((cat) => cat.id !== 0 && cat.name.toLowerCase() !== 'top-up')
        .map((cat) => cat.id);

      filtered = plans.filter(
        (plan) => !realCategoryIds.includes(Number(plan.subCategoryId))
      );
    } else {
      // Logika untuk kategori lainnya
      filtered = plans.filter((plan) =>
        matchProductToCategory(plan, selectedCategory)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, plans, effectiveSubCategories]);

  const handleCategoryChange = (category: SubCategories) => {
    setSelectedCategory(category);
    setSelectPlans(null);
  };

  const handleSelect = (plan: PlansProps) => {
    setSelectPlans(plan);
  };

  return (
    <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50 space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Pilih Package</h2>

      {/* Category selection */}
      {effectiveSubCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {effectiveSubCategories.map((category) => (
            <Button
              key={category.id}
              className={`bg-blue-800 rounded-full hover:bg-blue-700 ${
                selectedCategory?.id === category.id ? 'bg-blue-500' : ''
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          filteredProducts.map((plan, idx) => (
            <PlansOrder
              key={`${plan.providerId || plan.id}-${idx}`}
              plan={plan}
              onSelect={handleSelect}
              isSelected={selectPlans?.providerId === plan.providerId}
            />
          ))
        ) : (
          <p className="text-white col-span-3 text-center py-4">
            No products available for this category
          </p>
        )}
      </div>
    </div>
  );
}
