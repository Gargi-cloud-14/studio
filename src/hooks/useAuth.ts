"use client";

// This is a mock authentication hook for prototype purposes.
// In a real application, this would integrate with a full authentication service.
export const useAuth = () => {
  return {
    isLoggedIn: true,
    user: {
      id: 'user_123',
      name: 'Alex Doe',
      email: 'alex.doe@example.com',
    },
  };
};
