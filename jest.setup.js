import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Fix React Router / jsdom
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;