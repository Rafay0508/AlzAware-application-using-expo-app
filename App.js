import { StyleSheet } from "react-native";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./store";
import LoginPage from "./pages/LoginPage/LoginPage";
import MainPage from "./pages/MainPage/MainPage";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetStartedPage from "./pages/GetStartedPage/GetStartedPage";
import BottomNavigationComp from "./components/BottomNavigation/BottomNavigationComp";
import DocumentPickerPage from "./pages/DocumentPickerPage/DocumentPickerPage";
import ReportPage from "./pages/ReportPage/ReportPage";
import ReminderPage from "./pages/RemindePage/ReminderPage";
import CommunityPage from "./pages/CommunityPage/CommunityPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen
            name="GetStartedPage"
            component={GetStartedPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="MainPage"
            component={BottomNavigationComp}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUpPage"
            component={SignUpPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ReminderPage"
            component={ReminderPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DocumentPickerPage"
            component={DocumentPickerPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportPage"
            component={ReportPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CommunityPage"
            component={CommunityPage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
