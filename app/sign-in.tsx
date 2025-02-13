import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";


import { login, loginWithEmail, registerWithEmail } from "@/lib/appwrite";
import { Redirect } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";

const Auth = () => {
  const { refetch, loading, isLogged } = useGlobalContext();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);


  if (isAuthenticating || loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg font-rubik text-center text-gray-600">
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleGoogleLogin = async () => {
    try {
      setIsAuthenticating(true);
      const result = await login();
      if (result) {
        console.log("Login success");
        await refetch();
      } else {
        Alert.alert("Error", "Failed to login with Google");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred while trying to login with Google");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEmailAuth = async () => {
    try {
      setIsAuthenticating(true);
  
      if (isRegistering) {
        if (!name) {
          Alert.alert("Error", "Please enter your name");
          return;
        }
  
        const result = await registerWithEmail(email, password, name);
        if (result) {
          console.log("Registration successful:", result);
          await refetch();
          Alert.alert("Success", "User registered successfully!");
        } else {
          Alert.alert("Error", "Registration failed. Try again.");
        }
      } else {
        // Login existing user
        const result = await loginWithEmail(email, password);
        if (result) {
          console.log("Login success");
          await refetch();
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      Alert.alert("Error", error.message || "Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={images.onboarding}
          className="w-full h-72"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome To ortamify
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer To {"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>

          <View className="mt-8">
            {isRegistering && (
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                editable={!isAuthenticating}
              />
            )}
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isAuthenticating}
            />
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isAuthenticating}
            />

            <TouchableOpacity
              onPress={handleEmailAuth}
              className="bg-primary-300 rounded-lg p-4 mb-4"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-rubik-medium text-lg">
                  {isRegistering ? "Register" : "Login"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsRegistering(!isRegistering)}
              disabled={isAuthenticating}
            >
              <Text className="text-center text-primary-300 font-rubik-medium">
                {isRegistering
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-0.5 bg-gray-200" />
              <Text className="mx-4 text-gray-400 font-rubik">OR</Text>
              <View className="flex-1 h-0.5 bg-gray-200" />
            </View>

            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={isAuthenticating}
              className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4"
            >
              <View className="flex flex-row items-center justify-center">
                {isAuthenticating ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <>
                    <Image
                      source={icons.google}
                      className="w-5 h-5"
                      resizeMode="contain"
                    />
                    <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                      Continue with Google
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;