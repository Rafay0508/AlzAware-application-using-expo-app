import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const ReportPage = () => {
  const currentDate = new Date();

  const day = currentDate.getDate(); // Get the day of the month (1-31)
  const month = currentDate.getMonth() + 1; // Get the month (0-11), add 1 to get the actual month number (1-12)
  const year = currentDate.getFullYear(); // Get the full year (e.g., 2022)

  const navigation = useNavigation();

  const user = useSelector((state) => state.user);
  const predictedData = useSelector((state) => state.image);
  console.log(predictedData);
  const [loading, setLoading] = useState(true);
  console.log("fromReport", user.userData);
  const userID = useSelector((state) =>
    state.user.userData ? state.user.userData._id : null
  );
  const userName = useSelector((state) =>
    state.user.userData ? state.user.userData.fullName : null
  );

  const userContact = useSelector((state) =>
    state.user.userData ? state.user.userData.contact : null
  );
  const userEmail = useSelector((state) =>
    state.user.userData ? state.user.userData.email : null
  );

  console.log(user);
  useEffect(() => {
    if (!user) {
      handleLogout();
    }
    setLoading(false); // Simulate loading completion
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("LoginPage");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const generateMedications = (className) => {
    switch (className) {
      // case "AD_Alzheimer_Disease":
      //   return "<ul><li>Medication A for Alzheimer Disease</li><li>Medication B for Alzheimer Disease</li></ul>";
      // case "CN_Cognitively_Normal":
      //   return "<p>Currently, no specific medications are recommended for cognitively normal individuals. However, it's essential to maintain a healthy lifestyle and regular check-ups with your healthcare provider. If you have any concerns or questions about your health, please don't hesitate to contact your doctor for personalized advice.</p>";
      // case "EMCI_Early_Mild_Cognitive_Impairment":
      //   return "<ul><li>Medication X for Early Mild Cognitive Impairment</li><li>Medication Y for Early Mild Cognitive Impairment</li></ul>";
      // case "LMCI_Late_Mild_Cognitive_Impairment":
      //   return "<ul><li>Medication L for Late Mild Cognitive Impairment</li><li>Medication M for Late Mild Cognitive Impairment</li></ul>";
      // case "MCI_Mild_Cognitive_Impairment":
      //   return "<ul><li>Medication P for Mild Cognitive Impairment</li><li>Medication Q for Mild Cognitive Impairment</li></ul>";
      default:
        return "<p>If you have any concerns or questions about your health, including medication options, please consult with your healthcare provider for personalized advice.</p>";
    }
  };

  const generateRecommendations = (className) => {
    switch (className) {
      case "AD_Alzheimer_Disease":
        return "<p>For Alzheimer's Disease, it's important to establish a routine, provide cognitive stimulation, engage in physical activity, maintain a balanced diet, and ensure safety at home to prevent accidents. Additionally, caregivers should seek support from healthcare professionals and community resources to manage symptoms and provide optimal care.</p>";
      case "CN_Cognitively_Normal":
        return "<p>For individuals who are cognitively normal, maintaining a healthy lifestyle is essential for brain health. This includes engaging in regular physical activity, eating a balanced diet rich in fruits, vegetables, and whole grains, getting adequate sleep, staying socially active, and managing stress. Regular check-ups with a healthcare provider can help monitor overall health and detect any early signs of cognitive decline.</p>";
      case "EMCI_Early_Mild_Cognitive_Impairment":
        return "<p>For individuals with Early Mild Cognitive Impairment (EMCI), lifestyle modifications such as engaging in cognitive training activities, staying mentally and socially active, participating in regular physical exercise, managing cardiovascular risk factors (e.g., hypertension, diabetes), and following a healthy diet (e.g., Mediterranean diet) may help slow the progression of cognitive decline. Regular monitoring and follow-up with a healthcare provider are important for disease management and treatment adjustments.</p>";
      case "LMCI_Late_Mild_Cognitive_Impairment":
        return "<p>For individuals with Late Mild Cognitive Impairment (LMCI), it's important to focus on maintaining cognitive function, managing symptoms, and optimizing quality of life. This may involve cognitive rehabilitation programs, memory aids, social support, and assistance with daily activities. Medications such as cholinesterase inhibitors may be prescribed to manage symptoms and improve cognitive function. Regular monitoring and follow-up with a healthcare provider are essential for monitoring disease progression and adjusting treatment as needed.</p>";
      case "MCI_Mild_Cognitive_Impairment":
        return "<p>For individuals with Mild Cognitive Impairment (MCI), lifestyle interventions such as engaging in regular physical exercise, following a healthy diet (e.g., Mediterranean diet), staying mentally and socially active, managing cardiovascular risk factors (e.g., hypertension, diabetes), and getting adequate sleep may help slow cognitive decline and reduce the risk of progression to dementia. Cognitive training programs and memory strategies may also be beneficial. Regular monitoring and follow-up with a healthcare provider are important for disease management and treatment optimization.</p>";
      default:
        return "<p>If you have any concerns or questions about your health, including personalized recommendations for managing cognitive health, please consult with your healthcare provider for tailored advice.</p>";
    }
  };

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medical Report</title>
  <style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .container {
        width: 80%;
        margin: 20px auto;
        background-color: rgba(255, 255, 255, 0.8); /* Adjust the opacity as needed */
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1, h2, h3 {
        color: #333;
    }
    p {
        color: #666;
        display: inline
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    th {
        background-color: #f2f2f2;
    }
    .logo {
       text-align: center;
       font-style: italic;
    }
    .text{
        text-align: center;
        font-weight: normal;
        font-size: 24px;
    }
    .note-text{
        margin: 10px;
        margin-top: 30px;
        font-size: 12px
    }
</style>
  </head>
  <body>
  <div class="container">
  <h1 class='logo'>AlzAware</h1>
  <h1 class='text'>(Mobile Early Alzheimer's Detection)</h1>
      <h1>Medical Report</h1>
      <p><strong>Name:</strong> ${
        userName ? userName : "*********"
      }</p> &nbsp;&nbsp;
      <p><strong>ID:</strong> ${userID ? userID : "*********"} </p> &nbsp;&nbsp;
      <p><strong>Contact:</strong> ${
        userContact ? userContact : "*********"
      }</p>&nbsp;&nbsp;<br/>
      <p><strong>Email:</strong>  ${
        userEmail ? userEmail : "*********"
      }</p> &nbsp;&nbsp;
      <p><strong>Print Date:</strong> ${day} - ${month}-${year}</p>&nbsp;&nbsp;
      <p><strong>Record-no:</strong> ${
        userID ? userID : "*********"
      } </p>&nbsp;&nbsp;
      <h2>Diagnosis or Findings</h2>
      <p> Detected Class: ${
        predictedData && predictedData.predictionResult
          ? predictedData.predictionResult.class_name
          : "*********"
      }</p>
  
      <h2>Overall Probabilities</h2>
      <table>
          <tr>
              <th>Class or Type</th>
              <th>Probability</th>
          </tr>
          <tr>
              <td>AD - Alzheimer Disease</td>
              <td>${
                predictedData && predictedData.predictionResult
                  ? predictedData.predictionResult.class_probabilities
                      .AD_Alzheimer_Disease
                  : "*********"
              }%</td>
          </tr>
          <tr>
              <td>CN - Cognitively Normal</td>
              <td>${
                predictedData && predictedData.predictionResult
                  ? predictedData.predictionResult.class_probabilities
                      .CN_Cognitively_Normal
                  : "*********"
              }%</td>
          </tr>
          <tr>
              <td>EMCI - Early Mild Cognitive Impairment</td>
              <td>${
                predictedData && predictedData.predictionResult
                  ? predictedData.predictionResult.class_probabilities
                      .EMCI_Early_Mild_Cognitive_Impairment
                  : "*********"
              }%</td>
          </tr>
          <tr>
              <td>LMCI - Late Mild Cognitive Impairment</td>
              <td>${
                predictedData && predictedData.predictionResult
                  ? predictedData.predictionResult.class_probabilities
                      .LMCI_Late_Mild_Cognitive_Impairment
                  : "*********"
              }%</td>
          </tr>
          <tr>
              <td>MCI - Mild Cognitive Impairment</td>
              <td>${
                predictedData && predictedData.predictionResult
                  ? predictedData.predictionResult.class_probabilities
                      .MCI_Mild_Cognitive_Impairment
                  : "*********"
              }%</td>
          </tr>
      </table>
      <h2>Medications</h2>
      ${generateMedications(
        predictedData && predictedData.predictionResult
          ? predictedData.predictionResult.class_name
          : ""
      )}
      <h2>Recommendations</h2>
      ${generateRecommendations(
        predictedData && predictedData.predictionResult
          ? predictedData.predictionResult.class_name
          : ""
      )}
     <div class='note-text'> Note: This is a computer generated report, does not require signature
      TEST PERFORMED ON AUTOMATED Machine trained Model.
      </div>
      </div>
  </body>
  </html>
  `;

  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  return (
    <View style={{ padding: 50, backgroundColor: "#4477CE" }}>
      <TouchableOpacity
        style={{ position: "absolute", top: 50, right: 20 }}
        onPress={handleLogout}
      >
        <Text style={{ color: "red", fontSize: 18 }}>Logout</Text>
      </TouchableOpacity>

      <Image
        source={require("../../assets/AlzAware.png")}
        style={{ margin: 10, marginLeft: 30, width: 200, height: 60 }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 5 }}>
              Patient's Name:
            </Text>
            <Text style={{ fontSize: 16 }}>
              {userName ? userName : "No Patient Found"}
            </Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 5 }}>
              Detected Stage:
            </Text>
            <Text style={{ fontSize: 16 }}>
              {predictedData && predictedData.predictionResult
                ? predictedData.predictionResult.class_name
                : "No Data Found"}
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Button title="Print" onPress={print} />
            <View style={{ marginTop: 10 }} />
            <Button title="Generate PDF file" onPress={printToFile} />
            {Platform.OS === "ios" && (
              <>
                <View style={styles.spacer} />
                <Button title="Select printer" onPress={selectPrinter} />
                <View style={styles.spacer} />
                {selectedPrinter ? (
                  <Text
                    style={styles.printer}
                  >{`Selected printer: ${selectedPrinter.name}`}</Text>
                ) : undefined}
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default ReportPage;

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 250,
  },
});
