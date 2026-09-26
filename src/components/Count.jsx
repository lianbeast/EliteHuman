import { useTally } from '../lib/tally.js';

// A number that counts up to `to` once it enters the viewport.
//
// Renders the final value immediately under reduced motion, so the figure is
// never left at zero — the count is a garnish, the number is the content.
export function Count({ to, className, ...rest }) {
  const [shown, ref] = useTally(to);
  return (
    <span ref={ref} className={`meta tabular ${className ?? ''}`.trim()} {...rest}>
      {String(shown).padStart(String(to).length, '0')}
    </span>
  );
}