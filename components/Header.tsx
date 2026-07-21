import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SCREEN_WIDTH } from '@/utils/Path';

type HeaderProps = {
  onClose?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onClose }) => {
  return (
    <>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topBarText}>Spin And Win!</Text>
        {/* Spacer to keep title centred */}
        <View style={styles.spacer} />
      </View>
      <View style={styles.divider} />
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#454D77',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  topBarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
  },
  divider: {
    backgroundColor: '#424677',
    width: SCREEN_WIDTH * 0.9,
    height: 1,
  },
});
