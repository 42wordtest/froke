import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { saveLocation, unsaveLocation } from '../../localDatabase/database.js';
import { colors, radius, shadows, spacing, typography } from '../../design/theme';

export default function SingleLocationContainer({ location, averageRating, saved }) {
  const [savedClicked, setSavedClicked] = useState(saved ? true : false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (saving) return;
    setSaving(true);
    if (!savedClicked) {
      saveLocation(location)
        .then(() => setSavedClicked(true))
        .catch((err) => console.log(err))
        .finally(() => setSaving(false));
    } else {
      unsaveLocation(location.location_id)
        .then(() => setSavedClicked(false))
        .finally(() => setSaving(false));
    }
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
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <Ionicons name="water" size={34} color={colors.blue} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.eyebrow}>Bathing water</Text>
          <Text style={styles.title}>{location.bathingWaterName || location.location_name}</Text>
          <Text style={styles.subtitle}>{location.name || location.location_area}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionButton}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Save location"
        >
          <Ionicons
            name={savedClicked ? 'bookmark' : 'bookmark-outline'}
            color={colors.blue}
            size={22}
          />
          <Text style={styles.actionText}>{savedClicked ? 'Saved' : 'Save'}</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={handleDirections}
          accessibilityRole="button"
          accessibilityLabel="Get directions"
        >
          <Ionicons name="navigate-outline" color={colors.blue} size={22} />
          <Text style={styles.actionText}>Directions</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sampling point details</Text>
        <Text style={styles.body}>{location.body}</Text>
        <View style={styles.factRow}>
          <Text style={styles.factLabel}>Coordinates</Text>
          <Text style={styles.factValue}>
            {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
          </Text>
        </View>
        <View style={styles.factRow}>
          <Text style={styles.factLabel}>Average rating</Text>
          <Text style={styles.factValue}>{averageRating ? averageRating : 'Not rated yet'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingTop: 82,
    gap: spacing.lg,
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    gap: spacing.lg,
    ...shadows.card,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.blue,
    fontSize: typography.small,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  actionText: {
    color: colors.blueDark,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.card,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  body: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  factRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  factLabel: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  factValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
