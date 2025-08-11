import express from 'express';
import { flutterwaveWebhookHandler, generateflutterwaveWebhookHandler, initiateMobileMoneyAuthRedirect, manualVerifyPayment } from '../controllers/paymentController';

const router = express.Router();

router.post('/start-mobilemoney-payment', initiateMobileMoneyAuthRedirect);
router.post('/flutterwave-webhook', flutterwaveWebhookHandler);
router.post('/generateflutterwave-signature', generateflutterwaveWebhookHandler);
router.get('/verify/:transaction_id',manualVerifyPayment) ;


export default router;
