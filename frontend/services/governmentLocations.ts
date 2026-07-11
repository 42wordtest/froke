import AsyncStorage from '@react-native-async-storage/async-storage';
import bundledSamplingPoints from '../data/governmentSamplingPoints.json';

export interface GovernmentLabel {
  _value?: string;
  _lang?: string;
}

export interface GovernmentName {
  _value?: string;
  _datatype?: string;
  _lang?: string;
}

export interface GovernmentBathingWater {
  _about?: string;
  label?: GovernmentLabel[];
  name?: GovernmentName;
}

export interface GovernmentSamplingPoint {
  _about?: string;
  label?: GovernmentLabel[];
  name?: GovernmentName;
  lat?: number;
  long?: number;
  easting?: number;
  northing?: number;
  bathingWater?: GovernmentBathingWater;
}

export interface Location {
  id: string;
  name: string;
  bathingWaterName: string;
  latitude: number;
  longitude: number;
  easting: number | null;
  northing: number | null;
}

export type LegacyLocation = Location & {
  _id: string;
  location_id: number;
  coordinates: [number, number];
  location_name: string;
  location_area: string;
  location_img_url: string;
  body: string;
  avg_rating: number | null;
  review_count: number | null;
  water_classification: string | null;
  water_classification_date: string | null;
  source: 'gov-uk';
};

type CachePayload = {
  savedAt: number;
  locations: LegacyLocation[];
};

type FetchStatusError = Error & { status?: number };

const ENDPOINT =
  'https://location.data.gov.uk/doc/ef/SamplingPoint/bwsp.eaew.json?_view=sampling-point&_pageSize=500';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:9090/api';
const PROXY_ENDPOINT = API_BASE_URL.replace(/\/$/, '') + '/government/sampling-points';
const CACHE_KEY = 'froke.govUkSamplingPoints.v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function firstLabel(labels?: GovernmentLabel[], fallback = 'Unnamed sampling point') {
  const english = labels?.find((label) => label?._lang === 'en' && label?._value);
  return english?._value || labels?.find((label) => label?._value)?._value || fallback;
}

function labelValue(
  name?: GovernmentName,
  labels?: GovernmentLabel[],
  fallback = 'Unnamed sampling point'
) {
  return name?._value || firstLabel(labels, fallback);
}

function makeLocationDescription(bathingWaterName: string, samplingPointName: string) {
  const cleanSamplingPoint = samplingPointName.replace(/^Sampling point at\s+/i, '');
  if (cleanSamplingPoint && cleanSamplingPoint !== bathingWaterName) {
    return `${bathingWaterName} is an official bathing water location monitored by the UK Government. This sampling point is recorded as ${cleanSamplingPoint}, so use it as the precise reference point for water-quality checks and map directions.`;
  }

  return `${bathingWaterName} is an official UK Government bathing water sampling point. Use this listing as the precise reference point for map directions and water-quality information.`;
}

function locationIdFromAbout(about: string) {
  const lastPathPart = about.split('/').filter(Boolean).pop() || about;
  const digits = lastPathPart.match(/\d+/g)?.join('');
  if (digits) return Number.parseInt(digits, 10);

  let hash = 0;
  for (let index = 0; index < about.length; index += 1) {
    hash = (hash * 31 + about.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function getItems(payload: unknown): GovernmentSamplingPoint[] {
  if (!payload || typeof payload !== 'object') return [];
  const candidate = payload as { result?: { items?: unknown }; items?: unknown };
  if (Array.isArray(candidate.result?.items))
    return candidate.result.items as GovernmentSamplingPoint[];
  if (Array.isArray(candidate.items)) return candidate.items as GovernmentSamplingPoint[];
  return [];
}

export function transformSamplingPoint(point: GovernmentSamplingPoint): LegacyLocation | null {
  if (!point || typeof point !== 'object') return null;
  if (!point._about || typeof point._about !== 'string') return null;
  if (typeof point.lat !== 'number' || typeof point.long !== 'number') return null;
  if (!Number.isFinite(point.lat) || !Number.isFinite(point.long)) return null;

  const name = labelValue(point.name, point.label);
  const bathingWaterName = labelValue(point.bathingWater?.name, point.bathingWater?.label, name);
  const id = point._about;
  const location_id = locationIdFromAbout(id);

  return {
    id,
    name,
    bathingWaterName,
    latitude: point.lat,
    longitude: point.long,
    easting: typeof point.easting === 'number' ? point.easting : null,
    northing: typeof point.northing === 'number' ? point.northing : null,
    _id: id,
    location_id,
    coordinates: [point.long, point.lat],
    location_name: bathingWaterName,
    location_area: name,
    location_img_url: DEFAULT_IMAGE,
    body: makeLocationDescription(bathingWaterName, name),
    avg_rating: null,
    review_count: null,
    water_classification: null,
    water_classification_date: null,
    source: 'gov-uk',
  };
}

async function readCachedLocations(allowStale = true): Promise<LegacyLocation[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (!Array.isArray(parsed.locations)) return null;
    const isFresh = Date.now() - parsed.savedAt < CACHE_TTL_MS;
    return isFresh || allowStale ? parsed.locations : null;
  } catch {
    return null;
  }
}

async function cacheLocations(locations: LegacyLocation[]) {
  const payload: CachePayload = { savedAt: Date.now(), locations };
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

async function requestJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    const error = new Error('Government API returned ' + response.status) as FetchStatusError;
    error.status = response.status;
    throw error;
  }
  return await response.json();
}

async function requestWithRetries(retries = 2): Promise<unknown> {
  let lastError: unknown;
  const endpoints = [ENDPOINT, PROXY_ENDPOINT];

  for (const endpoint of endpoints) {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await requestJson(endpoint);
      } catch (error) {
        lastError = error;
        if (endpoint === ENDPOINT && (error as FetchStatusError).status === 403) break;
        if (attempt < retries) await delay(350 * (attempt + 1));
      }
    }
  }

  throw lastError;
}

function transformPayload(payload: unknown): LegacyLocation[] {
  return getItems(payload)
    .map(transformSamplingPoint)
    .filter((location): location is LegacyLocation => Boolean(location));
}

function getBundledLocations(): LegacyLocation[] {
  return transformPayload(bundledSamplingPoints);
}

export async function fetchGovernmentLocations(
  options: { forceRefresh?: boolean } = {}
): Promise<LegacyLocation[]> {
  const bundledLocations = getBundledLocations();
  if (bundledLocations.length) {
    await cacheLocations(bundledLocations);
    return bundledLocations;
  }

  if (!options.forceRefresh) {
    const freshCache = await readCachedLocations(false);
    if (freshCache?.length) return freshCache;
  }

  try {
    const locations = transformPayload(await requestWithRetries());

    if (!locations.length) throw new Error('Government API returned no valid sampling points');
    await cacheLocations(locations);
    return locations;
  } catch (error) {
    const staleCache = await readCachedLocations(true);
    if (staleCache?.length) return staleCache;
    throw error;
  }
}

export async function getGovernmentLocationById(
  locationId: string | number
): Promise<LegacyLocation> {
  const locations = await fetchGovernmentLocations();
  const normalized = String(locationId);
  const location = locations.find(
    (item) => String(item.location_id) === normalized || item.id === normalized
  );
  if (!location) throw new Error('Location not found');
  return location;
}
