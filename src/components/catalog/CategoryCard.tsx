import { ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { Category } from '../../data/categories';
import { localeFromPath } from '../../lib/routing';
import { assetPath } from '../../lib/basePath';
import { CategoryIcon } from '../ui/CategoryIcon';
import { useLocalPath } from '../ui/Primitives';
export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const locale = localeFromPath(useLocation().pathname);
  const path = useLocalPath();
  return (
    <Link
      to={path(`/catalogo/${category.slug}`)}
      className={`category-card category-${category.icon}`}
    >
      <div className="category-card-top">
        <span className="category-number">{String(index + 1).padStart(2, '0')}</span>
        <ArrowUpRight size={19} />
      </div>
      <div
        className={`category-illustration${category.image ? ' category-illustration-photo' : ''}`}
      >
        {category.image ? (
          <img
            className="category-card-photo"
            src={assetPath(category.image)}
            alt=""
            width="960"
            height="640"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <CategoryIcon name={category.icon} size={84} strokeWidth={0.9} />
            <span className="part-orbit" />
          </>
        )}
      </div>
      <div className="category-card-body">
        <h3>{category.name[locale]}</h3>
        <p>{category.families[locale].join(' · ')}</p>
      </div>
    </Link>
  );
}
