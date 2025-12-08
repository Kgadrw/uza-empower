import FundingRequest from '../models/FundingRequest.js';
import Project from '../models/Project.js';

export const createFundingRequest = async (req, res) => {
  try {
    const { projectId, requestedAmount, purpose, budgetBreakdown } = req.body;
    const userId = req.user.userId;

    if (!projectId || !requestedAmount) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and requested amount are required'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Verify beneficiary owns the project
    if (req.user.role !== 'admin' && project.beneficiary.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const fundingRequest = new FundingRequest({
      project: projectId,
      requestedAmount,
      purpose,
      budgetBreakdown,
      status: 'pending'
    });

    await fundingRequest.save();
    await fundingRequest.populate('project', 'title beneficiary');

    res.status(201).json({
      success: true,
      data: { fundingRequest }
    });
  } catch (error) {
    console.error('Create funding request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create funding request'
    });
  }
};

export const getFundingRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;

    // Beneficiaries only see their own requests
    if (req.user.role === 'beneficiary') {
      const projects = await Project.find({ beneficiary: req.user.userId });
      query.project = { $in: projects.map(p => p._id) };
    }

    const fundingRequests = await FundingRequest.find(query)
      .populate('project', 'title beneficiary')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await FundingRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        fundingRequests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get funding requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch funding requests'
    });
  }
};

export const getFundingRequestById = async (req, res) => {
  try {
    const fundingRequest = await FundingRequest.findById(req.params.id)
      .populate('project', 'title beneficiary')
      .populate('reviewedBy', 'name');

    if (!fundingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Funding request not found'
      });
    }

    res.json({
      success: true,
      data: { fundingRequest }
    });
  } catch (error) {
    console.error('Get funding request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch funding request'
    });
  }
};

export const approveFundingRequest = async (req, res) => {
  try {
    const fundingRequest = await FundingRequest.findById(req.params.id);

    if (!fundingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Funding request not found'
      });
    }

    fundingRequest.status = 'approved';
    fundingRequest.reviewedBy = req.user.userId;
    fundingRequest.reviewedAt = new Date();

    await fundingRequest.save();

    // Update project total disbursed
    const project = await Project.findById(fundingRequest.project);
    if (project) {
      project.totalDisbursed = (project.totalDisbursed || 0) + fundingRequest.requestedAmount;
      await project.save();
    }

    res.json({
      success: true,
      data: { fundingRequest }
    });
  } catch (error) {
    console.error('Approve funding request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve funding request'
    });
  }
};

export const rejectFundingRequest = async (req, res) => {
  try {
    const fundingRequest = await FundingRequest.findById(req.params.id);

    if (!fundingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Funding request not found'
      });
    }

    fundingRequest.status = 'rejected';
    fundingRequest.reviewedBy = req.user.userId;
    fundingRequest.reviewedAt = new Date();

    await fundingRequest.save();

    res.json({
      success: true,
      data: { fundingRequest }
    });
  } catch (error) {
    console.error('Reject funding request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject funding request'
    });
  }
};

