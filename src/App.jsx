import { ProgressProvider } from './lib/progressContext.jsx';

export default function App() {
  return (
    <ProgressProvider>
      <main data-route="journey">
        <h1 style={{ fontFamily: 'var(--font-display)', padding: '4rem' }}>
          EliteHuman — scaffold ready
        </h1>
      </main>
    </ProgressProvider>
  );
}
