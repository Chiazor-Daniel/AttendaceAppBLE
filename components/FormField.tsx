import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

interface FormFieldProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  isRequired?: boolean;
  helperText?: string;
  onPress: () => void;
}

const FormField = ({
  label,
  value,
  placeholder,
  error,
  isRequired = false,
  helperText,
  onPress,
}: FormFieldProps) => {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label} {isRequired && <Text style={styles.required}>*</Text>}
        </Text>
        {helperText && <Text style={styles.helperText}>{helperText}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={onPress}
      >
        <Text
          style={[styles.dropdownPlaceholder, value && styles.dropdownValue]}
        >
          {value || placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color="#6b7280" />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600", // Updated from 500 to 600 to match AttendanceInProgress
    color: "#1f2937",
  },
  required: {
    color: "#dc2626",
    fontSize: 14,
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  dropdownError: {
    borderColor: "#dc2626",
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: "#9ca3af",
  },
  dropdownValue: {
    color: "#1f2937",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormField;
