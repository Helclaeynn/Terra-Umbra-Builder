import type { FastifyInstance } from "fastify";
import { requireUser } from "../auth.js";
import { terraUmbraCreationRules } from "./terra-umbra-creation.js";
import { terraUmbraCreationLore, terraUmbraTalentChoiceSpecs, terraUmbraRealitySkillTalentMap } from "./terra-umbra-creation-lore.js";
import { terraUmbraDisadvantages, terraUmbraDisadvantageLore, terraUmbraEdgeRules } from "./terra-umbra-disadvantages-edge.js";
import { terraUmbraTruthRules } from "./truth/rules.js";

export async function registerRulesRoutes(app:FastifyInstance){
  app.get("/api/rulesets/terra-umbra/creation", async (request, reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    return { rules:terraUmbraCreationRules, lore:terraUmbraCreationLore, talentChoiceSpecs:terraUmbraTalentChoiceSpecs, skillTalentMap:terraUmbraRealitySkillTalentMap, disadvantages:terraUmbraDisadvantages, disadvantageLore:terraUmbraDisadvantageLore, edgeRules:terraUmbraEdgeRules };
  });

  app.get("/api/rulesets/terra-umbra/truth", async (request, reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    return terraUmbraTruthRules;
  });
}
