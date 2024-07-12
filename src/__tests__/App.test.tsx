import React from 'react';
import { render } from '@testing-library/react-native';

import App from '../screens/App';

import { checkPermissions } from '../utilities/Permissions';

// Mock UUID generation with a fixed return value for consistency in tests
jest.mock('react-native-uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

// Mock Firebase Storage methods for consistent and isolated tests
const mockStorage = {
  ref: jest.fn().mockReturnValue({
    putFile: jest.fn(() => ({
      on: jest.fn(),
    })),
    getDownloadURL: jest.fn().mockResolvedValue('mock-url'),
    delete: jest.fn().mockResolvedValue(true),
  }),
  refFromURL: jest.fn(() => ({
    delete: jest.fn().mockResolvedValue(true),
  })),
  listAll: jest.fn().mockReturnValue({
    items: [
      {
        getDownloadURL: jest.fn().mockResolvedValue('mock-url-1'),
      },
      {
        getDownloadURL: jest.fn().mockResolvedValue('mock-url-2'),
      },
    ],
  }),
};

// Mock the default export of the @react-native-firebase/storage module
jest.mock('@react-native-firebase/storage', () => ({
  __esModule: true,
  default: () => mockStorage,
}));

// Mock the checkPermissions utility function
jest.mock('../utilities/Permissions', () => ({
  checkPermissions: jest.fn(),
}));

// Mock the components used in the App component with simple function components
jest.mock('../components/ImageUploadComponent', () => () => null);
jest.mock('../components/ImageGridComponent', () => () => null);
jest.mock('../components/ImagePickerComponent', () => () => null);
jest.mock('../components/UploadProgressComponent', () => () => null);

// Describe block for the App component tests
describe('App', () => {
  // Clear all mocks after each test to ensure no shared state between tests
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test to ensure the App component renders correctly
  it('renders correctly', () => {
    const { getByTestId, getByText } = render(<App />);
    expect(getByTestId('app')).toBeTruthy(); // Check if the main app container is rendered
    expect(getByText('Hey, Good Day!')).toBeTruthy(); // Check if the greeting text is rendered
  });

  // Test to ensure checkPermissions is called when the App component mounts
  it('calls checkPermissions on mount', () => {
    render(<App />);
    expect(checkPermissions).toHaveBeenCalled(); // Verify that checkPermissions is called
  });
});
