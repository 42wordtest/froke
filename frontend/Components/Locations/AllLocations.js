
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../UI/AppHeader';
import SearchBar from '../UI/SearchBar';
import { EmptyState, ErrorState, LoadingSkeleton } from '../UI/States';
import LocationCard from './LocationCard';
import { getLocations } from '../../api';
import { colors, spacing } from '../../design/theme';

export default function AllLocations({ navigation }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const loadLocations = () => {
    setLoading(true);
    setError(null);
    getLocations()
      .then(({ locations }) => setLocations(locations))
      .catch(() => setError('Official bathing water locations could not be loaded.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const filteredLocations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return locations
      .filter((location) => {
        if (!normalized) return true;
        return location.bathingWaterName.toLowerCase().includes(normalized) || location.name.toLowerCase().includes(normalized);
      })
      .sort((a, b) => a.bathingWaterName.localeCompare(b.bathingWaterName));
  }, [locations, query]);

  if (loading) return <LoadingSkeleton label="Loading all bathing waters" />;
  if (error) return <ErrorState message={error} onRetry={loadLocations} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={filteredLocations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <LocationCard navigation={navigation} location={item} />}
      ListHeaderComponent={
        <>
          <AppHeader eyebrow="Directory" title="All bathing waters" subtitle="Official UK Government sampling points, sorted alphabetically." />
          <View style={styles.searchWrap}>
            <SearchBar value={query} onChangeText={setQuery} placeholder="Search all locations" />
          </View>
        </>
      }
      ListEmptyComponent={<EmptyState title="No locations found" message="Try changing your search term." />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      initialNumToRender={14}
      maxToRenderPerBatch={14}
      windowSize={8}
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
    paddingBottom: 100,
  },
  searchWrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
});
