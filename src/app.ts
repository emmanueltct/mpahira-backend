import express, { Application } from 'express';
import passport from 'passport';
import rolesRoutes from './routes/roles/rolesRouter';
import productUnitRoutes from './routes/product-unit/unitProductsRouter';
import authRoutes from "./routes/userRoutes"
import sequelize from './config/database';
import './config/passport';

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(passport.initialize());


// Routes
app.use('/api/roles', rolesRoutes);
app.use('/api/product-units', productUnitRoutes);
app.use('/api/auth', authRoutes);

// Sync DB and start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Database sync error:', err);
});
