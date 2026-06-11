const mongoose = require('mongoose');
const { getDashboard } = require('./controllers/dashboardController');
const User = require('./models/User');

require('dotenv').config();

let uri = process.env.MONGODB_URI;
if (uri.includes('CarDealerClusterJWT_SECRET=')) {
  uri = uri.split('JWT_SECRET=')[0];
}

mongoose.connect(uri)
  .then(async () => {
    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      process.exit(0);
    }
    
    const req = {
      user: { _id: user._id }
    };
    
    const res = {
      json: (data) => {
        console.log('API RESPONSE JSON:');
        console.log(JSON.stringify(data, null, 2));
      },
      status: (code) => {
        console.log('API RESPONSE STATUS:', code);
        return {
          json: (data) => {
            console.log('API RESPONSE ERROR JSON:');
            console.log(JSON.stringify(data, null, 2));
          }
        };
      }
    };
    
    await getDashboard(req, res);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
