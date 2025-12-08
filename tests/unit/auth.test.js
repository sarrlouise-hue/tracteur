const authService = require('../../src/services/service.authentification');

describe('Authentication Service', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { id: '123', email: 'test@test.com' };
      const token = authService.generateToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'password123';
      const hash = await authService.hashPassword(password);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'password123';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'password123';
      const hash = await authService.hashPassword(password);
      const isMatch = await authService.comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'password123';
      const hash = await authService.hashPassword(password);
      const isMatch = await authService.comparePassword('wrongpassword', hash);
      expect(isMatch).toBe(false);
    });
  });
});
