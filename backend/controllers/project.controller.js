import Project from '../models/Project.js';
import Transaction from '../models/Transaction.js';
import Milestone from '../models/Milestone.js';
import Pledge from '../models/Pledge.js';

export const createProject = async (req, res) => {
  try {
    const { title, description, category, location, requestedAmount, budget } = req.body;
    const beneficiaryId = req.user.role === 'admin' ? req.body.beneficiary : req.user.userId;

    if (!title || !description || !requestedAmount) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and requested amount are required'
      });
    }

    const project = new Project({
      title,
      description,
      category,
      location,
      requestedAmount,
      budget: budget || [],
      beneficiary: beneficiaryId,
      status: 'pending'
    });

    await project.save();
    await project.populate('beneficiary', 'name email');

    res.status(201).json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('beneficiary', 'name email phone location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('beneficiary', 'name email phone location')
      .populate('approvedBy', 'name');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    let query = {};
    if (role === 'beneficiary') {
      query.beneficiary = userId;
    } else if (role === 'donor') {
      const pledges = await Pledge.find({ donor: userId });
      const projectIds = pledges.map(p => p.project);
      query._id = { $in: projectIds };
    }

    const projects = await Project.find(query)
      .populate('beneficiary', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { projects }
    });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only beneficiary or admin can update
    if (req.user.role !== 'admin' && project.beneficiary.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const { title, description, category, location, budget } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (location) project.location = location;
    if (budget) project.budget = budget;

    await project.save();
    await project.populate('beneficiary', 'name email');

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only admin or beneficiary can delete
    if (req.user.role !== 'admin' && project.beneficiary.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
};

export const approveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.status = 'approved';
    project.approvedBy = req.user.userId;
    await project.save();

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Approve project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve project'
    });
  }
};

export const rejectProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.status = 'cancelled';
    await project.save();

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Reject project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject project'
    });
  }
};

export const getProjectKPIs = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const transactions = await Transaction.find({ project: req.params.id });
    const milestones = await Milestone.find({ project: req.params.id });

    const totalSpent = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRevenue = transactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);

    const margin = project.requestedAmount > 0 
      ? ((totalRevenue - totalSpent) / project.requestedAmount) * 100 
      : 0;

    const completedMilestones = milestones.filter(m => m.status === 'approved').length;
    const totalMilestones = milestones.length;

    res.json({
      success: true,
      data: {
        totalBudget: project.requestedAmount,
        totalDisbursed: project.totalDisbursed,
        totalSpent,
        totalRevenue,
        margin: margin.toFixed(2),
        completedMilestones,
        totalMilestones,
        progress: totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0
      }
    });
  } catch (error) {
    console.error('Get project KPIs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KPIs'
    });
  }
};

export const getProjectAnalytics = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const transactions = await Transaction.find({ project: req.params.id })
      .sort({ date: -1 });

    // Group transactions by month
    const monthlyData = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { expenses: 0, revenue: 0 };
      }
      if (t.type === 'expense') monthlyData[month].expenses += t.amount;
      if (t.type === 'revenue') monthlyData[month].revenue += t.amount;
    });

    res.json({
      success: true,
      data: {
        monthlyData,
        transactions: transactions.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Get project analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
};

export const getProjectTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ project: req.params.id })
      .sort({ date: -1 })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: { transactions }
    });
  } catch (error) {
    console.error('Get project transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
};

export const getProjectMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ project: req.params.id })
      .sort({ targetDate: 1 })
      .populate('approvedBy', 'name');

    res.json({
      success: true,
      data: { milestones }
    });
  } catch (error) {
    console.error('Get project milestones error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestones'
    });
  }
};

