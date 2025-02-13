import {
  Client,
  Account,
  ID,
  Databases,
  OAuthProvider,
  Avatars,
  Query,
  Storage,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const config = {
  platform: "com.afrat.ortamify",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();
    if (result.$id) {
      const userAvatar = avatar.getInitials(result.name);

      return {
        ...result,
        avatar: userAvatar.toString(),
      };
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function loginWithEmail(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    if (session) {
      const user = await getCurrentUser();

      if (user && !user.emailVerification) {
        await logout();  // Log out if email is not verified
        Alert.alert("Error", "Please verify your email before logging in.");
        return false; // Prevent further login flow
      }

      return true; // Successful login if email is verified
    }

    return false;
  } catch (error: any) {
    if (error.message.includes("Rate limit")) {
      throw new Error("Too many attempts. Please try again in a few minutes.");
    }
    console.error("Login error:", error);
    throw error;
  }
}

export async function registerWithEmail(email: string, password: string, name: string) {
  try {
    const userId = ID.unique();
    const user = await account.create(userId, email, password, name);

    if (user) {
      console.log("User created:", user);

      // Create a session immediately after registration
      const session = await account.createEmailPasswordSession(email, password);
      if (!session) {
        throw new Error("Failed to create session after registration.");
      }

      console.log("Session created for newly registered user.");

      // Send verification email (optional)
      await account.createVerification("http://localhost:8081/verify-screen");
      console.log("Verification email sent.");

      return user;
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function verifyEmail(userId: string, secret: string) {
  try {
    await account.updateVerification(userId, secret);
    console.log("Email verified successfully.");
    return true;
  } catch (error) {
    console.error("Verify email error:", error);
    throw error;
  }
}