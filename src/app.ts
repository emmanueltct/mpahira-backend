import express, { Application } from 'express';
import rolesRoutes from './routes/roles/rolesRouter';
import sequelize from './config/database';

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/roles', rolesRoutes);

// Sync DB and start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Database sync error:', err);
});
