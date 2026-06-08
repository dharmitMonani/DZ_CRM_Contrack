## **DZ Infotech Sales CRM** 

A production-ready Customer Relationship Management (CRM) system developed for the DZ Infotech sales team to streamline contractor lead management, follow-up tracking, and sales pipeline monitoring. 

The application provides a centralized platform for managing leads, monitoring sales activities, and tracking conversion progress through an intuitive and responsive interface. 

## **Overview** 

DZ Infotech Sales CRM was built to simplify day-to-day lead management operations. Sales representatives can create, organize, and track contractor leads while maintaining a clear view of follow-up schedules and lead statuses. 

The system is designed with a modern full-stack architecture using React, Node.js, Express, and MongoDB, ensuring scalability, maintainability, and a smooth user experience. 

## **Features** 

## **Authentication & Security** 

- Secure user registration and login 

- JWT-based authentication 

- Protected routes and session management 

- Password encryption using bcrypt 

## **Lead Management** 

- Create new contractor leads 

- View and manage all leads 

- Update lead information 

- Delete unwanted leads 

- Track lead status and progress 

## **Dashboard Analytics** 

- Total leads overview 

- Today's follow-ups 

- New lead tracking 

- Interested prospects count 

- Demo scheduled count 

- Won deals tracking 

1 

## **Follow-Up Management** 

- Schedule follow-up activities 

- Monitor pending follow-ups 

- Stay organized with lead engagement timelines 

## **User Experience** 

- Clean and responsive design 

- Mobile-friendly interface 

- Fast and intuitive navigation 

- Real-time data updates 

## **Tech Stack** 

## **Frontend** 

- React 18 • Vite 

- React Router DOM 

- Axios • Tailwind CSS 

- Lucide React 

## **Backend** 

- Node.js • Express.js • JWT Authentication • bcrypt.js 

## **Database** 

- MongoDB • Mongoose 

## **Deployment** 

- Frontend: Vercel • Backend: Render • Database: MongoDB Atlas 

## **Project Structure** 

```
DZ_CRM_Contract/
│
├── frontend/
│   ├── src/
```

2 

```
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

## **Installation** 

## **Clone Repository** 

```
gitclonehttps://github.com/dharmitMonani/DZ_CRM_Contract.git
cdDZ_CRM_Contract
```

## **Backend Setup** 

```
cdbackend
npminstall
```

Create a `.env` file: 

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

Run backend server: 

```
npmstart
```

3 

## **Frontend Setup** 

```
cdfrontend
npminstall
```

Create a `.env` file: 

```
VITE_API_URL=http://localhost:5000/api
```

Run frontend: 

```
npmrundev
```

## **API Endpoints** 

## **Authentication** 

```
POST /api/auth/register
POST /api/auth/login
```

## **Leads** 

```
GET    /api/leads
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id
```

## **Dashboard** 

```
GET /api/dashboard
```

## **Deployment** 

## **Frontend** 

Deployed on Vercel for fast global delivery and seamless continuous deployment. 

## **Backend** 

Hosted on Render with automatic deployment from the GitHub repository. 

4 

## **Database** 

MongoDB Atlas is used for secure and scalable cloud database management. 

## **Development Highlights** 

- Full-stack MERN architecture 

- JWT authentication implementation 

- RESTful API design 

- Responsive UI development 

- MongoDB integration 

- Production deployment on Vercel and Render 

- Environment-based configuration management 

## **Future Improvements** 

- Role-based access control 

- Lead activity history 

- Email notifications 

- Advanced analytics dashboard 

- Export reports functionality 

- Team performance tracking 

## **Author** 

## **Dharmit Monani** 

GitHub: https://github.com/dharmitMonani 

LinkedIn: https://www.linkedin.com/in/dharmitmonani 

## **License** 

This project was developed as a CRM solution for DZ Infotech and is intended for educational and demonstration purposes. 

5 

