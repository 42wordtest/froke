import { useMemo, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Rect, Stop } from 'react-native-svg';
import SearchBar from '../UI/SearchBar';
import { EmptyState } from '../UI/States';
import { PrimaryButton, SecondaryButton } from '../UI/PrimaryButton';
import { colors, radius, shadows, spacing, typography } from '../../design/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEFAULT_REGION = {
  latitude: 53.45,
  longitude: -2.9,
  latitudeDelta: 7.4,
  longitudeDelta: 7.4,
};

function MapPinIcon() {
  return (
    <Svg width={24} height={44} viewBox="0 0 96 150" accessibilityLabel="Location pin">
      <Defs>
        <LinearGradient id="pinFace" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FF4A69" />
          <Stop offset="0.58" stopColor="#E62D4F" />
          <Stop offset="1" stopColor="#B91533" />
        </LinearGradient>
        <LinearGradient id="pinStem" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#050505" />
          <Stop offset="0.5" stopColor="#242424" />
          <Stop offset="1" stopColor="#050505" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="50" cy="143" rx="7" ry="3" fill="#000000" opacity="0.16" />
      <Rect x="47" y="51" width="4" height="86" rx="2" fill="url(#pinStem)" />
      <Circle cx="49" cy="33" r="23" fill="#000000" />
      <Circle cx="49" cy="33" r="20" fill="url(#pinFace)" />
      <Ellipse cx="42" cy="25" rx="10" ry="6" fill="#FFFFFF" opacity="0.48" />
      <Ellipse cx="39" cy="22" rx="4" ry="3" fill="#FFFFFF" opacity="0.62" />
      <Circle cx="49" cy="33" r="18" fill="none" stroke="#FF7E95" strokeWidth="1" opacity="0.48" />
      <Ellipse cx="49" cy="43" rx="16" ry="5" fill="#8C1024" opacity="0.14" />
      <Circle cx="49" cy="33" r="23" fill="none" stroke="#000000" strokeWidth="1.8" />
    </Svg>
  );
}

function clusterPrecisionForRegion(region) {
  const delta = region?.longitudeDelta ?? DEFAULT_REGION.longitudeDelta;
  if (delta <= 0.08) return null;
  if (delta <= 0.25) return 120;
  if (delta <= 0.75) return 45;
  if (delta <= 2) return 18;
  if (delta <= 5) return 8;
  return 4;
}

function locationsWithinRegion(locations, region) {
  if (!region) return locations;

  const latitudePadding = region.latitudeDelta * 0.65;
  const longitudePadding = region.longitudeDelta * 0.65;
  const minLatitude = region.latitude - latitudePadding;
  const maxLatitude = region.latitude + latitudePadding;
  const minLongitude = region.longitude - longitudePadding;
  const maxLongitude = region.longitude + longitudePadding;

  return locations.filter(
    (location) =>
      location.latitude >= minLatitude &&
      location.latitude <= maxLatitude &&
      location.longitude >= minLongitude &&
      location.longitude <= maxLongitude
  );
}

function clusterLocations(locations, region) {
  const precision = clusterPrecisionForRegion(region);
  if (!precision) {
    return locations.map((location) => ({
      id: location.id,
      count: 1,
      latitude: location.latitude,
      longitude: location.longitude,
      locations: [location],
    }));
  }

  const buckets = new Map();
  locations.forEach((location) => {
    const key =
      Math.round(location.latitude * precision) + ':' + Math.round(location.longitude * precision);
    const existing = buckets.get(key) || { locations: [], latitude: 0, longitude: 0 };
    existing.locations.push(location);
    existing.latitude += location.latitude;
    existing.longitude += location.longitude;
    buckets.set(key, existing);
  });

  return Array.from(buckets.entries()).map(([key, bucket]) => ({
    id: key,
    count: bucket.locations.length,
    latitude: bucket.latitude / bucket.locations.length,
    longitude: bucket.longitude / bucket.locations.length,
    locations: bucket.locations,
  }));
}

