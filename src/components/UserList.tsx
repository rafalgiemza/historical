import type { User } from '../types';

interface UserListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onSelectUser: (user: User) => void;
}

export function UserList({ users, loading, error, onSelectUser }: UserListProps) {
  if (loading) {
    return (
      <div class="state-container">
        <div class="spinner" />
        <p>Ładowanie użytkowników…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div class="state-container state-error">
        <p>Błąd: {error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div class="state-container">
        <p>Brak użytkowników w podanym zakresie geograficznym.</p>
        <p class="hint">Spróbuj zwiększyć zakres lat/lng i kliknij „Szukaj".</p>
      </div>
    );
  }

  return (
    <ul class="user-list">
      {users.map((user) => (
        <li key={user.id} class="user-item" onClick={() => onSelectUser(user)}>
          <div class="user-item-main">
            <span class="user-name">{user.name}</span>
            <span class="user-email">{user.email}</span>
          </div>
          <div class="user-item-meta">
            <span class="user-city">{user.address.city}</span>
            <span class="user-geo">
              {parseFloat(user.address.geo.lat).toFixed(2)},{' '}
              {parseFloat(user.address.geo.lng).toFixed(2)}
            </span>
          </div>
          <span class="user-arrow">›</span>
        </li>
      ))}
    </ul>
  );
}
