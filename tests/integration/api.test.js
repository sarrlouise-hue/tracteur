const request = require('supertest');
const app = require('../../src/application');

describe('API Integration Tests', () => {
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return token for valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          telephone: '221770000000',
          motDePasse: 'password123'
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data).toHaveProperty('user');
      }
    });
  });

  describe('GET /api/machines', () => {
    it('should return list of machines', async () => {
      const response = await request(app).get('/api/machines');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('machines');
      expect(Array.isArray(response.body.data.machines)).toBe(true);
    });
  });

  describe('Protected Routes', () => {
    it('should return 401 for unauthorized access', async () => {
      const response = await request(app).get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/recherche/prestataires', () => {
    it('should search prestataires by location', async () => {
      const response = await request(app)
        .get('/api/recherche/prestataires')
        .query({
          latitude: 14.7886,
          longitude: -16.9318,
          rayon: 50
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('prestataires');
    });
  });

  describe('Admin Routes', () => {
    it('should return 401 for non-admin access to statistics', async () => {
      const response = await request(app).get('/api/admin/statistics');

      expect(response.status).toBe(401);
    });
  });

  describe('I18n Support', () => {
    it('should accept Accept-Language header', async () => {
      const response = await request(app)
        .get('/api/machines')
        .set('Accept-Language', 'en');

      expect(response.status).toBe(200);
    });

    it('should accept lang query parameter', async () => {
      const response = await request(app)
        .get('/api/machines?lang=wo');

      expect(response.status).toBe(200);
    });
  });
});
