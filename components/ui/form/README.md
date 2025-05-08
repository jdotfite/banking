# Form Components

This directory contains reusable form components designed to standardize input fields, buttons, and form layouts across the application.

## Components

### FormInput

A reusable input component with floating label, animated underline, and error handling.

```tsx
import { FormInput } from '../components/ui/form';

<FormInput
  id="firstName"
  label="First Name"
  value={formData.firstName}
  onChange={(value) => handleChange('firstName', value)}
  error={errors.firstName}
  autoComplete="given-name"
  autoCapitalize="words"
  autoFocus
/>
```

### PasswordInput

A specialized input for password fields with show/hide toggle functionality.

```tsx
import { PasswordInput } from '../components/ui/form';

<PasswordInput
  id="password"
  label="Password"
  value={formData.password}
  onChange={(value) => handleChange('password', value)}
  error={errors.password}
  autoComplete="new-password"
/>
```

### PhoneInput

A specialized input for phone numbers with automatic formatting.

```tsx
import { PhoneInput } from '../components/ui/form';

<PhoneInput
  id="phone"
  label="Mobile Phone Number"
  value={formData.phone}
  onChange={(value) => handleChange('phone', value)}
  error={errors.phone}
/>
```

### Button

A standardized button component with loading state and variants.

```tsx
import { Button } from '../components/ui/form';

<Button 
  type="submit" 
  disabled={isSubmitting}
  isLoading={isSubmitting}
  variant="primary" // or "secondary"
>
  SUBMIT
</Button>
```

### FormContainer

A layout component for forms with standardized styling.

```tsx
import { FormContainer } from '../components/ui/form';

<FormContainer
  title="Create password"
  subtitle="Strong passwords keep your account safer"
>
  {/* Form content goes here */}
</FormContainer>
```

## Usage Guidelines

1. **Import Components**: Use the barrel export to import components:
   ```tsx
   import { FormInput, Button, FormContainer } from '../components/ui/form';
   ```

2. **Handle Changes**: The input components expect an `onChange` handler that accepts a string value:
   ```tsx
   const handleInputChange = (field: string) => (value: string) => {
     onChange(field, value);
   };
   
   <FormInput
     id="email"
     label="Email"
     value={formData.email}
     onChange={handleInputChange('email')}
   />
   ```

3. **Error Handling**: Pass error messages to display validation errors:
   ```tsx
   <FormInput
     id="email"
     label="Email"
     value={formData.email}
     onChange={handleInputChange('email')}
     error={errors.email}
   />
   ```

4. **Form Layout**: Use the FormContainer for consistent form layouts:
   ```tsx
   <FormContainer title="Contact Information">
     <form onSubmit={handleSubmit}>
       {/* Form fields */}
       <Button type="submit">Submit</Button>
     </form>
   </FormContainer>
   ```

## Benefits

- **Consistency**: Standardized appearance and behavior across all forms
- **Reduced Code Duplication**: Common patterns are encapsulated in reusable components
- **Maintainability**: Changes to form styling or behavior can be made in one place
- **Accessibility**: Built-in accessibility features like proper labeling and error handling
