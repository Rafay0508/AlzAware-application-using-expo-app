import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, fetchAllMessages } from "../../redux/messageSlice";
import { setToken } from "../../redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CommunityPage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [userToken, setUserToken] = useState(null);
  const allMessages = useSelector((state) => state.messages);
  const fetchingMessages = useSelector((state) => state.fetchingMessages);
  // const fetchingMessages = useSelector(
  //   (state) => state.messages.status === "loading"
  // );

  const scrollViewRef = useRef();
  console.log(allMessages);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        setUserToken(token);
        if (!token) {
          navigation.navigate("LoginPage");
        } else {
          dispatch(fetchAllMessages(token));
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();

    // Cleanup function to clear the interval
    // return () => clearInterval(fetchInterval);
  }, []);

  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({ animated: true });
  //   }
  // }, [allMessages]);

  useEffect(() => {
    const fetchAllMessagesInterval = setInterval(() => {
      dispatch(fetchAllMessages(userToken));
    }, 500); // Fetch every second

    // Cleanup function to clear the interval
    return () => clearInterval(fetchAllMessagesInterval);
  }, [userToken]); // Fetch again if the user token changes

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("LoginPage");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      dispatch(
        createMessage({ user: "User", content: inputMessage }, userToken)
      );
      setInputMessage("");
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100); // Scroll to end after a slight delay to allow time for the new message to be added
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Community Chat Support</Text>
      {fetchingMessages ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        <ScrollView
          style={styles.messageList}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          <Text
            style={{
              display: "flex",
              alignSelf: "center",
              fontSize: 22,
              color: "white",
              fontStyle: "italic",
            }}
          >
            Fetching......
          </Text>

          {allMessages &&
            allMessages.messages.map((message, index) => (
              <View
                key={`${message.content}_${index}`} // Unique key based on message content and index
                style={[
                  styles.messageContainer,
                  message.user === userToken ? styles.currentUserMessage : null,
                ]}
              >
                <View style={styles.messageContentContainer}>
                  <Text style={styles.senderName}>UserID: {message.user}</Text>
                  <Text style={styles.messageContent}>{message.content}</Text>
                </View>
              </View>
            ))}
        </ScrollView>
      )}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputMessage}
          onChangeText={(text) => setInputMessage(text)}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommunityPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3479CC",
  },
  heading: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 10,
    marginLeft: -60,
    color: "yellow",
    marginTop: 50,
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 5,
    padding: 10,
    backgroundColor: "green",
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "white",
  },
  messageList: {
    flex: 1,
    marginBottom: 50,
    marginLeft: 10,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "white", // Default background color
  },
  currentUserMessage: {
    backgroundColor: "pink", // Background color for messages sent by the current user
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
    marginRight: 5,
  },
  messageContentContainer: {
    maxWidth: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  messageContent: {
    color: "#333",
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3479CC",
    padding: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    height: 37,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
