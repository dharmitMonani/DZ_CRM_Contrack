const Lead = require('../models/Lead');

// @desc    Get dashboard stats + today's follow-ups
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Run all queries in parallel
    const [
      totalLeads,
      newLeads,
      interestedLeads,
      demoScheduled,
      wonDeals,
      todayFollowups
    ] = await Promise.all([
      Lead.countDocuments({ createdBy: userId }),
      Lead.countDocuments({ createdBy: userId, status: 'New Lead' }),
      Lead.countDocuments({ createdBy: userId, status: 'Interested' }),
      Lead.countDocuments({ createdBy: userId, status: 'Demo Scheduled' }),
      Lead.countDocuments({ createdBy: userId, status: 'Won' }),
      Lead.find({
        createdBy: userId,
        nextFollowupDate: { $lte: todayEnd },
        status: { $nin: ['Won', 'Lost'] }
      })
        .sort({ nextFollowupDate: 1 })
        .limit(50)
        .lean()
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalLeads,
          todayFollowupsCount: todayFollowups.length,
          newLeads,
          interestedLeads,
          demoScheduled,
          wonDeals
        },
        todayFollowups
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard' });
  }
};

module.exports = { getDashboard };
