import Alert from '../models/Alert.js';
import Project from '../models/Project.js';
import Pledge from '../models/Pledge.js';

export const getAlerts = async (req, res) => {
  try {
    const { projectId, type, severity, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (projectId) query.project = projectId;
    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (status) query.status = status;

    // Donors only see alerts for their pledged projects
    if (req.user.role === 'donor') {
      const pledges = await Pledge.find({ donor: req.user.userId });
      const projectIds = pledges.map(p => p.project);
      query.project = { $in: projectIds };
    }

    // Beneficiaries only see alerts for their projects
    if (req.user.role === 'beneficiary') {
      const projects = await Project.find({ beneficiary: req.user.userId });
      query.project = { $in: projects.map(p => p._id) };
    }

    const alerts = await Alert.find(query)
      .populate('project', 'title beneficiary')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Alert.countDocuments(query);

    res.json({
      success: true,
      data: {
        alerts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts'
    });
  }
};

export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('project', 'title beneficiary');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: { alert }
    });
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alert'
    });
  }
};

export const createAlert = async (req, res) => {
  try {
    const { projectId, type, severity, description } = req.body;

    if (!type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Type and description are required'
      });
    }

    const alert = new Alert({
      project: projectId,
      type,
      severity: severity || 'medium',
      description,
      status: 'active'
    });

    await alert.save();
    await alert.populate('project', 'title');

    res.status(201).json({
      success: true,
      data: { alert }
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create alert'
    });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.status = 'resolved';
    await alert.save();

    res.json({
      success: true,
      data: { alert }
    });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve alert'
    });
  }
};

export const markAlertAsRead = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    if (!alert.readBy.includes(req.user.userId)) {
      alert.readBy.push(req.user.userId);
      await alert.save();
    }

    res.json({
      success: true,
      data: { alert }
    });
  } catch (error) {
    console.error('Mark alert as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark alert as read'
    });
  }
};

