import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReminderPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [remindersData, setRemindersData] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editReminderId, setEditReminderId] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem("reminders");
      if (storedReminders) {
        setRemindersData(JSON.parse(storedReminders));
      }
    } catch (error) {
      console.error("Error loading reminders:", error);
    }
  };

  const saveReminders = async (updatedReminders) => {
    try {
      await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
    } catch (error) {
      console.error("Error saving reminders:", error);
    }
  };

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.date) {
      if (editReminderId !== null) {
        const updatedReminders = remindersData.map((reminder) =>
          reminder.id === editReminderId
            ? { ...reminder, ...newReminder }
            : reminder
        );
        setEditReminderId(null);
        saveReminders(updatedReminders);
      } else {
        const updatedReminders = [
          ...remindersData,
          {
            id: String(remindersData.length + 1),
            title: newReminder.title,
            date: newReminder.date.toDateString(),
            time: newReminder.date.toLocaleTimeString(),
          },
        ];
        setRemindersData(updatedReminders);
        saveReminders(updatedReminders);
      }
      setModalVisible(false);
      setNewReminder({ title: "", date: new Date() });
    }
  };

  const handleEdit = (id) => {
    const reminderToEdit = remindersData.find((reminder) => reminder.id === id);
    if (reminderToEdit) {
      setNewReminder({
        title: reminderToEdit.title,
        date: new Date(reminderToEdit.date),
      });
      setEditReminderId(id);
      setModalVisible(true);
    }
  };

  const handleDelete = (id) => {
    const updatedReminders = remindersData.filter(
      (reminder) => reminder.id !== id
    );
    setRemindersData(updatedReminders);
    saveReminders(updatedReminders);
  };

  const ReminderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <View style={styles.reminderDetails}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text>{`${item.date} at ${item.time}`}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleEdit(item.id)}
        >
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDelete(item.id)}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/AlzAware.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.heading}>Reminders</Text>
      {remindersData.length === 0 && (
        <Text style={styles.noRemindersText}>No Reminders Set.</Text>
      )}
      <FlatList
        data={remindersData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReminderItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <TouchableOpacity
        style={styles.addReminderButton}
        onPress={() => {
          setModalVisible(true);
          setEditReminderId(null);
        }}
      >
        <Text style={styles.addReminderButtonText}>Add New Reminder</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeading}>
            {editReminderId !== null ? "Edit Reminder" : "Add New Reminder"}
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.remindTitle}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              value={newReminder.title}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, title: text })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.remindTitle}>Date</Text>
            <TouchableOpacity
              style={styles.datePickerInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{newReminder.date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newReminder.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewReminder({
                      ...newReminder,
                      date: selectedDate,
                    });
                  }
                }}
              />
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.remindTitle}>Time</Text>
            <TouchableOpacity
              style={styles.datePickerInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{newReminder.date.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={newReminder.date}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    const selectedDate = new Date(newReminder.date);
                    selectedDate.setHours(selectedTime.getHours());
                    selectedDate.setMinutes(selectedTime.getMinutes());
                    setNewReminder({
                      ...newReminder,
                      date: selectedDate,
                    });
                  }
                }}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleAddReminder}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3479CC",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 60,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  noRemindersText: {
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 20,
    color: "red",
  },
  reminderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  reminderDetails: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    padding: 10,
    backgroundColor: "#dddddd",
    borderRadius: 5,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#dddddd",
    marginVertical: 5,
  },
  addReminderButton: {
    backgroundColor: "#7FC7D9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },
  addReminderButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  remindTitle: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 15,
  },
  datePickerInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 15,
    marginTop: 5,
    backgroundColor: "white",
    justifyContent: "center",
  },
  doneButton: {
    backgroundColor: "#4477CE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ReminderPage;
