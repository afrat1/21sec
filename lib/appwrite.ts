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
        Alert.alert(
          "Email Verification Required",
          "Your email is not verified. Would you like to resend the verification email?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Resend Email",
              onPress: async () => {
                try {
                  await account.createVerification("http://localhost:8081/verify-screen");
                  Alert.alert("Success", "Verification email has been resent. Please check your inbox.");
                } catch (error) {
                  console.error("Error resending verification email:", error);
                  Alert.alert("Error", "Failed to send verification email. Try again later.");
                }
              },
            },
          ]
        );

        return true;
      }

      return true; // Email doğrulandıysa giriş başarılı.
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

export const updateUser = async ({ name, password, avatar }) => {
  try {
      if (name) {
          await account.updateName(name);
      }

      if (password) {
          await account.updatePassword(password.newPassword, password.currentPassword); 
          
        ;
      }

      if (avatar) {
          // Handle avatar upload to Appwrite Storage
          console.log("Avatar update functionality not implemented yet.");
      }
  } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
  }
};


export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    return account.updatePassword(newPassword, currentPassword); 
  } catch (error) {
      throw new Error("Incorrect current password or password update failed.");
  }
};