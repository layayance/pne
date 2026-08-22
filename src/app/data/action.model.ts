export interface AssociationAction {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  description: string;
  videoUrl?: string;
  posterUrl?: string;
  imageUrls?: string[];
}

export const INITIAL_ACTIONS: AssociationAction[] = [
  {
    id: 'distribution-solidaire-ete-2026',
    title: 'Distribution solidaire – été 2026',
    date: '2026-07-20',
    category: 'Solidarité locale',
    summary: 'Une action de proximité menée au contact direct des habitants.',
    description:
      'Paris Nord Élite s’est mobilisée sur le terrain pour apporter une aide concrète et créer un moment de solidarité avec les habitants.',
    videoUrl: '/media/actions/distribution-solidaire-ete-2026.mp4',
    posterUrl: '/media/actions/distribution-solidaire-ete-2026.png',
    imageUrls: [],
  },
];
