import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Sem `globals: true` a testing-library não registra o cleanup sozinha.
afterEach(cleanup);
