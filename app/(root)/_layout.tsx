import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, TouchableOpacity, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGlobalContext } from "@/lib/global-provider";
import { logout } from "@/lib/appwrite";

export default function AppLayout() {
  const { loading, isLogged, refetch } = useGlobalContext();

  const handleLogout = async () => {
    try {
      await logout();
      refetch();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg font-rubik text-center text-gray-600">
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1">
        <View className="px-4 py-2 border-b border-gray-200">
          <TouchableOpacity 
            onPress={handleLogout}
            className="self-end bg-red-500 px-4 py-2 rounded-md"
          >
            <Text className="text-white">Logout</Text>
          </TouchableOpacity>
        </View>
        <Slot />
      </View>
    </SafeAreaView>
  );
}