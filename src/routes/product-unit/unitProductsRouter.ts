import { Router } from 'express';
import {
  createProductUnit,
  getAllProductUnits,
  getProductUnitById,
  updateProductUnit,
  deleteProductUnit} from "../../controllers/unitProcutsControllers"

import { validateProductUnitInput } from '../../middleware/isValidUnit';

const productUnitRoutes = Router();

productUnitRoutes.post('/',validateProductUnitInput, createProductUnit);
productUnitRoutes.get('/', getAllProductUnits);
productUnitRoutes.get('/:id', getProductUnitById);
productUnitRoutes.patch('/:id', validateProductUnitInput, updateProductUnit);
productUnitRoutes.delete('/:id', deleteProductUnit);

export default productUnitRoutes;
