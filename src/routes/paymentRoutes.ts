import express from 'express';
import { initiateMobileMoneyAuthRedirect } from '../controllers/paymentController';

const router = express.Router();

router.post('/start-mobilemoney-payment', initiateMobileMoneyAuthRedirect);

export default router;
