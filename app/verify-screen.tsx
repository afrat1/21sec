import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { verifyEmail } from "@/lib/appwrite";

const VerifyScreen = () => {
  const router = useRouter();
  const { userId, secret } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!userId || !secret) {
        Alert.alert("Error", "Invalid verification link.");
        router.replace("/sign-in");
        return;
      }

      try {
        const result = await verifyEmail(userId.toString(), secret.toString());
        if (result) {
          Alert.alert("Success", "Your email has been verified!");
          router.replace("/sign-in");
        } else {
          Alert.alert("Error", "Email verification failed.");
        }
      } catch (error: any) {
        Alert.alert("Error", error.message || "Verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text>Verifying your email...</Text>
      </View>
    );
  }

  return null;
};

export default VerifyScreen;