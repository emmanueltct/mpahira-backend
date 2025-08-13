import express from 'express';
import { flutterwaveWebhookHandler, generateflutterwaveWebhookHandler, initiateMobileMoneyAuthRedirect, manualVerifyPayment, paymentCallback } from '../controllers/paymentController';
import { isAuthenticated } from '../middleware/isAuthenticated';

const router = express.Router();

router.post('/start-mobilemoney-payment',isAuthenticated, initiateMobileMoneyAuthRedirect);
router.get('/payment-result',paymentCallback)
router.post('/flutterwave-webhook', flutterwaveWebhookHandler);
router.post('/generateflutterwave-signature', generateflutterwaveWebhookHandler);
router.get('/verify/:transaction_id',manualVerifyPayment) ;


export default router;
