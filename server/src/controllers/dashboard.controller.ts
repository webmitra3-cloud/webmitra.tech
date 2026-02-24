import { Request, Response } from "express";
import {
  CollaborationModel,
  InquiryModel,
  ProjectModel,
  ServiceModel,
  TeamMemberModel,
  TestimonialModel,
  UserModel,
} from "../models";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [services, projects, team, collaborations, inquiries, users, testimonials] = await Promise.all([
    ServiceModel.countDocuments(),
    ProjectModel.countDocuments(),
    TeamMemberModel.countDocuments(),
    CollaborationModel.countDocuments(),
    InquiryModel.countDocuments(),
    UserModel.countDocuments(),
    TestimonialModel.countDocuments(),
  ]);

  const latestInquiries = await InquiryModel.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    totals: {
      services,
      projects,
      team,
      collaborations,
      inquiries,
      users,
      testimonials,
    },
    latestInquiries,
  });
});
