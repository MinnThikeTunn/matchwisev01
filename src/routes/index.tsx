import { createFileRoute } from '@tanstack/react-router';
import { ClientOnly } from '@tanstack/react-router';
import App from '../App';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Matchwise Prism — Context-Aware Human Matching' },
      {
        name: 'description',
        content:
          'Deterministic 3-tier algorithm scoring, Prism Spectrum visualization, and explainable AI synergy metrics for human matching.',
      },
      { property: 'og:title', content: 'Matchwise Prism — Context-Aware Human Matching' },
      {
        property: 'og:description',
        content: 'Deterministic scoring, Prism Spectrum visualization, and explainable synergy metrics.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-[#FAFBFD]" />}>
      <App />
    </ClientOnly>
  );
}
