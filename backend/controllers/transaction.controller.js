import Transaction from '../models/Transaction.js';
import Project from '../models/Project.js';

export const createTransaction = async (req, res) => {
  try {
    const { projectId, type, category, amount, description, date, proofUrl } = req.body;

    if (!projectId || !type || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Project ID, type, and amount are required'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Verify user has access to this project
    if (req.user.role === 'beneficiary' && project.beneficiary.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // Calculate balance
    const previousTransactions = await Transaction.find({ project: projectId })
      .sort({ date: -1 });
    
    let balance = project.totalDisbursed || 0;
    previousTransactions.forEach(t => {
      if (t.type === 'expense') balance -= t.amount;
      else if (t.type === 'revenue') balance += t.amount;
      else if (t.type === 'disbursement') balance += t.amount;
    });

    if (type === 'expense') balance -= amount;
    else if (type === 'revenue') balance += amount;
    else if (type === 'disbursement') balance += amount;

    const transaction = new Transaction({
      project: projectId,
      type,
      category,
      amount,
      description,
      date: date || new Date(),
      balance,
      proofUrl,
      createdBy: req.user.userId
    });

    await transaction.save();
    await transaction.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      data: { transaction }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction'
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { projectId, type, category, page = 1, limit = 50 } = req.query;
    const query = {};

    if (projectId) query.project = projectId;
    if (type) query.type = type;
    if (category) query.category = category;

    // Beneficiaries only see their project transactions
    if (req.user.role === 'beneficiary' && !projectId) {
      const projects = await Project.find({ beneficiary: req.user.userId });
      query.project = { $in: projects.map(p => p._id) };
    }

    const transactions = await Transaction.find(query)
      .populate('project', 'title')
      .populate('createdBy', 'name')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('project', 'title beneficiary')
      .populate('createdBy', 'name');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: { transaction }
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction'
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Only creator or admin can update
    if (req.user.role !== 'admin' && transaction.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const { category, description, proofUrl } = req.body;

    if (category) transaction.category = category;
    if (description) transaction.description = description;
    if (proofUrl) transaction.proofUrl = proofUrl;

    await transaction.save();

    res.json({
      success: true,
      data: { transaction }
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction'
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Only admin can delete
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction'
    });
  }
};

