// services/leadService.ts
import axios from "axios";
import { Lead, ILead } from "../models/Leads"; // Assuming you have a model file for leads

// Create a Lead
export const createLeadService = async (leadData: ILead): Promise<ILead> => {
    const newLead = new Lead(leadData);
    return await newLead.save(); // This will return a Promise<ILead>
};

// Get all Leads
export const getLeadsService = async (): Promise<ILead[]> => {
    return await Lead.find(); // This will return a Promise<ILead[]>
};

// Get a Lead By Id
export const getLeadByIdService = async (id: string): Promise<ILead | null> => {
    return await Lead.findById(id); // This will return a Promise<ILead | null>
};

// Update Lead
export const updateLeadService = async (id: string, leadData: Partial<ILead>): Promise<ILead | null> => {
  const updatedLead = await Lead.findByIdAndUpdate(id, leadData, { new: true, runValidators: true });

  if (!updatedLead) {
      throw new Error("Lead not found");
  }

  // If the lead is "qualified", send data to Contacts Microservice
  if (updatedLead.status === "qualified") {
      try {
          await axios.post("http://localhost:5005/api/contacts", {
              lead_id: updatedLead._id,
              contact_name: updatedLead.lead_name,
              title: updatedLead.title,
              email: updatedLead.email,
              phone: updatedLead.phone,
              org_id: updatedLead.org_id,
              owner_id: updatedLead.owner_id,
          });
      } catch (error) {
          console.error(`Failed to create contact for lead ${id}:`, error);
          throw new Error(`Error creating contact in Contacts service`);
      }
  }

  return updatedLead;
};

// Delete a Lead
export const deleteLeadService = async (id: string): Promise<ILead | null> => {
    return await Lead.findByIdAndDelete(id); // This will return a Promise<ILead | null>
};






// export const statusUpdateService = async (id: string, status: string) => {
//     // Find and update the lead's status
//     const updatedLead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
//     if (!updatedLead) {
//       throw new Error("Lead not found");
//     }
  
//     // If the lead is "qualified", send data to Contacts Microservice
//     if (status === "qualified") {
//       await axios.post("http://localhost:5005/api/contacts", {
//         lead_id: updatedLead._id,
//         lead_name: updatedLead.lead_name,
//         title: updatedLead.title,
//         email: updatedLead.email,
//         phone: updatedLead.phone,
//       });
//     }
  
//     return updatedLead;
//   };



//Get Leads by Org Id
export const getLeadsByOrgIdService = async (org_id: string): Promise<ILead[] | null> => {
    return await Lead.find({ org_id }); // Query using org_id, not id
};


//Get Leads by Sales Rep in an Org
export const getLeadsBySalesRep = async (org_id: string, owner_id: string): Promise<ILead[]|null> => {
        // Query for leads matching both the organization and sales rep (owner) criteria
        const leads = await Lead.find({org_id,owner_id});
        return leads;
};