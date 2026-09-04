import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface BiometricCapabilities {
  isAvailable: boolean;
  biometricType: 'fingerprint' | 'faceId' | 'iris' | 'none';
  isEnrolled: boolean;
}

/**
 * Check if biometric authentication is available and configured
 */
export async function checkBiometricCapabilities(): Promise<BiometricCapabilities> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType: BiometricCapabilities['biometricType'] = 'none';

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      biometricType = 'faceId';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      biometricType = 'fingerprint';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      biometricType = 'iris';
    }

    return {
      isAvailable: hasHardware && isEnrolled,
      biometricType,
      isEnrolled,
    };
  } catch {
    return {
      isAvailable: false,
      biometricType: 'none',
      isEnrolled: false,
    };
  }
}

/**
 * Authenticate user with biometrics
 * @param promptMessage - Message to show in biometric prompt
 * @returns Success status
 */
export async function authenticateWithBiometrics(
  promptMessage = 'Authenticate to continue'
): Promise<{ success: boolean; error?: string }> {
  try {
    const capabilities = await checkBiometricCapabilities();

    if (!capabilities.isAvailable) {
      return {
        success: false,
        error: 'Biometric authentication is not available on this device',
      };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancel',
      fallbackLabel: 'Use password',
      disableDeviceFallback: false,
    });

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: result.error === 'user_cancel' ? 'Authentication cancelled' : 'Authentication failed',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Biometric authentication failed',
    };
  }
}

/**
 * Get user-friendly biometric type name
 */
export function getBiometricTypeName(type: BiometricCapabilities['biometricType']): string {
  switch (type) {
    case 'faceId':
      return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    case 'fingerprint':
      return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
    case 'iris':
      return 'Iris Scan';
    default:
      return 'Biometric';
  }
}
