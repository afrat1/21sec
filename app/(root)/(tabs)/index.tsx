import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";

export default function Index() {
    const { user } = useGlobalContext();

    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text className="font-bold font-rubik my-10 text-3xl">
                {user ? `Welcome, ${user.name}` : 'Welcome to ortamify'}
            </Text>
            <Link href="/sign-in">Sign In</Link>
            <Link href="/explore">Explore</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/properties/1">Property</Link>
        </View>
    );
}
