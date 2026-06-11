const Lead = require('../models/Lead');

// Helper: format a Date to "15 Jun 2026" for timeline descriptions
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

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

// @desc    Get single lead (with timeline user names populated)
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).populate('activityTimeline.performedBy', 'name');

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

    const lead = new Lead({
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

    // Initial timeline entry — no extra DB round-trip needed
    lead.activityTimeline.push({
      action: 'Lead Created',
      description: `Lead created for ${companyName}`,
      performedBy: req.user._id
    });

    await lead.save();

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
    const lead = await Lead.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const allowedFields = [
      'companyName', 'contactPerson', 'mobileNumber', 'city', 'approxTurnover',
      'status', 'priority', 'promoVideoSent', 'brochureSent', 'proposalSent',
      'lastContactDate', 'nextFollowupDate', 'notes'
    ];

    // Build $set payload
    const setData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        setData[field] = req.body[field];
      }
    });

    // ── Build timeline entries ──────────────────────────────────────────────

    const timelineEntries = [];

    // 1. Status change
    if (setData.status && setData.status !== lead.status) {
      timelineEntries.push({
        action: 'Status Changed',
        description: `Status changed from "${lead.status}" to "${setData.status}"`,
        performedBy: req.user._id
      });
    }

    // 2. Priority change
    if (setData.priority && setData.priority !== lead.priority) {
      timelineEntries.push({
        action: 'Priority Changed',
        description: `Priority changed from "${lead.priority}" to "${setData.priority}"`,
        performedBy: req.user._id
      });
    }

    // 3. Follow-up date change
    if (setData.nextFollowupDate !== undefined) {
      const oldISO = lead.nextFollowupDate
        ? new Date(lead.nextFollowupDate).toISOString().split('T')[0]
        : null;
      const newISO = setData.nextFollowupDate
        ? new Date(setData.nextFollowupDate).toISOString().split('T')[0]
        : null;
      if (oldISO !== newISO) {
        const desc = newISO
          ? `Next follow-up set to ${fmtDate(setData.nextFollowupDate)}`
          : 'Follow-up date cleared';
        timelineEntries.push({
          action: 'Follow-up Rescheduled',
          description: desc,
          performedBy: req.user._id
        });
      }
    }

    // 4. Generic "Lead Updated" — fires when other fields change
    //    (ignored if the only changes are the specific ones above)
    const genericFields = [
      'companyName', 'contactPerson', 'mobileNumber', 'city', 'approxTurnover',
      'promoVideoSent', 'brochureSent', 'proposalSent', 'lastContactDate', 'notes'
    ];
    const hasGenericChange = genericFields.some(field => {
      if (setData[field] === undefined) return false;
      return String(setData[field]) !== String(lead[field] ?? '');
    });
    if (hasGenericChange) {
      timelineEntries.push({
        action: 'Lead Updated',
        description: 'Lead details were updated',
        performedBy: req.user._id
      });
    }

    // ── Single atomic update: $set fields + $push timeline entries ──────────
    const updateQuery = { $set: setData };
    if (timelineEntries.length > 0) {
      updateQuery.$push = { activityTimeline: { $each: timelineEntries } };
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true, runValidators: true }
    ).populate('activityTimeline.performedBy', 'name');

    res.json({ success: true, data: updated });
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
