import { Request, Response } from 'express';
import { roleAttribute } from "../interfaces/roleInterface";
import Role from '../models/roleModel';

// Create a new role
export const createRole = async (req: Request<{}, {}, Pick<roleAttribute, 'role'>>, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    const newRole = await Role.create({ role });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: 'Error creating role', error });
  }
};

// Get all roles
export const getAllRoles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const roles: roleAttribute[] = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error });
  }
};

// Get role by ID
export const getRoleById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching role', error });
  }
};

// Update an existing role by ID
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const existingRole = await Role.findByPk(id);
    if (!existingRole) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    // Check if the new role name already exists (and is not the same as current)
    const duplicate = await Role.findOne({ where: { role } });
    if (duplicate && duplicate.id !== id) {
      res.status(409).json({ message: 'Role name already in use' });
      return;
    }

    existingRole.role = role;
    await existingRole.save();

    res.status(200).json({ message: 'Role updated successfully', role: existingRole });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role', error });
  }
};

// Delete a role by ID
export const deleteRole = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const deleted = await Role.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role', error });
  }
};
