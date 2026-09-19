import type { FastifyInstance } from "fastify";
import { requireUser } from "../auth.js";
import { terraUmbraCreationRules } from "./terra-umbra-creation.js";
import { terraUmbraCreationLore, terraUmbraTalentChoiceSpecs } from "./terra-umbra-creation-lore.js";

export async function registerRulesRoutes(app:FastifyInstance){
  app.get("/api/rulesets/terra-umbra/creation", async (request, reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    return { rules:terraUmbraCreationRules, lore:terraUmbraCreationLore, talentChoiceSpecs:terraUmbraTalentChoiceSpecs };
  });
}
