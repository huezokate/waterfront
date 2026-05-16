import { Link } from 'react-router-dom';
import type { Group } from '../data/locations';

interface Props {
  group: Group;
  index?: number;
}

const GROUP_GRADIENTS: Record<string, string> = {
  waterfront: 'linear-gradient(160deg, #aad7ee 0%, #5a9cc0 50%, #2a6a90 100%)',
  cultural:   'linear-gradient(160deg, #f6e8b0 0%, #d4a830 50%, #a07828 100%)',
  parks:      'linear-gradient(160deg, #b8dfc8 0%, #4a9e70 50%, #2a7248 100%)',
  civic:      'linear-gradient(160deg, #f5c0a8 0%, #da4c29 50%, #a03018 100%)',
};

export default function GroupCard({ group, index = 0 }: Props) {
  const gradient = GROUP_GRADIENTS[group.id] ?? GROUP_GRADIENTS['waterfront'];
  const delay = `${index * 0.07}s`;

  return (
    <Link
      to={`/group/${group.id}`}
      className="group-card animate-fade-up"
      style={{ animationDelay: delay }}
      aria-label={`${group.name}: ${group.tagline}. ${group.locationCount} locations, ${group.eraRange[0]} to ${group.eraRange[1]}.`}
    >
      <div className="group-card__bg">
        <div className="group-card__gradient" style={{ background: gradient }} aria-hidden="true" />
        <div className="group-card__overlay" aria-hidden="true" />
      </div>
      <div className="group-card__content">
        <div className="group-card__name">{group.name}</div>
        <div className="group-card__tagline">{group.tagline}</div>
        <div className="group-card__meta">
          <span
            className="group-card__meta-pill"
            style={{ color: group.accentColor, borderColor: group.accentColor }}
          >
            {group.eraRange[0]}–{group.eraRange[1]}
          </span>
        </div>
        <div style={{ marginTop: 5, fontFamily: 'var(--font-ui)', fontSize: 9, color: 'rgba(246,251,253,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
          {group.locationCount} locations
        </div>
      </div>
      <div className="group-card__era-bar" style={{ background: group.accentColor }} aria-hidden="true" />
    </Link>
  );
}
