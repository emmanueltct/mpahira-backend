import { Request, Response } from "express";
import User from "../models/userModel";
import Role from "../models/roleModel";
import { AgentMarket } from "../models/AgentMarket";



export const  getAgents=async(req:Request,res:Response)=>{
  try {
      const agents = await User.findAll({
        include: [
          {
            model: Role,
            as: 'role',
            where: { role: "Agent" },
          },
          {
            model: AgentMarket,
            as: 'agentsMarket',
          },
        ],
      });

    res.status(200).json({
      success: true,
      agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch agents",
      error: error instanceof Error ? error.message : error,
    });
  }


}


export const AssignMarket=async(req:Request,res:Response)=>{
  try{
  
   const { marketId ,agentId} = req.body;
  
      // Check if agentMarket exists
      const existingMarket = await AgentMarket.findOne({ where: { agentId } });
  
      let agentMarket;
      if (existingMarket) {
        // ✅ Update existing
       existingMarket.marketId = marketId;
        await existingMarket.save();
        agentMarket = existingMarket;
      } else {
        // ✅ Create new
        agentMarket = await AgentMarket.create({ agentId, marketId });
      }
  
       res.status(200).json(agentMarket);
       return
    } catch (error) {
      console.error("Error saving agentMarket market:", error);
      res
        .status(500)
        .json({ message: "Error saving agentMarket market", error });
       return
    }
}