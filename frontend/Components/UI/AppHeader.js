import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../design/theme';

export default function AppHeader({ eyebrow, title, subtitle }) {
  return (
    <View style={styles.container} accessibilityRole="header">
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title} maxFontSizeMultiplier={1.25}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} maxFontSizeMultiplier={1.2}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  eyebrow: {
    color: colors.blue,
    fontSize: typography.small,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
