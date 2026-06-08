const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    maxlength: [20, 'Mobile number cannot exceed 20 characters']
  },
  city: {
    type: String,
    trim: true,
    maxlength: [100, 'City cannot exceed 100 characters']
  },
  approxTurnover: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: [
      'New Lead',
      'Contacted',
      'Interested',
      'Demo Scheduled',
      'Demo Done',
      'Follow-up',
      'Trial Started',
      'Won',
      'Lost'
    ],
    default: 'New Lead'
  },
  priority: {
    type: String,
    enum: ['Cold', 'Warm', 'Hot'],
    default: 'Cold'
  },
  // Communication tracking
  promoVideoSent: {
    type: Boolean,
    default: false
  },
  brochureSent: {
    type: Boolean,
    default: false
  },
  proposalSent: {
    type: Boolean,
    default: false
  },
  // Follow-up tracking
  lastContactDate: {
    type: Date
  },
  nextFollowupDate: {
    type: Date
  },
  // Notes
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  // Assigned to
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for fast querying
leadSchema.index({ status: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ nextFollowupDate: 1 });
leadSchema.index({ companyName: 'text', contactPerson: 'text', city: 'text' });
leadSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Lead', leadSchema);
