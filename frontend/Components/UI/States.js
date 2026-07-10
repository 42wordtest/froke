import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radius, shadows, spacing, typography } from '../../design/theme';
import { PrimaryButton } from './PrimaryButton';

export function EmptyState({ title = 'Nothing here yet', message, actionLabel, onAction }) {
  return (
    <View style={styles.stateCard} accessible accessibilityRole="summary">
      <Ionicons name="water-outline" size={34} color={colors.blue} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? <PrimaryButton label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <View style={styles.stateCard} accessible accessibilityRole="alert">
      <Ionicons name="alert-circle-outline" size={34} color={colors.danger} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? <PrimaryButton label="Try again" onPress={onRetry} /> : null}
    </View>
  );
}

export function LoadingSkeleton({ label = 'Loading bathing waters' }) {
  return (
    <View style={styles.loading} accessible accessibilityLabel={label}>
      <ActivityIndicator color={colors.blue} />
      <Text style={styles.message}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stateCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    margin: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  title: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
});
