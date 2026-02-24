import { Request, Response } from "express";
import {
  CollaborationModel,
  PricingPlanModel,
  ProjectModel,
  ServiceModel,
  SiteSettingsModel,
  TeamMemberModel,
  TestimonialModel,
} from "../models";
import { asyncHandler } from "../utils/asyncHandler";

export const getHomepageData = asyncHandler(async (_req: Request, res: Response) => {
  const [settings, services, projects, collaborations, pricing, team, testimonials] = await Promise.all([
    SiteSettingsModel.findOne().sort({ createdAt: 1 }),
    ServiceModel.find().sort({ order: 1 }).limit(6),
    ProjectModel.find().sort({ featured: -1, createdAt: -1 }).limit(6),
    CollaborationModel.find().sort({ order: 1 }),
    PricingPlanModel.find().sort({ order: 1 }),
    TeamMemberModel.find({ type: "TEAM" }).sort({ order: 1 }).limit(4),
    TestimonialModel.find({ visible: true }).sort({ order: 1, createdAt: -1 }).limit(8),
  ]);

  res.json({
    settings,
    services,
    projects,
    collaborations,
    pricing,
    team,
    testimonials,
  });
});
