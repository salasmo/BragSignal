export interface Crumb {
  label: string;
  href: string;
}

export default function Breadcrumbs({ items, siteUrl }: { items: Crumb[]; siteUrl: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${siteUrl}${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-white/50">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span className="text-vital-400" aria-current="page">
                {item.label}
              </span>
            ) : (
              <a href={item.href} className="transition-colors hover:text-vital-400">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
