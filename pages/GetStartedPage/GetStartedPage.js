import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const GetStartedPage = () => {
  const navigation = useNavigation();
  const handleGetStarted = () => {
    navigation.navigate("LoginPage");
  };
  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../../assets/logo.png")} style={styles.image} />
        <Image
          source={require("../../assets/AlzAware.png")}
          style={{ width: 250, height: 80 }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subheading}>
          <Text>Mobile Early Alzheimer</Text>

          <Text> Detection</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetStartedPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#4477CE",
  },
  image: { width: 200, height: 200, margin: 10 },
  textContainer: { alignItems: "center", marginBottom: 6 },
  heading: {
    fontSize: 48,
    color: "white",
    textAlign: "center",
  },
  subheading: {
    display: "flex",
    flexDirection: "column",
    fontSize: 22,
    color: "white",
    textAlign: "center",
  },

  button: {
    backgroundColor: "#8EAC50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff", // Button text color
    textAlign: "center",
  },
});
