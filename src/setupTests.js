// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock libraries that are ESM-only or cause Jest issues
jest.mock('lucide-react', () => ({
    Search: () => 'Search',
    ChevronLeft: () => 'Left',
    ChevronRight: () => 'Right',
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => 'ToastContainer',
}));
