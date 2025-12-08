import Pledge from '../models/Pledge.js';
import Project from '../models/Project.js';

export const createPledge = async (req, res) => {
  try {
    const { projectId, amount } = req.body;

    if (!projectId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and amount are required'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Can only pledge to approved projects'
      });
    }

    const pledge = new Pledge({
      donor: req.user.userId,
      project: projectId,
      amount,
      status: 'pending'
    });

    await pledge.save();
    await pledge.populate('project', 'title');
    await pledge.populate('donor', 'name email');

    res.status(201).json({
      success: true,
      data: { pledge }
    });
  } catch (error) {
    console.error('Create pledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pledge'
    });
  }
};

export const getPledges = async (req, res) => {
  try {
    const { projectId, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (projectId) query.project = projectId;
    if (status) query.status = status;

    // Donors only see their own pledges
    if (req.user.role === 'donor') {
      query.donor = req.user.userId;
    }

    const pledges = await Pledge.find(query)
      .populate('project', 'title category location')
      .populate('donor', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pledge.countDocuments(query);

    res.json({
      success: true,
      data: {
        pledges,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get pledges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pledges'
    });
  }
};

export const getPledgeById = async (req, res) => {
  try {
    const pledge = await Pledge.findById(req.params.id)
      .populate('project', 'title beneficiary')
      .populate('donor', 'name email');

    if (!pledge) {
      return res.status(404).json({
        success: false,
        message: 'Pledge not found'
      });
    }

    res.json({
      success: true,
      data: { pledge }
    });
  } catch (error) {
    console.error('Get pledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pledge'
    });
  }
};

export const confirmPledge = async (req, res) => {
  try {
    const pledge = await Pledge.findById(req.params.id);

    if (!pledge) {
      return res.status(404).json({
        success: false,
        message: 'Pledge not found'
      });
    }

    pledge.status = 'confirmed';
    await pledge.save();

    res.json({
      success: true,
      data: { pledge }
    });
  } catch (error) {
    console.error('Confirm pledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm pledge'
    });
  }
};

export const cancelPledge = async (req, res) => {
  try {
    const pledge = await Pledge.findById(req.params.id);

    if (!pledge) {
      return res.status(404).json({
        success: false,
        message: 'Pledge not found'
      });
    }

    // Only donor or admin can cancel
    if (req.user.role !== 'admin' && pledge.donor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    pledge.status = 'cancelled';
    await pledge.save();

    res.json({
      success: true,
      data: { pledge }
    });
  } catch (error) {
    console.error('Cancel pledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel pledge'
    });
  }
};

