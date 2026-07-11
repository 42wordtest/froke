import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radius, shadows, spacing, typography } from '../../design/theme';

export default function SavedLocationCard({ navigation, location, onRemove }) {
  const handlePress = () => {
    navigation.navigate('Single Location', location.location_id);
  };

  const handleDirections = () => {
    const directionsLink =
      'https://www.google.com/maps/dir/?api=1&destination=' +
      location.latitude +
      ',' +
      location.longitude;
    Linking.openURL(directionsLink).catch((error) => {
      console.error('Error opening directions link:', error);
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={'Open saved location ' + location.location_name}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="bookmark" size={22} color={colors.blue} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {location.location_name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {location.location_area}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={styles.iconButton}
          onPress={handleDirections}
          accessibilityRole="button"
          accessibilityLabel="Get directions"
        >
          <Ionicons name="navigate-outline" size={21} color={colors.blue} />
        </Pressable>
        {onRemove ? (
          <Pressable
            style={styles.iconButton}
            onPress={() => onRemove(location.location_id)}
            accessibilityRole="button"
            accessibilityLabel="Remove saved location"
          >
            <Ionicons name="trash-outline" size={21} color={colors.danger} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 112,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    ...shadows.card,
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
  title: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
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
