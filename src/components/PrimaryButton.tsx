import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
};

export function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
  return (
    <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  text: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
});
