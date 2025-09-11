import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, Image } from 'react-native';
import { TextInput, Button } from '../../components/forms';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadhaarNumber: '',
    password: '',
    confirmPassword: '',
    nationality: 'Indian', // Default value
    emergencyContact: '',
    tripStartDate: '',
    tripEndDate: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.aadhaarNumber) newErrors.aadhaarNumber = 'Aadhaar number is required';
    if (formData.aadhaarNumber && formData.aadhaarNumber.length !== 12) {
      newErrors.aadhaarNumber = 'Aadhaar number must be 12 digits';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.emergencyContact) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.tripStartDate) newErrors.tripStartDate = 'Trip start date is required';
    if (!formData.tripEndDate) newErrors.tripEndDate = 'Trip end date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Import the AuthService
      const { AuthService } = require('../../services/api/AuthService');
      
      // Prepare registration data
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        aadhaar_number: formData.aadhaarNumber,
        password: formData.password,
        nationality: formData.nationality,
        emergency_contact: formData.emergencyContact,
        trip_start_date: formData.tripStartDate,
        trip_end_date: formData.tripEndDate
      };
      
      // Call the register method from AuthService
      const response = await AuthService.register(registrationData);
      
      // Show success message
      Alert.alert(
        'Registration Successful',
        `Your digital tourist ID ${response.digital_id.id} has been created. You can now access the app.`,
        [{ text: 'View Digital ID', onPress: () => navigation.navigate('DigitalID', { digitalId: response.digital_id }) }]
      );
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>Tourist Registration</Text>
        <Text style={styles.subtitle}>Create your digital tourist ID</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <TextInput
          label="Full Name"
          value={formData.name}
          onChangeText={(value) => updateFormData('name', value)}
          placeholder="Enter your full name"
          error={errors.name}
          autoCapitalize="words"
        />

        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          placeholder="Enter your email"
          keyboardType="email-address"
          error={errors.email}
        />

        <TextInput
          label="Phone Number"
          value={formData.phone}
          onChangeText={(value) => updateFormData('phone', value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          error={errors.phone}
          maxLength={10}
        />

        <TextInput
          label="Aadhaar Number"
          value={formData.aadhaarNumber}
          onChangeText={(value) => updateFormData('aadhaarNumber', value)}
          placeholder="Enter your 12-digit Aadhaar number"
          keyboardType="numeric"
          error={errors.aadhaarNumber}
          maxLength={12}
        />

        <Text style={styles.sectionTitle}>Trip Information</Text>

        <TextInput
          label="Trip Start Date"
          value={formData.tripStartDate}
          onChangeText={(value) => updateFormData('tripStartDate', value)}
          placeholder="DD/MM/YYYY"
          error={errors.tripStartDate}
        />

        <TextInput
          label="Trip End Date"
          value={formData.tripEndDate}
          onChangeText={(value) => updateFormData('tripEndDate', value)}
          placeholder="DD/MM/YYYY"
          error={errors.tripEndDate}
        />

        <Text style={styles.sectionTitle}>Emergency Contact</Text>

        <TextInput
          label="Emergency Contact Number"
          value={formData.emergencyContact}
          onChangeText={(value) => updateFormData('emergencyContact', value)}
          placeholder="Enter emergency contact number"
          keyboardType="phone-pad"
          error={errors.emergencyContact}
          maxLength={10}
        />

        <Text style={styles.sectionTitle}>Security</Text>

        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={(value) => updateFormData('password', value)}
          placeholder="Create a password"
          secureTextEntry
          error={errors.password}
        />

        <TextInput
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(value) => updateFormData('confirmPassword', value)}
          placeholder="Confirm your password"
          secureTextEntry
          error={errors.confirmPassword}
        />

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By registering, you agree to our Terms of Service and Privacy Policy.
            Your data will be securely stored and used only for safety purposes.
          </Text>
        </View>

        <Button
          title="Register & Create Digital ID"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Text 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  termsContainer: {
    marginVertical: 16,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;