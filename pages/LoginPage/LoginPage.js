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
import { loginUser } from "../../redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LoginPage = () => {
  const dispatch = useDispatch(); // Getting the dispatch function from Redux
  const error = useSelector((state) => state.user.error);
  const isLoading = useSelector((state) => state.user.isLoading);
  const token = useSelector((state) => state.user.token);

  const navigation = useNavigation();
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        navigation.navigate("MainPage");
      } else {
        navigation.navigate("LoginPage");
      }
    };

    checkToken();
  }, []);

  const [userData, setUserData] = useState({
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
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,4}$/;

    if (!emailRegex.test(userData.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }
    // Dispatching the registerUser action with userData as payload
    dispatch(loginUser(userData))
      .unwrap()
      .then((data) => {
        AsyncStorage.setItem("token", JSON.stringify({ token: data.token }));
        setUserData({
          email: "",
          password: "",
        });
        // console.log(AsyncStorage.getItem("token"));
        navigation.navigate("MainPage");
      })
      .catch((error) => {
        // Display the specific error message received from the server
        if (error.message) {
          Alert.alert("Login Error", error.message);
        } else {
          Alert.alert("Login Error", "An unexpected error occurred.");
        }
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/AlzAware.png")}
        style={styles.logo}
      />
      <Text style={styles.heading}>LogIn</Text>
      {isLoading && <ActivityIndicator size="large" color="#62d75f" />}
      {/* {error && <Text>{error.message}</Text>} */}

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
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.registrationLink}>
        <Text style={styles.statement}>Doesn't have an account?</Text>
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate("SignUpPage")}
        >
          SignUp
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

export default LoginPage;
