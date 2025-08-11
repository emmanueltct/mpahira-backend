import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct} from "../controllers/productControllers"
import { validateProductInput } from '../middleware/isValidProduct';

const productsRoutes = Router();

productsRoutes.post('/',validateProductInput, createProduct);
productsRoutes.get('/', getAllProducts);
productsRoutes.get('/:id', getProductById);
productsRoutes.patch('/:id', validateProductInput, updateProduct);
productsRoutes.delete('/:id', deleteProduct);

export default productsRoutes;
