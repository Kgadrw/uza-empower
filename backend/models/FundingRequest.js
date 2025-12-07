import mongoose from 'mongoose';

const fundingRequestSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  requestedAmount: {
    type: Number,
    required: true
  },
  purpose: String,
  budgetBreakdown: [{
    label: String,
    amount: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true
});

export default mongoose.model('FundingRequest', fundingRequestSchema);

