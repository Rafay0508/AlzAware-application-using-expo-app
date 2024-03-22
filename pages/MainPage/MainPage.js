import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../redux/userSlice";

const MainPage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userName = useSelector((state) =>
    state.user.userData ? state.user.userData.fullName : null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          console.log("token", JSON.parse(token).token);
          dispatch(verifyToken(token));
        } else {
          // If no token found, navigate to login page
          navigation.navigate("LoginPage");
        }
      } catch (error) {
        console.error("Error while checking token:", error);
      }
      if (!userName && !(await AsyncStorage.getItem("token"))) {
        // Remove token and navigate to login page after 5 seconds
        const timeout = setTimeout(() => {
          AsyncStorage.removeItem("token");
          navigation.navigate("LoginPage");
        }, 5000);

        return () => clearTimeout(timeout);
      } else {
        setLoading(false); // Stop the loading indicator if userdata is present
      }
    };

    getToken();
  }, [userName]); // Listen for changes in userName

  const handleLogout = async () => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem("token");
      // Navigate to LoginPage
      navigation.navigate("LoginPage");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? ( // Show activity indicator while loading
        <ActivityIndicator size="large" color="#FFFF66" />
      ) : (
        <>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="sign-out-alt" size={20} color="white" />
          </TouchableOpacity>

          <Image
            source={require("../../assets/AlzAware.png")}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>
            Welcome Back,{" "}
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                fontStyle: "italic",
                textDecorationLine: "underline",
              }}
            >
              {userName}
            </Text>
          </Text>

          <Image
            source={require("../../assets/banner.png")}
            style={styles.bannerImage}
          />

          <Text style={styles.empoweringText}>
            Empowering Alzheimer's Patients and Caregivers.
          </Text>

          <View style={styles.contentOuterWrapper}>
            <View style={styles.contentContainer}>
              <Text style={styles.sectionHeader}>
                Why Early Detection Matters
              </Text>
              <Text style={styles.contentText}>
                Early detection of Alzheimer's disease allows for timely
                interventions that can slow down its progression and improve
                patient outcomes. Our app utilizes advanced predictive models to
                identify potential risks, enabling proactive care and support.
              </Text>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.sectionHeader}>Key Features</Text>
              <Text style={styles.contentText}>
                - Personalized Risk Assessment
                {"\n"}- Real-time Monitoring
                {"\n"}- Educational Resources
                {"\n"}- Secure Data Management
              </Text>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.sectionHeader}>How You Benefit</Text>
              <Text style={styles.contentText}>
                Our app empowers you with valuable insights into Alzheimer's
                disease risk factors. By staying informed and taking proactive
                measures, you contribute to better outcomes for both patients
                and caregivers.
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4477CE", // Original blue color
    paddingHorizontal: 20, // Add horizontal padding
    paddingTop: 50, // Add top padding
    paddingBottom: 20, // Add bottom padding
  },
  logo: {
    width: 250,
    height: 80,
    marginTop: 10,
    alignSelf: "center",
  },
  bannerImage: {
    marginTop: 15,
    width: "90%",
    alignSelf: "center",
    height: 200,
    borderRadius: 10,
  },
  welcomeText: {
    marginTop: 20,
    fontSize: 24,

    color: "#FFFF66", // Yellow
    textAlign: "center",
  },
  empoweringText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 25,
  },
  contentOuterWrapper: {
    marginBottom: 50,
  },
  contentContainer: {
    margin: 20,
    marginTop: -5,
    backgroundColor: "#0005",
    padding: 20,
    paddingBottom: 10,
    borderRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 22,
    textDecorationLine: "underline",
    color: "#FFFF66", // Yellow
    marginBottom: 10,
    textAlign: "center",
  },
  contentText: {
    fontSize: 16,
    color: "white",
    textAlign: "left",
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 9,
    padding: 10,
    backgroundColor: "#4CAF50", // Dark green
    borderRadius: 25,
    elevation: 5, // Add shadow
  },
});
