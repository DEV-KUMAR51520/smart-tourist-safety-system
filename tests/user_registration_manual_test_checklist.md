# User Registration Manual Test Checklist

## Overview
This checklist provides step-by-step instructions for manually testing the user registration flow in the Smart Tourist Safety System mobile application. Use this document to verify that all aspects of the registration process, account verification, profile management, and account settings function correctly.

## Test Environment Setup
- [ ] Ensure the mobile application is installed on a test device
- [ ] Verify test device has internet connectivity
- [ ] Clear application cache and data (if previously installed)
- [ ] Ensure test accounts are available for testing

## 1. Registration Form Validation

### TC-REG-001: Required Field Validation
- [ ] Launch the application and navigate to the Register screen
- [ ] Leave all fields empty and tap the Register button
- [ ] Verify error messages appear for all required fields
- [ ] Enter a password less than 8 characters
- [ ] Verify "Password must be at least 8 characters" error message appears
- [ ] Enter different passwords in Password and Confirm Password fields
- [ ] Verify "Passwords do not match" error message appears
- [ ] Enter an invalid Aadhaar number (less than 12 digits)
- [ ] Verify "Aadhaar number must be 12 digits" error message appears

### TC-REG-002: Valid Data Registration
- [ ] Enter valid data in all required fields:
  - [ ] Full Name: "Test User"
  - [ ] Email: "testuser@example.com"
  - [ ] Phone Number: "9876543210"
  - [ ] Aadhaar Number: "123456789012"
  - [ ] Password: "password123"
  - [ ] Confirm Password: "password123"
  - [ ] Trip Start Date: Current date
  - [ ] Trip End Date: Current date + 7 days
- [ ] Tap the Register button
- [ ] Verify registration is successful

## 2. Account Verification

### TC-VER-001: Digital ID Generation
- [ ] After successful registration, verify navigation to Digital ID screen
- [ ] Verify Digital ID is displayed with a unique ID number
- [ ] Verify blockchain verification status is displayed
- [ ] Verify issued date and expiry date are displayed correctly
- [ ] Verify QR code is generated and displayed
- [ ] Tap "Download ID" button and verify ID can be saved to device

## 3. Profile Management

### TC-PROF-001: View Profile Information
- [ ] Navigate to Profile screen
- [ ] Verify personal information section displays correct user details:
  - [ ] Name
  - [ ] Email
  - [ ] Phone number
  - [ ] Nationality
- [ ] Verify trip details section displays correct information:
  - [ ] Trip start date
  - [ ] Trip end date
  - [ ] Entry point
  - [ ] Itinerary

### TC-PROF-002: Emergency Contacts Management
- [ ] Tap to expand Emergency Contacts section
- [ ] Verify emergency contacts list is displayed (if any)
- [ ] Tap "Add Emergency Contact" button
- [ ] Enter new contact details and save
- [ ] Verify new contact appears in the list
- [ ] Tap to delete an emergency contact
- [ ] Verify contact is removed from the list

## 4. Account Settings

### TC-SET-001: Notification Settings
- [ ] Navigate to Settings section in Profile
- [ ] Toggle Notifications setting
- [ ] Verify toggle state changes
- [ ] Exit and re-enter the Profile screen
- [ ] Verify notification setting state is preserved

### TC-SET-002: Location Tracking Settings
- [ ] Toggle Location Tracking setting
- [ ] Verify toggle state changes
- [ ] Exit and re-enter the Profile screen
- [ ] Verify location tracking setting state is preserved

### TC-SET-003: Language Settings
- [ ] Tap Language selector
- [ ] Select a different language
- [ ] Verify UI text changes to selected language
- [ ] Change back to original language

### TC-SET-004: Logout Functionality
- [ ] Tap Logout button
- [ ] Verify confirmation dialog appears
- [ ] Tap "Yes" to confirm logout
- [ ] Verify navigation to Login screen
- [ ] Attempt to navigate back to Profile screen
- [ ] Verify user is redirected to Login screen

## 5. Login After Registration

### TC-LOG-001: Login with Registered Credentials
- [ ] Navigate to Login screen
- [ ] Enter registered phone number and password
- [ ] Tap Login button
- [ ] Verify successful login
- [ ] Verify navigation to Home screen

## Test Results Summary

| Test Case ID | Test Case Description | Status | Comments |
|--------------|------------------------|--------|----------|
| TC-REG-001   | Required Field Validation | | |
| TC-REG-002   | Valid Data Registration | | |
| TC-VER-001   | Digital ID Generation | | |
| TC-PROF-001  | View Profile Information | | |
| TC-PROF-002  | Emergency Contacts Management | | |
| TC-SET-001   | Notification Settings | | |
| TC-SET-002   | Location Tracking Settings | | |
| TC-SET-003   | Language Settings | | |
| TC-SET-004   | Logout Functionality | | |
| TC-LOG-001   | Login with Registered Credentials | | |

## Issues and Observations

| Issue ID | Description | Severity | Steps to Reproduce |
|----------|-------------|----------|--------------------|
| | | | |

## Tester Information

**Tested By:** _________________________

**Date:** _________________________

**Signature:** _________________________