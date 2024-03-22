import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import MainPage from "../../pages/MainPage/MainPage";
import { useEffect } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; // Import FontAwesome5
import DocumentPickerPage from "../../pages/DocumentPickerPage/DocumentPickerPage";
import ReportPage from "../../pages/ReportPage/ReportPage";
import ReminderPage from "../../pages/RemindePage/ReminderPage";
import CommunityPage from "../../pages/CommunityPage/CommunityPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const HomeRoute = () => <MainPage />;
const DocumentRoute = () => <DocumentPickerPage />;
const ReportRoute = () => <ReportPage />;
const CommunityRoute = () => <CommunityPage />;
const ReminderRoute = () => <ReminderPage />;

const BottomNavigationComp = () => {
  const [index, setIndex] = React.useState(0);
  const navigation = useNavigation();
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
    },
    {
      key: "reminder",
      title: "Reminders",
      focusedIcon: "bell", // Font Awesome icon name
    },
    {
      key: "camera",
      title: "Camera",
      focusedIcon: "camera",
    },

    { key: "report", title: "Report", focusedIcon: "file" },
    {
      key: "community",
      title: "Community",
      focusedIcon: "users",
    }, // Corrected key
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    camera: DocumentRoute,
    report: ReportRoute,
    community: CommunityRoute,
    reminder: ReminderRoute,
    // more: ReportRoute,
    // ...
  });

  useEffect(() => {
    const checkToken = async () => {
      // Check if a token is stored in AsyncStorage
      const storedToken = await AsyncStorage.getItem("token");

      if (!storedToken) {
        navigation.navigate("LoginPage");
      }
    };

    checkToken();
  }, []);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      // Set focused icons using the `focused` prop
      renderIcon={({ route, focused }) => (
        <FontAwesome5
          name={route.focusedIcon}
          size={18}
          color={focused ? "#6200EE" : "#888"}
        />
      )}
    />
  );
};

export default BottomNavigationComp;
