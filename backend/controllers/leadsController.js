const Lead = require('../models/Lead');

// @desc    Get all leads with filter, search, pagination
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { createdBy: req.user._id };

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean(),
      Lead.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, data: lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lead' });
  }
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      mobileNumber,
      city,
      approxTurnover,
      status,
      priority,
      promoVideoSent,
      brochureSent,
      proposalSent,
      lastContactDate,
      nextFollowupDate,
      notes
    } = req.body;

    if (!companyName || !contactPerson || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Company name, contact person and mobile number are required'
      });
    }

    const lead = await Lead.create({
      companyName,
      contactPerson,
      mobileNumber,
      city,
      approxTurnover,
      status,
      priority,
      promoVideoSent,
      brochureSent,
      proposalSent,
      lastContactDate,
      nextFollowupDate,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ success: false, message: 'Failed to create lead' });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    let lead = await Lead.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const allowedFields = [
      'companyName', 'contactPerson', 'mobileNumber', 'city', 'approxTurnover',
      'status', 'priority', 'promoVideoSent', 'brochureSent', 'proposalSent',
      'lastContactDate', 'nextFollowupDate', 'notes'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: lead });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ success: false, message: 'Failed to update lead' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete lead' });
  }
};

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead };
