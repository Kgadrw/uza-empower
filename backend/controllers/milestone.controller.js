import Milestone from '../models/Milestone.js';
import Project from '../models/Project.js';

export const createMilestone = async (req, res) => {
  try {
    const { projectId, title, description, targetDate, trancheAmount } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and title are required'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const milestone = new Milestone({
      project: projectId,
      title,
      description,
      targetDate,
      trancheAmount,
      status: 'not_started'
    });

    await milestone.save();
    await milestone.populate('project', 'title');

    res.status(201).json({
      success: true,
      data: { milestone }
    });
  } catch (error) {
    console.error('Create milestone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create milestone'
    });
  }
};

export const getMilestones = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    const query = {};

    if (projectId) query.project = projectId;
    if (status) query.status = status;

    const milestones = await Milestone.find(query)
      .populate('project', 'title')
      .populate('approvedBy', 'name')
      .sort({ targetDate: 1 });

    res.json({
      success: true,
      data: { milestones }
    });
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestones'
    });
  }
};

export const getMilestoneById = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id)
      .populate('project', 'title beneficiary')
      .populate('approvedBy', 'name');

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    res.json({
      success: true,
      data: { milestone }
    });
  } catch (error) {
    console.error('Get milestone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestone'
    });
  }
};

export const submitMilestoneEvidence = async (req, res) => {
  try {
    const { evidence } = req.body;
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    if (evidence && Array.isArray(evidence)) {
      milestone.evidence = evidence.map(e => ({
        url: e.url || e,
        uploadedAt: new Date()
      }));
    }

    milestone.status = 'evidence_submitted';
    await milestone.save();

    res.json({
      success: true,
      data: { milestone }
    });
  } catch (error) {
    console.error('Submit milestone evidence error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit evidence'
    });
  }
};

export const approveMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    milestone.status = 'approved';
    milestone.approvedBy = req.user.userId;
    milestone.approvedAt = new Date();

    await milestone.save();

    // Release associated tranche if exists
    if (milestone.trancheAmount) {
      const project = await Project.findById(milestone.project);
      if (project && project.tranches) {
        const tranche = project.tranches.find(t => t.milestone?.toString() === milestone._id.toString());
        if (tranche) {
          tranche.status = 'released';
          tranche.releasedAt = new Date();
          tranche.releasedBy = req.user.userId;
          project.totalDisbursed = (project.totalDisbursed || 0) + (tranche.amount || 0);
          await project.save();
        }
      }
    }

    res.json({
      success: true,
      data: { milestone }
    });
  } catch (error) {
    console.error('Approve milestone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve milestone'
    });
  }
};

export const rejectMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    milestone.status = 'rejected';
    milestone.approvedBy = req.user.userId;
    milestone.approvedAt = new Date();

    await milestone.save();

    res.json({
      success: true,
      data: { milestone }
    });
  } catch (error) {
    console.error('Reject milestone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject milestone'
    });
  }
};

