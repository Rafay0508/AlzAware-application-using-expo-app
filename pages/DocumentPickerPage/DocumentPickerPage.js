import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  Button,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";
import { setPredictionResult } from "../../redux/imageSlice";

const DocumentPickerPage = () => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const predictedData = useSelector((state) => state.image);

  async function handleImageSelection() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      console.log("Document Picker Result:", result); // Log the result object to console

      if (result.type === "cancel") {
        Alert.alert("Cancelled", "Selection cancelled by the user.");
        return; // Bail out early if cancelled
      }

      const selectedImageUri = result.assets[0].uri; // Accessing the URI from the assets array
      setSelectedImage(selectedImageUri);
      console.log("Selected Image URI:", selectedImageUri); // Log the URI to console
      ToastAndroid.show("Image selected", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image. Please try again later.");
    }
  }

  async function fetchAPI(imageUri) {
    try {
      setIsLoading(true); // Show activity indicator
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg", // Adjust the type according to the selected image format
        name: "image.jpg",
      });

      const response = await fetch(
        "https://dory-maximum-rapidly.ngrok-free.app/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        setSelectedImage(null);
        throw new Error("Failed to fetch API");
      }

      const data = await response.json();
      dispatch(setPredictionResult(data));
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching API:", error);
      Alert.alert("Error", "Failed to fetch API. Please try again later.");
    } finally {
      setIsLoading(false); // Hide activity indicator
    }
  }

  const handlePrediction = () => {
    // Call function to fetch API with selected image
    fetchAPI(selectedImage);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/AlzAware.png")}
        style={{ marginTop: 0, width: 200, height: 60 }}
      />
      {isLoading && <ActivityIndicator size="50" color="#39e75f" />}
      <Text
        style={{
          fontSize: 16,
          marginLeft: -180,
          marginTop: -10,
          marginBottom: -20,
          color: "white",
          fontWeight: "700",
        }}
      >
        MRI Test:
      </Text>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{
            width: 150,
            height: 150,
            objectFit: "contain",
          }}
          onError={(error) => {
            Alert.alert("Error", "Failed to load image.");
            console.error("Error loading image:", error);
          }}
        />
      )}
      <View style={styles.button}>
        <Button title="Select Image" onPress={handleImageSelection} />
        <Button title="Start Prediction" onPress={handlePrediction} />
      </View>
      {predictedData.predictionResult ? (
        <>
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Prediction Result:</Text>
            <Text style={styles.resultText}>
              {JSON.stringify(predictedData.predictionResult.class_name)}
            </Text>
          </View>
          <Text style={styles.noRecordText}>
            Note: Please Download or print Report from Report page
          </Text>
        </>
      ) : (
        <View>
          <Text style={styles.noRecordText}>NO DATA</Text>
        </View>
      )}
    </View>
  );
};

export default DocumentPickerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#4477CE",
  },

  button: { marginTop: -10 },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noRecordText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
});
