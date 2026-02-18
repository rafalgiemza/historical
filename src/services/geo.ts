import type { GeoLocation } from '../types';

// Mock location in the southern Indian Ocean – near several JSONPlaceholder users
const MOCK_LOCATION: GeoLocation = { lat: -35.0, lng: 65.0 };

export async function getMockGeolocation(): Promise<GeoLocation> {
  await new Promise<void>((resolve) => setTimeout(resolve, 100));
  return { ...MOCK_LOCATION };
}
