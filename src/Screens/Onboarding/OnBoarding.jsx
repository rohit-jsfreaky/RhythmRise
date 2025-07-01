import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Picker } from "@react-native-picker/picker";
import { MMKV } from "react-native-mmkv";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const storage = new MMKV();

const OnBoarding = () => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [customGender, setCustomGender] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const checkOnboardingStatus = () => {
    try {
      const onboardingCompleted = storage.getBoolean("onboarding");
      if (onboardingCompleted) {
        // If onboarding is completed, navigate to main app
        navigation.replace("Tabs");
      }
    } catch (error) {
      console.log("Error checking onboarding status:", error);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const genderOptions = [
    { label: "Select your gender...", value: "" },
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Transgender", value: "transgender" },
    { label: "Prefer not to say", value: "prefer_not_to_say" },
    { label: "Walmart Bag", value: "walmart_bag" },
    { label: "Optimus Prime", value: "optimus_prime" },
    { label: "Mechanic", value: "mechanic" },
    { label: "Croissant", value: "croissant" },
    { label: "Email", value: "email" },
    { label: "Create Your Own", value: "custom" },
  ];

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    if (value === "custom") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomGender("");
    }
  };

  const handleContinue = async () => {
    if (!name.trim()) {
      ToastAndroid.show("Please enter your name", ToastAndroid.SHORT);

      return;
    }

    if (!selectedGender) {
      ToastAndroid.show("Please select your gender", ToastAndroid.SHORT);

      return;
    }

    if (selectedGender === "custom" && !customGender.trim()) {
      ToastAndroid.show("Please enter your custom ", ToastAndroid.SHORT);

      return;
    }

    setIsLoading(true);

    try {
      // Save user data to MMKV
      const userData = {
        name: name.trim(),
        gender:
          selectedGender === "custom" ? customGender.trim() : selectedGender,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
      };

      storage.set("userData", JSON.stringify(userData));
      storage.set("onboarding", true);

      setTimeout(() => {
        setIsLoading(false);
        navigation.replace("Tabs");
        console.log("Navigating to main app...", userData);
      }, 1000);
    } catch (error) {
      console.error("Error saving user data:", error);
      setIsLoading(false);
      ToastAndroid.show(
        "Something went wrong. Please try again.",
        ToastAndroid.SHORT
      );
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case "male":
        return "man";
      case "female":
        return "woman";
      case "transgender":
        return "transgender";
      case "walmart_bag":
        return "bag";
      case "optimus_prime":
        return "car";
      case "mechanic":
        return "construct";
      case "croissant":
        return "restaurant";
      case "email":
        return "mail";
      default:
        return "person";
    }
  };

  return (
    <LinearGradient colors={theme.colors.gradient} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                Welcome to RhythmRise! 🎵
              </Text>
              <Text
                style={[styles.subtitle, { color: theme.colors.textSecondary }]}
              >
                Let's get to know you better
              </Text>
            </View>

            {/* Name Input */}
            <BlurView
              intensity={20}
              tint="dark"
              style={[
                styles.inputContainer,
                { backgroundColor: theme.colors.glassBackground },
              ]}
            >
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      color: theme.colors.textPrimary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  placeholder="What's your name?"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                  maxLength={30}
                />
              </View>
            </BlurView>

            {/* Gender Selection */}
            <BlurView
              intensity={20}
              tint="dark"
              style={[
                styles.inputContainer,
                { backgroundColor: theme.colors.glassBackground },
              ]}
            >
              <View style={styles.inputWrapper}>
                <Ionicons
                  name={getGenderIcon(selectedGender)}
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedGender}
                    onValueChange={handleGenderChange}
                    style={[
                      styles.picker,
                      {
                        color: theme.colors.textPrimary,
                        backgroundColor: "transparent",
                      },
                    ]}
                    dropdownIconColor={theme.colors.textSecondary}
                    mode="dropdown"
                  >
                    {genderOptions.map((option) => (
                      <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        style={{
                          color: theme.colors.textPrimary,
                          backgroundColor: theme.colors.surface,
                        }}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </BlurView>

            {/* Custom Gender Input */}
            {showCustomInput && (
              <Animated.View
                style={[
                  styles.customInputContainer,
                  { backgroundColor: theme.colors.glassBackground },
                ]}
              >
                <BlurView intensity={20} tint="dark" style={styles.customBlur}>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={theme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          color: theme.colors.textPrimary,
                          borderColor: theme.colors.border,
                        },
                      ]}
                      placeholder="Create your own gender..."
                      placeholderTextColor={theme.colors.textSecondary}
                      value={customGender}
                      onChangeText={setCustomGender}
                      maxLength={20}
                    />
                  </View>
                </BlurView>
              </Animated.View>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  opacity: name.trim() && selectedGender ? 1 : 0.6,
                },
              ]}
              onPress={handleContinue}
              disabled={
                !name.trim() ||
                !selectedGender ||
                (selectedGender === "custom" && !customGender.trim()) ||
                isLoading
              }
            >
              <LinearGradient
                colors={theme.colors.activeGradient}
                style={styles.gradientButton}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text
                      style={[
                        styles.buttonText,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      Setting up...
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.buttonText,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      Let's Go!
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={theme.colors.textPrimary}
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Fun Message */}
            {selectedGender &&
              selectedGender !== "custom" &&
              selectedGender !== "" && (
                <Animated.Text
                  style={[
                    styles.funMessage,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {selectedGender === "walmart_bag" && "Great choice! 🛍️"}
                  {selectedGender === "optimus_prime" &&
                    "Autobots, roll out! 🤖"}
                  {selectedGender === "mechanic" && "Fix it with music! 🔧"}
                  {selectedGender === "croissant" && "Très délicieux! 🥐"}
                  {selectedGender === "email" && "You've got mail! 📧"}
                  {[
                    "male",
                    "female",
                    "transgender",
                    "prefer_not_to_say",
                  ].includes(selectedGender) && "Perfect! 🎶"}
                </Animated.Text>
              )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  inputContainer: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    fontSize: 16,
    paddingVertical: 0,
    height: 40,
  },
  customInputContainer: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  customBlur: {
    borderRadius: 16,
  },
  continueButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 20,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  funMessage: {
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
    opacity: 0.8,
  },
});
