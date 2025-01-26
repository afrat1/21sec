import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
    return (
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <Text className="font-bold font-rubik my-10 text-3xl">Welcome to 21Sec</Text>
            <Link href="/sign-in">Sign In</Link>
            <Link href="/explore">Explore</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/properties/1">Property</Link>

        </View>
    );
}
