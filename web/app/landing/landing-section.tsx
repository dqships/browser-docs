/**
 * Standard landing section: full-width ink rule, a mono index label in the
 * left three columns, and content in the remaining nine. See /DESIGN.md §5.
 */
export function LandingSection({
  id,
  index,
  label,
  children,
}: {
  id?: string;
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-t border-ink py-16 md:py-24 scroll-mt-16"
    >
      <div className="page-frame grid gap-y-8 gap-x-6 lg:grid-cols-12">
        <p className="mono-label flex items-center gap-2 text-ink lg:col-span-3 lg:items-start lg:pt-3">
          <span className="red-cell lg:mt-[0.2rem]" aria-hidden="true" />
          <span>
            {index} — {label}
          </span>
        </p>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
