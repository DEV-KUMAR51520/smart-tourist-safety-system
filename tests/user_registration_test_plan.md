# User Registration Test Plan

## Overview
This document outlines a comprehensive test plan for the user registration flow in the Smart Tourist Safety System mobile application. The tests cover the complete user journey from registration to account management.

## Test Environment
- Mobile Application: Smart Tourist Safety System
- Platform: React Native
- Test Device: Android/iOS simulator or physical device

## 1. New User Registration Test Cases

### TC-REG-001: Registration Form Validation
**Description:** Verify that the registration form properly validates all required fields.

**Steps:**
1. Navigate to the Registration screen
2. Leave all fields empty and attempt to submit
3. Fill in only some fields and attempt to submit
4. Enter invalid data formats (e.g., invalid email, short password)

**Expected Results:**
- Form should not submit with empty required fields
- Appropriate error messages should be displayed for each validation failure
- Aadhaar number should be validated for 12 digits
- Password should require minimum 8 characters
- Passwords must match in both fields

### TC-REG-002: Successful Registration with Valid Data
**Description:** Verify that a user can successfully register with valid information.

**Steps:**
1. Navigate to the Registration screen
2. Fill in all required fields with valid data:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Phone: "9876543210"
   - Aadhaar Number: "123456789012"
   - Password: "password123"
   - Confirm Password: "password123"
   - Nationality: "Indian"
   - Emergency Contact: "9876543211"
   - Trip Start Date: Current date
   - Trip End Date: Current date + 10 days
3. Submit the registration form

**Expected Results:**
- Registration should complete successfully
- User should receive a success message
- Digital ID should be generated and displayed
- User should be navigated to the Digital ID screen

### TC-REG-003: Registration with Existing User Data
**Description:** Verify system behavior when attempting to register with already registered information.

**Steps:**
1. Register a user successfully
2. Attempt to register again with the same phone number or Aadhaar number

**Expected Results:**
- System should reject the registration
- Appropriate error message should be displayed

## 2. Account Creation Verification Test Cases

### TC-VER-001: Digital ID Generation
**Description:** Verify that a digital ID is properly generated after successful registration.

**Steps:**
1. Complete registration process
2. Navigate to the Digital ID screen

**Expected Results:**
- Digital ID screen should display a valid ID number
- QR code should be generated
- ID should contain user's name and valid dates
- Blockchain verification hash should be displayed

### TC-VER-002: Login with New Account
**Description:** Verify that the newly registered user can log in successfully.

**Steps:**
1. Complete registration process
2. Log out of the application
3. Navigate to the Login screen
4. Enter the registered phone number and password
5. Submit login form

**Expected Results:**
- Login should be successful
- User should be navigated to the main dashboard
- User information should be correctly displayed

## 3. Profile Management Test Cases

### TC-PROF-001: View Profile Information
**Description:** Verify that user can view their profile information.

**Steps:**
1. Log in with registered credentials
2. Navigate to the Profile screen

**Expected Results:**
- Profile screen should display correct user information
- Name, email, phone number, and tourist ID should be visible
- Trip details should be correctly displayed

### TC-PROF-002: Update Profile Information
**Description:** Verify that user can update their profile information.

**Steps:**
1. Navigate to the Profile screen
2. Attempt to edit profile information

**Expected Results:**
- Editable fields should allow modifications
- Changes should be saved successfully
- Updated information should be displayed after saving

### TC-PROF-003: Emergency Contact Management
**Description:** Verify that user can manage emergency contacts.

**Steps:**
1. Navigate to the Profile screen
2. Expand the Emergency Contacts section
3. View existing contacts
4. Attempt to add a new emergency contact

**Expected Results:**
- Existing emergency contacts should be displayed
- User should be able to add new contacts
- New contacts should be saved and displayed

## 4. Account Settings Test Cases

### TC-SET-001: Notification Settings
**Description:** Verify that user can toggle notification settings.

**Steps:**
1. Navigate to the Profile screen
2. Locate the Notifications toggle in Settings section
3. Change the toggle state

**Expected Results:**
- Toggle should change state when clicked
- Setting should be saved
- Setting should persist after app restart

### TC-SET-002: Location Tracking Settings
**Description:** Verify that user can toggle location tracking settings.

**Steps:**
1. Navigate to the Profile screen
2. Locate the Location Tracking toggle in Settings section
3. Change the toggle state

**Expected Results:**
- Toggle should change state when clicked
- Setting should be saved
- Setting should persist after app restart

### TC-SET-003: Language Settings
**Description:** Verify that user can change language settings.

**Steps:**
1. Navigate to the Profile screen
2. Locate the Language selector in Settings section
3. Change the language

**Expected Results:**
- Language should change when selected
- UI text should update to the selected language
- Setting should persist after app restart

### TC-SET-004: Logout Functionality
**Description:** Verify that user can log out of the application.

**Steps:**
1. Navigate to the Profile screen
2. Locate and tap the Logout button
3. Confirm logout in the confirmation dialog

**Expected Results:**
- Confirmation dialog should be displayed
- After confirmation, user should be logged out
- User should be redirected to the login screen
- User session should be terminated

## Test Results Summary

| Test Case ID | Test Case Description | Status | Notes |
|--------------|------------------------|--------|-------|
| TC-REG-001   | Registration Form Validation | | |
| TC-REG-002   | Successful Registration | | |
| TC-REG-003   | Registration with Existing User | | |
| TC-VER-001   | Digital ID Generation | | |
| TC-VER-002   | Login with New Account | | |
| TC-PROF-001  | View Profile Information | | |
| TC-PROF-002  | Update Profile Information | | |
| TC-PROF-003  | Emergency Contact Management | | |
| TC-SET-001   | Notification Settings | | |
| TC-SET-002   | Location Tracking Settings | | |
| TC-SET-003   | Language Settings | | |
| TC-SET-004   | Logout Functionality | | |