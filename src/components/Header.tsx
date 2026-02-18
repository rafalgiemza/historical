import { useState } from 'preact/hooks';
import type { GeoLocation } from '../types';

interface HeaderProps {
  myLocation: GeoLocation | null;
  locationLoading: boolean;
  onSearch: (latRange: number, lngRange: number) => void;
}

const DEFAULT_LAT = 10;
const DEFAULT_LNG = 10;

export function Header({ myLocation, locationLoading, onSearch }: HeaderProps) {
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lng, setLng] = useState(DEFAULT_LNG);

  return (
    <header class="header">
      <div class="header-left">
        <span class="header-title">User Explorer</span>
        {locationLoading && <span class="geo-badge geo-loading">Pobieranie lokalizacji…</span>}
        {!locationLoading && myLocation && (
          <span class="geo-badge geo-info">
            Twoja pozycja: {myLocation.lat.toFixed(4)}, {myLocation.lng.toFixed(4)}
          </span>
        )}
      </div>

      <div class="header-right">
        <label class="filter-label">
          <span class="filter-label-text">lat ±</span>
          <input
            type="number"
            class="filter-input"
            value={lat}
            min={0}
            step={1}
            onInput={(e) => setLat(Number((e.target as HTMLInputElement).value))}
          />
        </label>
        <label class="filter-label">
          <span class="filter-label-text">lng ±</span>
          <input
            type="number"
            class="filter-input"
            value={lng}
            min={0}
            step={1}
            onInput={(e) => setLng(Number((e.target as HTMLInputElement).value))}
          />
        </label>
        <button class="btn-search" onClick={() => onSearch(lat, lng)}>
          Szukaj
        </button>
      </div>
    </header>
  );
}
