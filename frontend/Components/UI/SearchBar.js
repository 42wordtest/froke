import { StyleSheet, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radius, spacing, typography } from '../../design/theme';

export default function SearchBar({ value, onChangeText, placeholder = 'Search locations' }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={colors.muted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel={placeholder}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 44,
  },
});
