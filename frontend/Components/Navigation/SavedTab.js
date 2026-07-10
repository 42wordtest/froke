import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../UI/AppHeader';
import { EmptyState, ErrorState, LoadingSkeleton } from '../UI/States';
import SavedLocationCard from '../Locations/SavedLocationCard';
import { fetch, unsaveLocation } from '../../localDatabase/database';
import { colors, spacing } from '../../design/theme';

export default function SavedTab({navigation}) {
  const [loading, setLoading] = useState(true);
  const [savedLocations, setSavedLocations] = useState([]);
  const [error, setError] = useState(null);

  const loadSaved = useCallback(() => {
    setError(null);
    fetch()
      .then((res) => {
        setSavedLocations(JSON.parse(res)._array || []);
      })
      .catch(() => setError('Saved locations could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const removeSaved = (locationId) => {
    unsaveLocation(locationId).then(loadSaved).catch(() => setError('That location could not be removed.'));
  };

  if (loading) return <LoadingSkeleton label="Loading saved locations" />;
  if (error && !savedLocations.length) return <ErrorState message={error} onRetry={loadSaved} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={savedLocations}
      keyExtractor={(item) => String(item.location_id)}
      renderItem={({ item }) => <SavedLocationCard navigation={navigation} location={item} onRemove={removeSaved} />}
      ListHeaderComponent={<AppHeader eyebrow="Your shortlist" title="Saved locations" subtitle="Keep favourite bathing waters close for your next swim." />}
      ListEmptyComponent={<EmptyState title="No saved locations" message="Save locations from a detail page and they will appear here." />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  separator: {
    height: spacing.md,
  },
});