export default function MapTab({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const locations = route.params?.locations || [];
  const userCoords = route.params?.userCoords;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [region, setRegion] = useState(
    userCoords ? { ...userCoords, latitudeDelta: 1.2, longitudeDelta: 1.2 } : DEFAULT_REGION
  );

  const visibleLocations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return locations;
    return locations.filter(
      (location) =>
        location.bathingWaterName.toLowerCase().includes(normalized) ||
        location.name.toLowerCase().includes(normalized)
    );
  }, [locations, query]);

  const viewportLocations = useMemo(
    () => locationsWithinRegion(visibleLocations, region),
    [visibleLocations, region]
  );
  const clusters = useMemo(
    () => clusterLocations(viewportLocations, region),
    [viewportLocations, region]
  );

  const focusLocation = (location) => {
    setSelectedCluster(null);
    setSelected(location);
    mapRef.current?.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      },
      350
    );
  };

  const focusCluster = (cluster) => {
    if (cluster.count === 1) {
      focusLocation(cluster.locations[0]);
      return;
    }

    setSelected(null);
    setSelectedCluster(cluster);
    const nextDelta = Math.max((region?.latitudeDelta ?? 1) / 3, 0.04);
    mapRef.current?.animateToRegion(
      {
        latitude: cluster.latitude,
        longitude: cluster.longitude,
        latitudeDelta: nextDelta,
        longitudeDelta: nextDelta,
      },
      350
    );
  };

  const locateMe = () => {
    if (!userCoords) return;
    mapRef.current?.animateToRegion(
      {
        ...userCoords,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      },
      350
    );
  };

  const openDirections = () => {
    if (!selected) return;
    const url =
      'https://www.google.com/maps/dir/?api=1&destination=' +
      selected.latitude +
      ',' +
      selected.longitude;
    Linking.openURL(url);
  };

  if (!locations.length) {
    return (
      <EmptyState
        title="No map locations"
        message="The official bathing water feed did not return any valid coordinates."
      />
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsCompass={false}
      >
        {clusters.map((cluster) => (
          <Marker
            key={cluster.id}
            coordinate={{ latitude: cluster.latitude, longitude: cluster.longitude }}
            tracksViewChanges={false}
            onPress={() => focusCluster(cluster)}
          >
            {cluster.count > 1 ? (
              <View style={styles.clusterMarker}>
                <Text style={styles.markerText}>{cluster.count}</Text>
              </View>
            ) : (
              <View style={styles.pinMarker}>
                <MapPinIcon />
              </View>
            )}
          </Marker>
        ))}
      </MapView>

      <View style={[styles.searchWrap, { top: insets.top + spacing.md }]}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search the map" />
      </View>

      <Pressable
        style={[
          styles.locateButton,
          { bottom: selected || selectedCluster ? 210 + insets.bottom : 110 + insets.bottom },
        ]}
        onPress={locateMe}
        accessibilityRole="button"
        accessibilityLabel="Locate me"
      >
        <Ionicons name="locate" color={colors.blue} size={24} />
      </Pressable>

      {selectedCluster ? (
        <View style={[styles.sheet, { bottom: insets.bottom + spacing.lg }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{selectedCluster.count} locations here</Text>
          <Text style={styles.sheetSubtitle}>Zoom in further or choose one below.</Text>
          <ScrollView style={styles.clusterList} contentContainerStyle={styles.clusterListContent}>
            {selectedCluster.locations.map((location) => (
              <Pressable
                key={location.id}
                style={styles.clusterItem}
                onPress={() => focusLocation(location)}
                accessibilityRole="button"
                accessibilityLabel={'Select ' + location.bathingWaterName}
              >
                <Text style={styles.clusterItemTitle}>{location.bathingWaterName}</Text>
                <Text style={styles.clusterItemSubtitle}>{location.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {selected ? (
        <View style={[styles.sheet, { bottom: insets.bottom + spacing.lg }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{selected.bathingWaterName}</Text>
          <Text style={styles.sheetSubtitle}>{selected.name}</Text>
          <Text style={styles.coordinates}>
            {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}
          </Text>
          <View style={styles.sheetActions}>
            <PrimaryButton label="Directions" onPress={openDirections} />
            <SecondaryButton
              label="View details"
              onPress={() => navigation.navigate('Single Location', selected.location_id)}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
  },
  searchWrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
  },
  locateButton: {
    position: 'absolute',
    right: spacing.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  pinMarker: {
    width: 24,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  clusterMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D92D20',
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '800',
  },
  sheet: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  sheetSubtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  coordinates: {
    color: colors.blueDark,
    fontSize: typography.small,
    fontWeight: '700',
  },
  clusterList: {
    maxHeight: 160,
    marginTop: spacing.sm,
  },
  clusterListContent: {
    gap: spacing.sm,
  },
  clusterItem: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: colors.surfaceMuted,
  },
  clusterItemTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  clusterItemSubtitle: {
    color: colors.muted,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
