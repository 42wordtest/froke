import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDistance } from 'geolib';
import AppHeader from '../UI/AppHeader';
import SearchBar from '../UI/SearchBar';
import { EmptyState, ErrorState } from '../UI/States';
import LocationCard from '../Locations/LocationCard';
import { getLocations } from '../../api';
import { colors, radius, spacing, typography } from '../../design/theme';

const filters = ['Nearest', 'A-Z'];

export default function HomeTab({ navigation, route }) {
  const initialLocations = route.params?.locations || [];
  const [locations, setLocations] = useState(initialLocations);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Nearest');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const filteredLocations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = locations.filter((location) => {
      if (!normalized) return true;
      return (
        location.bathingWaterName.toLowerCase().includes(normalized) ||
        location.name.toLowerCase().includes(normalized)
      );
    });

    return matches.sort((a, b) => {
      if (filter === 'A-Z') return a.bathingWaterName.localeCompare(b.bathingWaterName);
      return (a.distance ?? Number.MAX_SAFE_INTEGER) - (b.distance ?? Number.MAX_SAFE_INTEGER);
    });
  }, [locations, query, filter]);

  const refresh = () => {
    setRefreshing(true);
    setError(null);
    getLocations({ forceRefresh: true })
      .then(({ locations: nextLocations }) => {
        const userCoords = route.params?.userCoords;
        const withDistance = nextLocations.map((location) => {
          if (!userCoords) return location;
          return {
            ...location,
            distance: getDistance(userCoords, { latitude: location.latitude, longitude: location.longitude }),
          };
        });
        setLocations(withDistance);
      })
      .catch(() => setError('The official bathing water feed is unavailable right now.'))
      .finally(() => setRefreshing(false));
  };

  const header = (
    <>
      <AppHeader
        eyebrow="Official UK data"
        title="Find safe places to swim"
        subtitle="Browse government bathing water sampling points across England and Wales."
      />
      <View style={styles.controls}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search bathing waters" />
        <View style={styles.filters} accessibilityRole="tablist">
          {filters.map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              accessibilityRole="tab"
              accessibilityState={{ selected: filter === item }}
              style={[styles.filter, filter === item && styles.filterActive]}
            >
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Text style={styles.count}>{filteredLocations.length} locations</Text>
    </>
  );

  if (error && !locations.length) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={filteredLocations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <LocationCard navigation={navigation} location={item} />}
      ListHeaderComponent={header}
      ListEmptyComponent={<EmptyState title="No bathing waters found" message="Try another search term or refresh the official feed." />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.blue} />}
      initialNumToRender={12}
      maxToRenderPerBatch={12}
      windowSize={7}
      removeClippedSubviews
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingBottom: 120,
  },
  controls: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    padding: spacing.xs,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  filter: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterActive: {
    backgroundColor: colors.surface,
  },
  filterText: {
    color: colors.muted,
    fontWeight: '700',
  },
  filterTextActive: {
    color: colors.blue,
  },
  count: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '700',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  separator: {
    height: spacing.md,
  },
});
