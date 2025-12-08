import User from '../models/User.js';

export const submitKYC = async (req, res) => {
  try {
    const { documents, businessName, location, phone } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user KYC information
    user.kycStatus = 'pending';
    if (businessName) user.businessName = businessName;
    if (location) user.location = location;
    if (phone) user.phone = phone;
    if (documents) user.kycDocuments = documents;

    await user.save();

    res.json({
      success: true,
      data: { user: await User.findById(userId).select('-password') }
    });
  } catch (error) {
    console.error('Submit KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit KYC'
    });
  }
};

export const getKYCStatus = async (req, res) => {
  try {
    const userId = req.params.id || req.user.userId;
    const user = await User.findById(userId).select('kycStatus businessName location phone');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        businessName: user.businessName,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC status'
    });
  }
};

export const getPendingKYC = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find({ kycStatus: 'pending' })
      .select('name email phone businessName location kycStatus createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ kycStatus: 'pending' });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get pending KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending KYC'
    });
  }
};

export const approveKYC = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.kycStatus = 'approved';
    await user.save();

    res.json({
      success: true,
      data: { user: await User.findById(req.params.id).select('-password') }
    });
  } catch (error) {
    console.error('Approve KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve KYC'
    });
  }
};

export const rejectKYC = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.kycStatus = 'rejected';
    await user.save();

    res.json({
      success: true,
      data: { user: await User.findById(req.params.id).select('-password') }
    });
  } catch (error) {
    console.error('Reject KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject KYC'
    });
  }
};

