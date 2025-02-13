import { SafeAreaView, Text, View, Image } from "react-native";
import { useGlobalContext } from "@/lib/global-provider";

const ProfileDetails = () => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView className="h-full bg-white px-7">
      <View className="items-center mt-10">
        <Image source={{ uri: user?.avatar }} className="size-44 rounded-full" />
        <Text className="text-2xl font-rubik-bold mt-4">{user?.name}</Text>
        <Text className="text-lg text-gray-600">{user?.email}</Text>
      </View>

      {/* Add more profile details here */}
    </SafeAreaView>
  );
};

export default ProfileDetails;