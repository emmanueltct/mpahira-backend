import { Router } from 'express';
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole} from "../../controllers/roleControllers"
import { validateRoleInput } from '../../middleware/isValidRole';

const rolesRoutes = Router();

rolesRoutes.post('/',validateRoleInput, createRole);
rolesRoutes.get('/', getAllRoles);
rolesRoutes.get('/:id', getRoleById);
rolesRoutes.patch('/:id', validateRoleInput, updateRole);
rolesRoutes.delete('/:id', deleteRole);

export default rolesRoutes;
