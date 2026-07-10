import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../../design/theme';

export function PrimaryButton({ label, onPress, accessibilityLabel, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [styles.primary, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, accessibilityLabel, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [styles.secondary, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const base = {
  minHeight: 44,
  borderRadius: radius.md,
  paddingHorizontal: spacing.lg,
  alignItems: 'center',
  justifyContent: 'center',
};

const styles = StyleSheet.create({
  primary: {
    ...base,
    backgroundColor: colors.blue,
  },
  secondary: {
    ...base,
    backgroundColor: colors.blueSoft,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.blueDark,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
