import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radius, shadows, spacing, typography } from '../../design/theme';

function formatDistance(distance) {
  if (typeof distance !== 'number') return 'Distance unavailable';
  if (distance < 1000) return Math.round(distance) + ' m away';
  return (distance / 1000).toFixed(1) + ' km away';
}

export default function LocationCard({ navigation, location, onOpenMap }) {
  const handlePress = () => {
    navigation.navigate('Single Location', location.location_id);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={'Open ' + location.bathingWaterName}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="water" size={24} color={colors.blue} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2} maxFontSizeMultiplier={1.2}>{location.bathingWaterName}</Text>
        <Text style={styles.point} numberOfLines={2} maxFontSizeMultiplier={1.2}>{location.name}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="navigate-outline" size={15} color={colors.muted} />
          <Text style={styles.meta}>{formatDistance(location.distance)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={handlePress}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="View details"
        >
          <Ionicons name="chevron-forward" size={20} color={colors.blue} />
        </Pressable>
        {onOpenMap ? (
          <Pressable
            onPress={() => onOpenMap(location)}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Open on map"
          >
            <Ionicons name="map-outline" size={20} color={colors.blue} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 132,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    ...shadows.card,
    marginHorizontal: spacing.xl,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  point: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  meta: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
