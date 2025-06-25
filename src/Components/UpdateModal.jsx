import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const UpdateModal = ({
  visible,
  onClose,
  isChecking,
  hasUpdate,
  currentVersion,
  latestVersion,
  error,
  theme,
  onCheckUpdate,
  hasCheckedOnce,
}) => {
  const handleDownload = () => {
    // You can implement the download logic here
    // For now, we'll just open the GitHub releases page
    Linking.openURL('https://github.com/rohit-jsfreaky/RhythmRise/releases');
  };

  const renderContent = () => {
    if (isChecking) {
      return (
        <View style={styles.contentContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Checking for Updates
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            Please wait while we check for the latest version...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.contentContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.errorColor + '20' }]}>
            <Ionicons name="alert-circle" size={40} color={theme.colors.errorColor} />
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Check Failed
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            Unable to check for updates. Please check your internet connection and try again.
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={onCheckUpdate}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={theme.colors.activeGradient}
              style={styles.buttonGradient}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    if (hasUpdate) {
      return (
        <View style={styles.contentContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.successColor + '20' }]}>
            <Ionicons name="download" size={40} color={theme.colors.successColor} />
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Update Available!
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            A new version is available for download.
          </Text>
          
          <View style={styles.versionContainer}>
            <View style={styles.versionItem}>
              <Text style={[styles.versionLabel, { color: theme.colors.textSecondary }]}>
                Current Version
              </Text>
              <Text style={[styles.versionNumber, { color: theme.colors.textPrimary }]}>
                v{currentVersion}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.primary} />
            <View style={styles.versionItem}>
              <Text style={[styles.versionLabel, { color: theme.colors.textSecondary }]}>
                Latest Version
              </Text>
              <Text style={[styles.versionNumber, { color: theme.colors.successColor }]}>
                v{latestVersion}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.downloadButton, { backgroundColor: theme.colors.successColor }]}
            onPress={handleDownload}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.successColor, theme.colors.primary]}
              style={styles.buttonGradient}
            >
              <Ionicons name="download-outline" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Download Update</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    if (hasCheckedOnce && !hasUpdate) {
      return (
        <View style={styles.contentContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.successColor + '20' }]}>
            <Ionicons name="checkmark-circle" size={40} color={theme.colors.successColor} />
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            You're Up to Date!
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            You have the latest version of RhythmRise installed.
          </Text>
          
          <View style={styles.currentVersionContainer}>
            <Text style={[styles.versionLabel, { color: theme.colors.textSecondary }]}>
              Current Version
            </Text>
            <Text style={[styles.versionNumber, { color: theme.colors.successColor }]}>
              v{currentVersion}
            </Text>
          </View>
        </View>
      );
    }

    // Initial state - show check button
    return (
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name="refresh-outline" size={40} color={theme.colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Check for Updates
        </Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          Tap the button below to check if there are any updates available for RhythmRise.
        </Text>
        
        <TouchableOpacity
          style={[styles.checkButton, { backgroundColor: theme.colors.primary }]}
          onPress={onCheckUpdate}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.colors.activeGradient}
            style={styles.buttonGradient}
          >
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Check Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.modal,
                {
                  backgroundColor: theme.colors.surface,
                  shadowColor: theme.colors.shadowColor,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>

              {renderContent()}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 400,
  },
  modal: {
    borderRadius: 24,
    padding: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.8,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  versionItem: {
    alignItems: 'center',
    flex: 1,
  },
  versionLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.7,
  },
  versionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentVersionContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  checkButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  downloadButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  retryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default UpdateModal;