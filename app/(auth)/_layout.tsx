import { Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="app" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default AuthLayout;
