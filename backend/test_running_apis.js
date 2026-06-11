const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

require('dotenv').config();

let uri = process.env.MONGODB_URI;
if (uri.includes('CarDealerClusterJWT_SECRET=')) {
  uri = uri.split('JWT_SECRET=')[0];
}

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to Database');
    const user = await User.findOne();
    if (!user) {
      console.log('No user found in DB');
      process.exit(0);
    }
    console.log(`Using User: ${user.name} (${user.email}), ID: ${user._id}`);

    // Generate JWT token using the local secret
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('Generated JWT Token:', token);

    // Call Local Backend
    console.log('\n--- Calling Local Backend: http://localhost:5000/api/dashboard ---');
    try {
      const localRes = await fetch('http://localhost:5000/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Local HTTP Status:', localRes.status);
      const localData = await localRes.json();
      console.log('Local Response keys:', Object.keys(localData));
      if (localData.data) {
        console.log('Local data keys:', Object.keys(localData.data));
        if (localData.data.analytics) {
          console.log('Local response contains analytics! Fields:', Object.keys(localData.data.analytics));
        } else {
          console.log('Local response is MISSING analytics. Full data object:');
          console.log(JSON.stringify(localData.data, null, 2));
        }
      } else {
        console.log('Local response has no data field:', localData);
      }
    } catch (err) {
      console.error('Error calling local API:', err.message);
    }

    // Call Render Backend
    console.log('\n--- Calling Render Backend: https://dz-crm-backend.onrender.com/api/dashboard ---');
    try {
      const renderRes = await fetch('https://dz-crm-backend.onrender.com/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Render HTTP Status:', renderRes.status);
      const renderData = await renderRes.json();
      console.log('Render Response:', JSON.stringify(renderData, null, 2));
    } catch (err) {
      console.error('Error calling Render API:', err.message);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('DB Error:', err);
    process.exit(1);
  });
