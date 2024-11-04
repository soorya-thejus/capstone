import { Request,Response } from "express";
import * as userService from "../services/authService";
import User from "../models/Auth";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios, { AxiosError } from "axios";

// Create Admin user
export const createAdminUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const newUser = await userService.createAdminUser(req.body);
        res.status(201).json({
            user_id: newUser._id,
            message: 'Admin user created successfully',
          });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

//Create SalesRep user
export const createSalesRepUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser = await userService.createSalesRepUser(req.body);
      res.status(201).json({
        user_id: newUser._id,
        message: 'Sales Representative user created successfully',
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
  };

// Get user by ID
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedUser = await userService.deleteUser(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'user removed' });
        //send();
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};





// Get all sales_rep in an organization
export const getSalesRepsByOrganization = async (req: Request, res: Response): Promise<void> => {
    const { org_id } = req.params;

    try {
        const salesReps = await userService.getSalesRepsByOrg(org_id);

        if (!salesReps) {
            res.status(404).json({ message: 'No sales representatives found for this organization.' });
            return;
        }

        res.status(200).json(salesReps);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error retrieving sales representatives' });
    }
};








export const createAndLinkOrganization = async (req: Request, res: Response): Promise<void> => {
    const { user_id, name, type, address, contact_info } = req.body;

    try {
        // Fetch the Admin user to verify they exist and have no org_id set
        const adminUser = await User.findById(user_id);
        console.log(adminUser);
        if (!adminUser) {
            res.status(404).json({ message: 'Admin user not found.' });
            return;
        }
        if (adminUser.org_id) {
            res.status(400).json({ message: 'Admin is already associated with an organization.' });
            return;
        }

        // Step 2: Call Organization microservice to create an organization
        const orgResponse = await axios.post(`http://localhost:5006/api/orgs`, {
            name,
            type,
            address,
            contact_info,
            adminId: adminUser._id
        });

        // Extract org_id from the Organization service's response
        const { org_id } = orgResponse.data;

        // Step 3: Update the Admin user’s org_id in the Auth microservice database
        adminUser.org_id = org_id;
        await adminUser.save();

        // If the user role is Admin, ensure only one Admin exists per organization
        // if (adminUser.role === 'Admin') {
        //     const existingAdmin = await User.findOne({ org_id, role: 'Admin' });
        //     if (existingAdmin) {
        //         res.status(400).json({ message: 'An admin user already exists for this organization.' });
        //         return;
        //     }
        // }

        res.status(201).json({ message: 'Organization created and linked to Admin successfully', org_id });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            // Cast error as AxiosError
            const axiosError = error as AxiosError;

            // Check if response and data exist to avoid the error "Property 'message' does not exist on type '{}'"
            const status = axiosError.response?.status || 500;
            const message = (axiosError.response?.data as { message?: string }).message || 'An error occurred.';
            res.status(status).json({ message });
        } else if (error instanceof Error) {
            // For non-Axios errors that are standard Errors
            res.status(500).json({ message: error.message || 'An unknown error occurred.' });
        } else {
            // Fallback for truly unknown errors
            res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};

 
//Register Admin & Sales_Rep
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
    const { org_id,username, email, password, role } = req.body;

    try {
        // Check if the organization exists
        // const orgResponse = await axios.get(`http://localhost:5006/api/orgs/${org_id}`);
        // if (orgResponse.status !== 200) {
        //     res.status(404).json({ message: `Organization with id ${org_id} does not exist.` });
        //     return;
        // }

        
        

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User with this email already exists.' });
            return;
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            org_id
        });

        await newUser.save();


        res.status(201).json({ message: 'User registered successfully', user_id: newUser._id });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle error from organization service
            res.status(error.response?.status || 500).json({ message: error.response?.data?.message || 'An unknown error occurred.' });
        } else {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
        }
    }
};


//Register SalesRep
export const registerSalesRep = async (req: Request, res: Response): Promise<void> => {
    const { org_id,username, email, password, role } = req.body;

    try {

        //Check if the organization exists
        const orgResponse = await axios.get(`http://localhost:5006/api/orgs/${org_id}`);
        if (orgResponse.status !== 200) {
            res.status(404).json({ message: `Organization with id ${org_id} does not exist.` });
            return;
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User with this email already exists.' });
            return;
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            org_id: org_id
        });

        await newUser.save();


        res.status(201).json({ message: 'User registered successfully', user_id: newUser._id });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle error from organization service
            res.status(error.response?.status || 500).json({ message: error.response?.data?.message || 'An unknown error occurred.' });
        } else {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
        }
    }
};

//Login Admin & Sales_Rep
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try 
    {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user.org_id, role: user.role }, "petdryfuygiuhi" as string, { expiresIn: '1h' });
        
        res.json({ token, user: { id: user._id,org_id: user.org_id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//Validate Token
export const validateToken = (req: Request, res: Response): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
         res.status(401).json({ message: 'Access token required' });
         return;
    }

    jwt.verify(token, "petdryfuygiuhi" as string, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Return the user information or any relevant data you need
        res.status(200).json({ user: decoded });
    });
};