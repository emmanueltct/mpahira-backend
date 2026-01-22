import express, {Request, Application } from 'express';

import { IncomingMessage, ServerResponse } from 'http';
import passport from 'passport';
import cors from 'cors';
import rolesRoutes from './routes/roles/rolesRouter';
import productUnitRoutes from './routes/product-unit/unitProductsRouter';
import authRoutes from "./routes/userRoutes"
import agentRoutes from "./routes/agentRoutes"
import marketRouter from './routes/marketRoutes';
import shopRouter from './routes/shopRoutes';
import productsRoutes from './routes/productRoutes';
import shopProductRouter from './routes/shopProductRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRouter from './routes/orderRoutes';
import paymentRoutes from "./routes/paymentRoutes";
import subCategoryRoutes from "./routes/productSubCategoryRoutes";
import sequelize from './config/database';
import './config/passport';
import favouriteMarketRoutes from './routes/favouriteMarketRoutes';
import deliveryLocationRoutes from './routes/deliveryLocationRoutes';
import bodyParser from 'body-parser';
import driverRoutes from './routes/driverRoutes';
import productPricing from "./routes/productPricing";
import subUnitProductRoutes from './routes/subUnitProductRoutes';
import reviewRoutes from "./routes/reviewRoutes";
import recommendProductRoutes from './routes/recommendProductRoutes';

const app: Application = express();
const PORT = process.env.PORT || 8000;

// ✅ CORS must be first middleware
app.use(cors({
  origin: ["http://localhost:3000", "https://mpahira.vercel.app","https://mpahira.netlify.app/"],
  credentials: true,
}));

// ✅ Parse raw body for webhooks before bodyParser.json
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    (req as any).rawBody = buf.toString();
  }
}));

// ✅ Express built-in JSON parser
app.use(express.json());

// ✅ Passport after body parsing
app.use(passport.initialize());

// ✅ Example route
app.get("/", (req, res) => {
  res.json({ message: "API is working with CORS" });
});


// Routes
app.use('/api/roles', rolesRoutes);
app.use('/api/product-units', productUnitRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/market',marketRouter)
app.use('/api/shop',shopRouter)
app.use('/api/products',productsRoutes)
app.use("/api/shop-products",shopProductRouter)
app.use('/api/carts', cartRoutes);
app.use('/api/orders',orderRouter)
app.use('/api/favourite-markets', favouriteMarketRoutes);
app.use('/api/delivery-locations', deliveryLocationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/sub-units",subUnitProductRoutes);

app.use("/api/product-pricing",productPricing);
app.use("/api/product-subcategories", subCategoryRoutes);
app.use("/api/product-reviews", reviewRoutes);
app.use("/api/recommend-products", recommendProductRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    ;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
// Sync DB and start server
sequelize.sync({ force: false }).then(() => {

  app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Database sync error:', err);
});
