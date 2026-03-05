import { useState, useEffect, useMemo } from 'preact/hooks';
import { Header } from './components/Header';
import { UserList } from './components/UserList';
import { Drawer } from './components/Drawer';
import { getMockGeolocation } from './services/geo';
import { fetchAllUsers } from './services/api';
import type { AsyncState, GeoLocation, User } from './types';
import './app.css';

const DEFAULT_LAT_RANGE = 10;
const DEFAULT_LNG_RANGE = 10;

function filterUsers(
  users: User[],
  center: GeoLocation,
  latRange: number,
  lngRange: number,
): User[] {
  return users.filter((user) => {
    const userLat = parseFloat(user.address.geo.lat);
    const userLng = parseFloat(user.address.geo.lng);
    return Math.abs(userLat - center.lat) <= latRange && Math.abs(userLng - center.lng) <= lngRange;
  });
}

export function App() {
  const [myLocation, setMyLocation] = useState<GeoLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const [users, setUsers] = useState<AsyncState<User[]>>({ data: null, loading: true, error: null });

  const [activeFilter, setActiveFilter] = useState({
    lat: DEFAULT_LAT_RANGE,
    lng: DEFAULT_LNG_RANGE,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch mock geolocation on mount (~100ms simulated delay)
  useEffect(() => {
    getMockGeolocation()
      .then((loc) => {
        setMyLocation(loc);
        setLocationLoading(false);
      })
      .catch(() => setLocationLoading(false));
  }, []);

  // Fetch all users on mount
  useEffect(() => {
    fetchAllUsers()
      .then((data) => setUsers({ data, loading: false, error: null }))
      .catch((err: Error) => setUsers({ data: null, loading: false, error: err.message }));
  }, []);

  // Derive filtered users reactively
  const filteredUsers = useMemo(() => {
    if (!myLocation || !users.data) return [];
    return filterUsers(users.data, myLocation, activeFilter.lat, activeFilter.lng);
  }, [myLocation, users.data, activeFilter]);

  const handleSearch = (lat: number, lng: number) => {
    setActiveFilter({ lat, lng });
    // Reflect search params in the URL (simulates backend GET /api/users?lat=X&lng=Y)
    const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  const isLoading = users.loading || locationLoading;

  return (
    <div class="app-layout">
      <Header
        myLocation={myLocation}
        locationLoading={locationLoading}
        onSearch={handleSearch}
      />
      <main class="app-main">
        {!isLoading && !users.error && (
          <p class="results-count">
            Wyświetlanie {filteredUsers.length} z {users.data?.length ?? 0} użytkowników
          </p>
        )}
        <UserList
          users={filteredUsers}
          loading={isLoading}
          error={users.error}
          onSelectUser={setSelectedUser}
        />
      </main>
      <Drawer user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
