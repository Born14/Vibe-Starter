import '@testing-library/jest-dom';

// Mock environment variables for tests
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-min';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL = 'redis://localhost:6379';
