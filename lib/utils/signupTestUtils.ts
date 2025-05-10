/**
 * Utility functions for testing the signup flow
 * 
 * These utilities help developers test the signup flow by:
 * - Auto-filling individual screens
 * - Auto-filling and advancing through screens
 * - Auto-completing the entire signup process
 */

// Sample test data for auto-filling signup forms
export const testUserData = {
  basic: {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser+${Date.now()}@example.com`,
  },
  dateOfBirth: {
    dobValue: '01/01/1990',
  },
  mobilePhone: {
    mobilePhone: '5551234567',
  },
  address: {
    streetAddress: '123 Main St',
    aptSuite: 'Apt 4B',
    zipCode: '10001',
    city: 'New York',
    state: 'NY',
  },
  password: {
    password: 'TestPassword123!',
  }
};

// Map of screen names to their corresponding step in the flow
export const screenStepMap = {
  'basic': 0,
  'dateOfBirth': 1,
  'mobilePhone': 2,
  'address': 3,
  'password': 4
};

// Function to auto-fill a specific signup screen
export const autoFillSignupScreen = (screenName: string) => {
  const currentFormData = JSON.parse(localStorage.getItem('signupFormData') || '{}');
  let updatedFormData = { ...currentFormData };
  
  switch (screenName) {
    case 'basic':
      updatedFormData = { ...updatedFormData, ...testUserData.basic };
      break;
    case 'dateOfBirth':
      updatedFormData = { ...updatedFormData, ...testUserData.dateOfBirth };
      break;
    case 'mobilePhone':
      updatedFormData = { ...updatedFormData, ...testUserData.mobilePhone };
      break;
    case 'address':
      updatedFormData = { ...updatedFormData, ...testUserData.address };
      break;
    case 'password':
      updatedFormData = { ...updatedFormData, ...testUserData.password };
      break;
    case 'all':
      updatedFormData = {
        ...testUserData.basic,
        ...testUserData.dateOfBirth,
        ...testUserData.mobilePhone,
        ...testUserData.address,
        ...testUserData.password,
      };
      break;
    default:
      console.error(`Unknown screen name: ${screenName}`);
      return;
  }
  
  localStorage.setItem('signupFormData', JSON.stringify(updatedFormData));
  
  // Set bypass cookie to ensure middleware doesn't redirect
  document.cookie = 'bypass_preloader=true; path=/';
  
  window.location.reload();
};

/**
 * Auto-fills current screen and advances to next screen
 * without reloading the page or hiding the tester overlay
 */
export const autoFillAndAdvance = () => {
  // Fill current screen with test data
  const currentScreen = determineCurrentScreen();
  if (!currentScreen) {
    console.error('Could not determine current screen');
    return;
  }

  // Get the test data for the current screen
  let testData = {};
  switch (currentScreen) {
    case 'basic':
      testData = testUserData.basic;
      break;
    case 'dateOfBirth':
      testData = testUserData.dateOfBirth;
      break;
    case 'mobilePhone':
      testData = testUserData.mobilePhone;
      break;
    case 'address':
      testData = testUserData.address;
      break;
    case 'password':
      testData = testUserData.password;
      break;
  }

  // Simulate filling the form fields directly
  (Object.entries(testData) as [string, string | number | Date][]).forEach(([field, value]) => {
    const input = document.querySelector(`input[name="${field}"], input#${field}`) as HTMLInputElement;
    if (input) {
      // Convert value to string if needed
      const stringValue = typeof value === 'string' ? value : String(value);
      input.value = stringValue;
      // Trigger React's onChange handler
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  });

  // Wait briefly for state updates then click next
  setTimeout(() => {
    clickNextButton();
  }, 100);
};

