import React, { useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { account } from "../lib/appwrite"; // Adjust the import path as necessary
import { RouteProp } from "@react-navigation/native";

// Define the type for your route parameters
type VerifyScreenRouteProp = RouteProp<{ params?: { userId?: string; secret?: string } }, "params">;

const VerifyScreen = () => {
  const route = useRoute<VerifyScreenRouteProp>(); // Specify the route type
  const navigation = useNavigation();

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
            console.log("success email verification")
          Alert.alert("Success", "Email verified successfully!", );
        }
      } catch (error) {
        console.error("Verification error:", error);
        Alert.alert("Error", "Email verification failed. Please try again.");
      }
    };

    verifyUserEmail();
  }, [userId, secret]);

  return (
    <View>
      <Text>Verifying your email...</Text>
    </View>
  );
};

export default VerifyScreen;