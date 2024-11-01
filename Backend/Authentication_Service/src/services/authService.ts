import axios from "axios";
import User, { IUser } from "../models/Auth";
//import bcrypt from 'bcryptjs';

export const createAdminUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const { org_id, username, email, password } = userData;
  
  try {
    // Create and save the admin user for the organization
    const adminUser = await User.create({
      org_id,
      username,
      email,
      password: password, // Save the hashed password
      role: 'Admin',
    });
    
    return adminUser;
  } catch (error) {
    // Re-throw the error so the controller can handle it
    throw new Error(`Error creating admin user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


export const createSalesRepUser = async (userData: Partial<IUser>): Promise<IUser> => {
    const { org_id, username, email, password } = userData;
  
    try {
        // Check if the organization exists by calling the organization service
        const response = await axios.get(`http://localhost:5006/orgs/${org_id}`);
        
        // Check if the response indicates the organization exists
        if (!response.data || !response.data.success) {
            throw new Error(`Organization with id ${org_id} does not exist.`);
        }
      // Create and save the sales rep user for the organization
      const salesRepUser = await User.create({
        org_id,
        username,
        email,
        password: password, // Save the hashed password
        role: 'Sales Rep', // Set the role to Sales Rep
      });
      
      return salesRepUser;
    } catch (error) {
      // Re-throw the error so the controller can handle it
      throw new Error(`Error creating sales rep user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };


export const getUserById = async (userId: string): Promise<IUser | null> => {
    return await User.findById(userId);
};

export const updateUser = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

export const deleteUser = async (userId: string): Promise<IUser | null> => {
    return await User.findByIdAndDelete(userId);
};

export const getAllUsers = async (): Promise<IUser[]> => {
    return await User.find();
};







//Get all Sales_Rep in an Organization
export const getSalesRepsByOrg = async (org_id: string): Promise<IUser[] | null> => {
  try {
      // Find users with the specified org_id and role 'Sales Rep'
      const salesReps = await User.find({ org_id, role: 'Sales Rep' });
      
      // If no sales reps are found, return null or an empty array as preferred
      return salesReps.length > 0 ? salesReps : null;
  } catch (error) {
      console.error(`Error retrieving sales reps for organization ${org_id}:`, error);
      throw new Error(`Could not retrieve sales reps for organization ${org_id}`);
  }
};