import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux"; // Importing useDispatch and useSelector
import { registerUser } from "../../redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SignUpPage = () => {
  const dispatch = useDispatch(); // Getting the dispatch function from Redux
  const error = useSelector((state) => state.user.error);
  const isLoading = useSelector((state) => state.user.isLoading);

  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        navigation.navigate("MainPage");
      }
    };

    checkToken();
  }, []);

  const [userData, setUserData] = useState({
    fullName: "",
    contact: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  const handleSignUp = () => {
    // Dispatching the registerUser action with userData as payload
    dispatch(registerUser(userData))
      .unwrap()
      .then((response) => {
        // Handle successful signup (if needed)
        console.log("Signup successful:", response);
        setUserData({ fullName: "", contact: "", email: "", password: "" });
        navigation.navigate("LoginPage");
      })
      .catch((error) => {
        // Handle signup error
        Alert.alert("Signup error", error.message);
        setUserData({ fullName: "", contact: "", email: "", password: "" });
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/AlzAware.png")}
        style={styles.logo}
      />
      <Text style={styles.heading}>Signup</Text>
      {isLoading && <ActivityIndicator size="large" color="#62d75f" />}
      {/* {error && <Text>{error.message}</Text>} */}
      <TextInput
        style={styles.input}
        placeholder="Full Name*"
        keyboardType="default"
        value={userData.fullName}
        onChangeText={(text) => handleInputChange("fullName", text)}
        required
      />

      <TextInput
        style={styles.input}
        placeholder="Contact*"
        keyboardType="numeric"
        value={userData.contact}
        onChangeText={(text) => handleInputChange("contact", text)}
        required
      />

      <TextInput
        style={styles.input}
        placeholder="Email*"
        keyboardType="email-address"
        value={userData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        required
      />

      <TextInput
        style={styles.input}
        placeholder="Password*"
        secureTextEntry={true}
        value={userData.password}
        onChangeText={(text) => handleInputChange("password", text)}
        required
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

      <Text style={styles.registrationLink}>
        <Text style={styles.statement}>Already have an account?</Text>
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate("LoginPage")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3479CC",
  },
  logo: {
    width: 250,
    height: 130,
    paddingBottom: 0,
    resizeMode: "contain",
    backgroundColor: "transparent",
  },
  heading: {
    fontSize: 40,
    fontWeight: "600",
    fontFamily: "sans-serif",
    color: "#fff",
    marginVertical: 18,
  },
  input: {
    width: 270,
    height: 35,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
    paddingHorizontal: 10,
    margin: 10,
    color: "white",
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#48EC16",
    paddingVertical: 13,
    paddingHorizontal: 50,
    borderRadius: 28,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  registrationLink: {
    marginTop: 15,
  },
  registerLink: {
    marginTop: 20,
    color: "#0047AB",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SignUpPage;
