import React, { useState } from "react";
import { SafeAreaView, View, Image, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "@/lib/global-provider";
import { updateUser } from "@/lib/appwrite";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
    const { user, refetch } = useGlobalContext();
    const navigation = useNavigation();
    const [name, setName] = useState(user?.name || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState(user?.avatar || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            if (newPassword && newPassword !== confirmPassword) {
                Alert.alert("Error", "New password and confirmation do not match.");
                return;
            }

            await updateUser({
                name,
                password: newPassword ? { newPassword, currentPassword } : null,
                avatar: image,
            });

            await refetch();
            Alert.alert("Success", "Profile updated successfully!");

            navigation.goBack();
        } catch (error) {
            const errorMessage = (error as Error).message || "Failed to update profile.";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            // setImage(result.uri);
        }
    };

    return (
        <SafeAreaView className="bg-white h-full">
            <View className="flex flex-row items-center p-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} className="px-10">
                <View className="items-center mb-6">
                    <Image source={{ uri: image }} className="w-24 h-24 rounded-full border-4 border-primary-300" />
                    <Text className="text-2xl font-rubik-bold text-black-300 mt-4">Hey, {user?.name} 👋</Text>
                    <TouchableOpacity onPress={pickImage} className="mt-2">
                        <Text className="text-primary-300 font-rubik-medium">Change Picture</Text>
                    </TouchableOpacity>
                </View>
                <View className="mt-4">
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                        placeholder="Current Password"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                        placeholder="New Password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                        placeholder="Confirm New Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
    onPress={handleSave}
    disabled={loading}
    activeOpacity={0.7}
    className={`p-4 mt-4 rounded-full ${
        loading ? "bg-gray-300" : "bg-primary-500"
    } shadow-lg flex flex-row justify-center items-center`}
>
    {loading ? (
        <ActivityIndicator color="white" />
    ) : (
        <Text className="text-white text-center font-rubik-bold text-lg">
            Save Changes
        </Text>
    )}
</TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
