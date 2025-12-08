module.exports = {
  apiKey: process.env.PAYTECH_API_KEY,
  apiSecret: process.env.PAYTECH_API_SECRET,
  baseUrl: process.env.PAYTECH_BASE_URL || 'https://paytech.sn/api',
  callbackSecret: process.env.PAYTECH_CALLBACK_SECRET,
  successUrl: process.env.PAYTECH_SUCCESS_URL || 'http://localhost:3000/payment/success',
  cancelUrl: process.env.PAYTECH_CANCEL_URL || 'http://localhost:3000/payment/cancel',
  ipnUrl: process.env.PAYTECH_IPN_URL || 'http://localhost:4000/api/payments/webhook',
  currency: 'XOF',
  supportedMethods: ['wave', 'orange_money', 'free_money', 'card']
};
