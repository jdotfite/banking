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
  window.location.reload();
};

/**
 * Auto-fills current screen and advances to next screen
 */
export const autoFillAndAdvance = () => {
  // Set a flag in localStorage to indicate auto-fill is active
  localStorage.setItem('autoFillActive', 'true');
  
  // Create or recreate the auto-fill indicator
  createAutoFillIndicator();
};

// Fill current screen with test data
export const fillCurrentScreen = (): Promise<void> => {
  console.log('Filling current screen with test data');
  const currentScreen = determineCurrentScreen();
  console.log('Current screen:', currentScreen);
  
  if (!currentScreen) {
    console.error('Could not determine current screen');
    return Promise.resolve();
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
  
  console.log('Using test data:', testData);

  // Store the current URL to return to after reload
  const currentUrl = window.location.href;
  
  // Store the test data in localStorage
  try {
    // Get existing form data if any
    const existingData = JSON.parse(localStorage.getItem('signupFormData') || '{}');
    // Merge with new test data
    const updatedFormData = { ...existingData, ...testData };
    // Save back to localStorage
    localStorage.setItem('signupFormData', JSON.stringify(updatedFormData));
    console.log('Updated form data in localStorage:', updatedFormData);
    
    // Set a flag to indicate we should submit the form after reload
    localStorage.setItem('autoFillSubmitAfterLoad', 'true');
    
    // Reload the page to let React initialize with the data from localStorage
    // This is a more reliable way to update React's state
    window.location.reload();
    
    // Return a promise that never resolves since we're reloading the page
    return new Promise<void>(() => {});
  } catch (e) {
    console.error('Error updating form data in localStorage:', e);
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

/**
 * Creates the auto-fill indicator with play and stop buttons
 */
export const createAutoFillIndicator = () => {
  // Remove existing indicator if it exists
  const existingIndicator = document.getElementById('auto-fill-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }

  // Create floating indicator
  const indicator = document.createElement('div');
  indicator.id = 'auto-fill-indicator';
  indicator.style.position = 'fixed';
  indicator.style.bottom = '80px';
  indicator.style.right = '20px';
  indicator.style.backgroundColor = 'rgba(79, 70, 229, 0.9)';
  indicator.style.color = 'white';
  indicator.style.padding = '8px 16px';
  indicator.style.borderRadius = '20px';
  indicator.style.zIndex = '1000';
  indicator.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  indicator.style.display = 'flex';
  indicator.style.alignItems = 'center';
  indicator.style.gap = '8px';

  const playButton = document.createElement('button');
  playButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  `;
  playButton.style.background = 'none';
  playButton.style.border = 'none';
  playButton.style.cursor = 'pointer';
  playButton.onclick = () => {
    console.log('Play button clicked');
    fillCurrentScreen().then(() => {
      console.log('Form filled, clicking next button');
      clickNextButton();
    });
  };

  const stopButton = document.createElement('button');
  stopButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
    </svg>
  `;
  stopButton.style.background = 'none';
  stopButton.style.border = 'none';
  stopButton.style.cursor = 'pointer';
  stopButton.onclick = () => {
    console.log('Stop button clicked');
    // Remove the auto-fill active flag
    localStorage.removeItem('autoFillActive');
    
    // Remove the indicator
    indicator.remove();
  };

  indicator.appendChild(playButton);
  indicator.appendChild(document.createTextNode('Auto-fill'));
  indicator.appendChild(stopButton);
  document.body.appendChild(indicator);
  
  console.log('Auto-fill indicator created');
};

export const autoCompleteSignup = () => {
  localStorage.setItem('signupFormData', JSON.stringify({
    ...testUserData.basic,
    ...testUserData.dateOfBirth,
    ...testUserData.mobilePhone,
    ...testUserData.address,
    ...testUserData.password
  }));
  window.location.href = '/signup';
};
