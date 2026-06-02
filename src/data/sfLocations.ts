export interface SFLocation {
  id: string;
  no: number;
  name: string;
  neighborhood: string;
  range: string;
  themes: string[];
  status: 'live' | 'soon';
  route?: string;
  hero: string;
  dek: string;
}

export const THEMES = ['Waterfront', 'Gold Rush', 'Earthquake', 'Maritime', 'Civic'];

// Cold-start catalog: one fully-built location + curated stubs (structure over content).
export const SF_LOCATIONS: SFLocation[] = [
  {
    id: 'yerba-buena', no: 4, name: 'Yerba Buena Cove', neighborhood: 'The Embarcadero',
    range: '1833 – 2027', themes: ['Waterfront', 'Gold Rush', 'Maritime'], status: 'live',
    route: '/yerba-buena', hero: '/historic/4-1-4a-1848-view-of-sf-harbor-house-count.jpg',
    dek: 'The cove that became a city — sand dunes to skyline in a single lifetime.',
  },
  {
    id: 'portsmouth-square', no: 5, name: 'Portsmouth Square', neighborhood: 'Chinatown',
    range: '1846 – today', themes: ['Civic', 'Gold Rush'], status: 'soon',
    hero: '/historic/4-2-1a-1850-san-francisco-portsmouth-sq-east-west-views.jpg',
    dek: 'Where the Stars and Stripes first flew over the village in 1846.',
  },
  {
    id: 'long-wharf', no: 6, name: 'Long Wharf', neighborhood: 'Financial District',
    range: '1849 – 1870s', themes: ['Maritime', 'Waterfront'], status: 'soon',
    hero: '/historic/4-2-2b-1851-may-4th-fire-from-long-wharf-commercial-st.jpg',
    dek: 'A half-mile pier driven into the bay, later buried under landfill.',
  },
  {
    id: 'ferry-building', no: 7, name: 'Ferry Building', neighborhood: 'Embarcadero',
    range: '1885 – today', themes: ['Maritime', 'Earthquake'], status: 'soon',
    hero: '/historic/4-3-4f-photo-1906-eq-fire-ferry-bldg.jpg',
    dek: 'The clock tower that stood through the 1906 earthquake and fire.',
  },
];