// Fill current screen with test data (legacy version that reloads page)
export const fillCurrentScreen = (): Promise<void> => {
  console.warn('Using legacy fillCurrentScreen that reloads page');
  const currentScreen = determineCurrentScreen();
  if (!currentScreen) {
    console.error('Could not determine current screen');
    return Promise.resolve();
  }

  let testData = {};
  switch (currentScreen) {
    case 'basic':
      testData = testUserData.basic;
      break;
    case 'dateOfBirth':
      testData = testUserData.dateOfBirth;
      break;
    case 'mobilePhone':
      testData = testUserData.mobilePhone;
      break;
    case 'address':
      testData = testUserData.address;
      break;
    case 'password':
      testData = testUserData.password;
      break;
  }

  try {
    const existingData = JSON.parse(localStorage.getItem('signupFormData') || '{}');
    const updatedFormData = { ...existingData, ...testData };
    localStorage.setItem('signupFormData', JSON.stringify(updatedFormData));
    localStorage.setItem('autoFillSubmitAfterLoad', 'true');
    document.cookie = 'bypass_preloader=true; path=/';
    window.location.reload();
    return new Promise<void>(() => {});
  } catch (e) {
    console.error('Error updating form data:', e);
    return Promise.resolve();
  }
};

// Check if we should submit the form after page load
export const checkAndSubmitAfterLoad = (): void => {
  const shouldSubmit = localStorage.getItem('autoFillSubmitAfterLoad') === 'true';
  if (shouldSubmit) {
    console.log('Auto-submitting form after page load');
    // Remove the flag
    localStorage.removeItem('autoFillSubmitAfterLoad');
    
    // Wait for React to initialize and then click the submit button
    setTimeout(() => {
      clickNextButton();
    }, 500);
  }
};

// Click next button to advance to the next screen
export const clickNextButton = () => {
  console.log('Clicking next button');
  
  // First try to find the submit button in the form
  const form = document.querySelector('form');
  if (form) {
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      console.log('Found submit button in form, clicking');
      submitButton.click();
      return;
    }
  }
  
  // If no submit button in form, try other selectors
  const buttonSelectors = [
    'button[type="submit"]',
    'form button',
    'button.primary',
    'button:contains("NEXT")',
    'button:contains("Next")'
  ];
  
  for (const selector of buttonSelectors) {
    try {
      const buttons = document.querySelectorAll(selector);
      if (buttons.length > 0) {
        // Try to find a button with text containing "next"
        for (let i = 0; i < buttons.length; i++) {
          const button = buttons[i] as HTMLButtonElement;
          const buttonText = button.textContent?.toLowerCase() || '';
          if (buttonText.includes('next')) {
            console.log('Found next button by text, clicking');
            button.click();
            return;
          }
        }
        
        // If no button with "next" text, click the first one
        console.log('Found button by selector, clicking');
        (buttons[0] as HTMLButtonElement).click();
        return;
      }
    } catch (e) {
      // Some selectors might not be valid, ignore errors
    }
  }
  
  // Last resort: try to find any button
  const allButtons = document.querySelectorAll('button');
  if (allButtons.length > 0) {
    console.log('Trying all buttons as last resort');
    // Look for a button that might be a submit button
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i] as HTMLButtonElement;
      const buttonText = button.textContent?.toLowerCase() || '';
      if (buttonText.includes('next') || buttonText.includes('submit') || buttonText.includes('continue')) {
        console.log('Found likely submit button, clicking');
        button.click();
        return;
      }
    }
  }
  
  console.error('Could not find any next/submit button');
};

// Determine which screen is currently displayed
export const determineCurrentScreen = () => {
  if (document.querySelector('input[name="firstName"]') || document.querySelector('input#firstName')) return 'basic';
  if (document.querySelector('input#dob-input')) return 'dateOfBirth';
  if (document.querySelector('input[name="mobilePhone"]') || document.querySelector('input#mobilePhone')) return 'mobilePhone';
  if (document.querySelector('input[name="streetAddress"]') || document.querySelector('input#streetAddress')) return 'address';
  if (document.querySelector('input[name="password"]') || document.querySelector('input#password')) return 'password';
  return null;
};


export const autoCompleteSignup = () => {
  localStorage.setItem('signupFormData', JSON.stringify({
    ...testUserData.basic,
    ...testUserData.dateOfBirth,
    ...testUserData.mobilePhone,
    ...testUserData.address,
    ...testUserData.password
  }));
  // Set bypass cookie to ensure middleware doesn't redirect
  document.cookie = 'bypass_preloader=true; path=/';
  window.location.href = '/signup';
};
