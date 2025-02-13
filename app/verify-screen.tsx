import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { account } from "../lib/appwrite"; // Adjust the import path as necessary
import { RouteProp } from "@react-navigation/native";

// Define the type for your route parameters
type VerifyScreenRouteProp = RouteProp<{ params?: { userId?: string; secret?: string } }, "params">;

const VerifyScreen = () => {
  const route = useRoute<VerifyScreenRouteProp>(); // Specify the route type
  const navigation = useNavigation();
  const [verificationDone, setVerificationDone] = useState(false);

  // Check if params exist before destructuring
  const userId = route.params?.userId;
  const secret = route.params?.secret;

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!userId || !secret) {
        Alert.alert("Error", "Invalid verification request.");
        navigation.goBack(); // Navigate back if params are missing
        return;
      }

      try {
        const result = await account.updateVerification(userId, secret);
        if (result) {
          console.log("success email verification");
          Alert.alert("Success", "Email verified successfully!");
          setVerificationDone(true);
        }
      } catch (error) {
        console.error("Verification error:", error);
        Alert.alert("Error", "Email verification failed. Please try again.");
      }
    };

    verifyUserEmail();
  }, [userId, secret]);

  return (
    <View style={styles.container}>
      {verificationDone ? (
        <Text style={styles.successText}>Verification done</Text>
      ) : (
        <Text style={styles.loadingText}>Verifying your email...</Text>
      )}
    </View>
  );
};

// Add styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light background color
  },
  successText: {
    fontSize: 24,
    color: "#4CAF50", // Green color for success message
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    color: "#2196F3", // Blue color for loading message
  },
});

export default VerifyScreen;