const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const User = require('./models/User');

require('dotenv').config();

// Fix malformed URI if necessary
let uri = process.env.MONGODB_URI;
if (uri.includes('CarDealerClusterJWT_SECRET=')) {
  uri = uri.split('JWT_SECRET=')[0];
}

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to DB');
    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      process.exit(0);
    }
    const userId = user._id;
    console.log('Using userId:', userId);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [
      totalLeads,
      leadsByStatus,
      leadsByPriority,
      leadsByCity,
      monthlyTrendData
    ] = await Promise.all([
      Lead.countDocuments({ createdBy: userId }),
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
        { $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            value: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    console.log('Total Leads (countDocuments):', totalLeads);
    console.log('Leads By Status (aggregation):', leadsByStatus);
    console.log('Leads By Priority:', leadsByPriority);
    console.log('Leads By City:', leadsByCity);
    console.log('Monthly Trend:', monthlyTrendData);

    const formatChartData = (data, keyName = 'name') => data.map(item => ({ [keyName]: item._id || 'Unknown', value: item.value }));
    console.log('Formatted Leads By Status:', formatChartData(leadsByStatus));

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
