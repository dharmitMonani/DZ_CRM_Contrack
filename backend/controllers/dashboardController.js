const mongoose = require('mongoose');
const Lead = require('../models/Lead');

// @desc    Get dashboard stats + today's follow-ups + analytics
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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Run all queries in parallel
    const [
      totalLeads,
      newLeads,
      interestedLeads,
      demoScheduled,
      wonDeals,
      hotLeads,
      activeFollowupsCount,
      todayFollowups,
      leadsByStatus,
      leadsByPriority,
      leadsByCity,
      leadsBySource,
      monthlyTrendData
    ] = await Promise.all([
      Lead.countDocuments({ createdBy: userId }),
      Lead.countDocuments({ createdBy: userId, status: 'New Lead' }),
      Lead.countDocuments({ createdBy: userId, status: 'Interested' }),
      Lead.countDocuments({ createdBy: userId, status: 'Demo Scheduled' }),
      Lead.countDocuments({ createdBy: userId, status: 'Won' }),
      Lead.countDocuments({ createdBy: userId, priority: 'Hot' }),
      Lead.countDocuments({ createdBy: userId, nextFollowupDate: { $gte: todayStart } }),
      Lead.find({
        createdBy: userId,
        nextFollowupDate: { $lte: todayEnd },
        status: { $nin: ['Won', 'Lost'] }
      })
        .sort({ nextFollowupDate: 1 })
        .limit(50)
        .lean(),
      Lead.aggregate([
        { $match: { createdBy: userObjectId } },
        { $group: { _id: "$status", value: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $match: { createdBy: userObjectId } },
        { $group: { _id: "$priority", value: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $match: { createdBy: userObjectId, city: { $ne: null }, $expr: { $gt: [{ $strLenCP: "$city" }, 0] } } },
        { $group: { _id: "$city", value: { $sum: 1 } } },
        { $sort: { value: -1 } },
        { $limit: 10 }
      ]),
      Lead.aggregate([
        { $match: { createdBy: userObjectId } },
        { $group: { _id: { $ifNull: ["$source", "Other"] }, value: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $match: { createdBy: userObjectId } },
        { $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            value: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Format aggregations for frontend
    const formatChartData = (data, keyName = 'name') => data.map(item => ({ [keyName]: item._id || 'Unknown', value: item.value }));

    res.json({
      success: true,
      data: {
        stats: {
          totalLeads,
          todayFollowupsCount: todayFollowups.length,
          newLeads,
          interestedLeads,
          demoScheduled,
          wonDeals,
          hotLeads,
          activeFollowupsCount,
          conversionRate: totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(1) : 0
        },
        analytics: {
          leadsByStatus: formatChartData(leadsByStatus),
          leadsByPriority: formatChartData(leadsByPriority),
          leadsByCity: formatChartData(leadsByCity),
          leadsBySource: formatChartData(leadsBySource),
          monthlyTrend: formatChartData(monthlyTrendData, 'month')
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
