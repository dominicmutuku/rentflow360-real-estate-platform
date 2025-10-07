# 🏠 Rentflow360 - Real Estate Platform# Rentflow360 - Real Estate Platform

A comprehensive real estate web platform for discovering, filtering, and interacting with property listings across Kenyan cities.A comprehensive real estate web platform for discovering, filtering, and interacting with property listings across Kenyan cities.

## 📖 Project Overview## 🏠 Project Overview

Rentflow360 is a full-stack real estate platform that supports multiple user roles and provides a complete property management experience:Rentflow360 supports multiple user roles and provides a complete property management experience:

- **🔍 Guests**: Browse and search properties without registration- **Guests**: Browse and search properties

- **👤 Registered Users**: Save favorites, set alerts, contact agents, leave reviews- **Registered Users**: Save favorites, set alerts, contact sellers, leave reviews

- **🏢 Agents**: Create and manage listings, track performance, handle inquiries- **Agents/Sellers**: Create and manage listings, track performance

- **⚡ Administrators**: Moderate content, manage users, view platform analytics- **Administrators**: Moderate content, manage users, view analytics

## ✨ Key Features## 🚀 Key Features

### Core Functionality### Core Functionality

- **3-Page Property View System**: Preview → Full Details → Photo Gallery

- **Intelligent Search**: Handles fuzzy input like "1-bedroom Kasarani apartment"- **3-Page Property View System**: Preview → Full Details → Photo Gallery

- **Role-Based Dashboards**: Customized interfaces for each user type- **Intelligent Search**: Handles fuzzy input like "1-bedroom Kasarani"

- **Real-time Analytics**: Track property views, inquiries, and performance- **Role-Based Dashboards**: Customized interfaces for each user type

- **Property Management**: Complete CRUD operations for agents- **Real-time Analytics**: Track views, inquiries, and performance

- **Contact System**: Direct communication between users and agents

- **Admin Panel**: Comprehensive user and property management### Technical Highlights

### Technical Highlights- **Responsive Design**: Mobile-first approach with Tailwind CSS

- **Responsive Design**: Mobile-first approach with Tailwind CSS- **Secure Authentication**: JWT-based with role permissions

- **Secure Authentication**: JWT-based with role-based access control- **Scalable Architecture**: RESTful APIs with MongoDB

- **Scalable Architecture**: RESTful APIs with MongoDB Atlas- **SEO Optimized**: Clean URLs and meta tags

- **Advanced Search**: Multi-field filtering with location-based results

- **Real-time Updates**: Dynamic content updates and notifications## 🛠 Tech Stack

## 🛠️ Tech Stack- **Frontend**: React.js, Tailwind CSS, React Router

- **Backend**: Node.js, Express.js

### Frontend- **Database**: MongoDB with Mongoose ODM

- **React.js** (v18) - User interface framework- **Authentication**: JWT tokens

- **TypeScript** - Type-safe JavaScript- **File Storage**: Multer for image uploads

- **Tailwind CSS** - Utility-first CSS framework- **Search**: Fuse.js for fuzzy searching

- **React Router** - Client-side routing

- **Recharts** - Data visualization for analytics## 📋 Installation & Setup

### Backend### Prerequisites

- **Node.js** (v16+) - JavaScript runtime

- **Express.js** - Web application framework- Node.js (v16 or higher)

- **MongoDB** - NoSQL database- MongoDB (local or cloud)

- **Mongoose** - MongoDB object modeling- Git

- **JWT** - JSON Web Token authentication

- **bcryptjs** - Password hashing### Installation Steps

- **express-validator** - Input validation and sanitization

1. **Clone the repository**

### Development Tools

- **Nodemon** - Development server auto-restart ```bash

- **CORS** - Cross-Origin Resource Sharing git clone <your-repo-url>

- **Helmet** - Security middleware cd Rentflow360

- **Compression** - Response compression ```

## 🚀 Installation & Setup2. **Install backend dependencies**

### Prerequisites ```bash

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/) npm install

- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/atlas) ```

- **Git** - [Download here](https://git-scm.com/)

3. **Install frontend dependencies**

### 1. Clone the Repository

````bash

```bash   cd frontend

git clone https://github.com/your-username/rentflow360.git   npm install

cd rentflow360   cd ..

```   ```



### 2. Backend Setup4. **Environment Setup**

Create `.env` file in root directory:

#### Install Dependencies

```bash   ```env

cd backend   PORT=5000

npm install   MONGODB_URI=mongodb://localhost:27017/rentflow360

```   JWT_SECRET=your_jwt_secret_key_here

NODE_ENV=development

#### Environment Configuration   ```

Create a `.env` file in the `backend` directory:

5. **Start the application**

```env

# Database Configuration   ```bash

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentflow360?retryWrites=true&w=majority   # Development mode (runs both frontend and backend)

npm run dev

# JWT Configuration

JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters   # Or start individually

JWT_EXPIRES_IN=7d   npm run server  # Backend only

npm run client  # Frontend only

# Server Configuration   ```

PORT=5000

NODE_ENV=development6. **Access the application**

- Frontend: http://localhost:3000

# Frontend URL (for CORS)   - Backend API: http://localhost:5000

FRONTEND_URL=http://localhost:3000

```## 📁 Project Structure



#### MongoDB Atlas Setup```

1. **Create MongoDB Atlas Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)Rentflow360/

2. **Create a Cluster**: Choose the free tier├── backend/

3. **Create Database User**: │   ├── controllers/     # Route controllers

- Go to Database Access│   ├── models/         # Database models

- Add new database user with username/password│   ├── routes/         # API routes

- Grant read/write access│   ├── middleware/     # Custom middleware

4. **Configure Network Access**:│   ├── utils/          # Utility functions

- Go to Network Access│   └── server.js       # Main server file

- Add IP address (0.0.0.0/0 for development)├── frontend/

5. **Get Connection String**:│   ├── src/

- Go to Clusters → Connect → Connect your application│   │   ├── components/ # Reusable components

- Copy the connection string│   │   ├── pages/      # Page components

- Replace `<username>`, `<password>`, and `<database>` with your values│   │   ├── context/    # React context

│   │   ├── utils/      # Frontend utilities

#### Initialize Database│   │   └── styles/     # CSS files

```bash│   └── public/         # Static assets

# Start the backend server├── uploads/            # User uploaded files

npm start└── README.md

````

# In a new terminal, seed the database with sample data

node seed-properties.js## 🎯 Key Design Decisions

node seed-admin.js

```````1. **3-Page Property System**: Unique UX for progressive information disclosure

2. **Fuzzy Search**: Enhanced user experience with intelligent query matching

### 3. Frontend Setup3. **Role-Based Architecture**: Clean separation of user capabilities

4. **Mobile-First Design**: Ensures optimal mobile experience

#### Install Dependencies5. **RESTful API Design**: Scalable and maintainable backend structure

```bash

cd ../frontend## 🧪 Testing

npm install

``````bash

npm test

#### Environment Configuration```

Create a `.env` file in the `frontend` directory:

## 🚀 Deployment

```env

REACT_APP_API_URL=http://localhost:50001. **Build for production**

REACT_APP_ENVIRONMENT=development

```   ```bash

   npm run build

#### Start Frontend Server   ```

```bash

npm start2. **Start production server**

```   ```bash

   npm start

### 4. Access the Application   ```



- **Frontend**: http://localhost:3000## 📊 API Endpoints

- **Backend API**: http://localhost:5000

### Authentication

## 👥 Default User Accounts

- `POST /api/auth/register` - User registration

After running the seed scripts, you can use these accounts:- `POST /api/auth/login` - User login

- `GET /api/auth/profile` - Get user profile

### Admin Account

- **Email**: `admin@rentflow360.com`### Properties

- **Password**: `admin123`

- **Access**: Full administrative privileges- `GET /api/properties` - Get all properties

- `GET /api/properties/:id` - Get single property

### Test Agent Account (Created during development)- `POST /api/properties` - Create property (Agent only)

- **Email**: `testagent@test.com`- `PUT /api/properties/:id` - Update property (Agent only)

- **Password**: `Test123`- `DELETE /api/properties/:id` - Delete property (Agent/Admin)

- **Access**: Agent dashboard and property creation

### Search & Filters

### Creating New Users

Due to password validation requirements (must contain uppercase, lowercase, and number), create new accounts via the registration form with compliant passwords.- `GET /api/search` - Search properties with filters

- `GET /api/properties/trending` - Get trending properties

**Password Requirements**:

- Minimum 8 characters### User Features

- At least one uppercase letter

- At least one lowercase letter  - `POST /api/favorites` - Add to favorites

- At least one number- `GET /api/favorites` - Get user favorites

- `POST /api/reviews` - Add property review

## 📁 Project Structure- `POST /api/reports` - Report property



```## 🔧 Development

rentflow360/

├── backend/                 # Backend Node.js application### Adding New Features

│   ├── controllers/         # Route controllers

│   │   ├── authController.js       # Authentication logic1. Create backend routes in `/backend/routes/`

│   │   ├── propertyController.js   # Property CRUD operations2. Add controllers in `/backend/controllers/`

│   │   └── AdminController.js      # Admin panel operations3. Create frontend components in `/frontend/src/components/`

│   ├── middleware/          # Custom middleware4. Update API calls in frontend utilities

│   │   ├── auth.js                 # JWT authentication

│   │   └── validation.js           # Input validation### Database Models

│   ├── models/             # MongoDB/Mongoose models

│   │   ├── User.js                 # User schema- User (with roles: guest, user, agent, admin)

│   │   ├── Property.js             # Property schema- Property (with all property details)

│   │   └── Inquiry.js              # Inquiry schema- Review (user reviews for properties)

│   ├── routes/             # API routes- Favorite (user's saved properties)

│   │   ├── auth.js                 # Authentication routes- Report (reported properties)

│   │   ├── properties.js           # Property routes

│   │   └── admin.js                # Admin routes## 📈 Future Enhancements

│   ├── utils/              # Utility functions

│   │   ├── jwt.js                  # JWT utilities- Real-time messaging system

│   │   └── password.js             # Password utilities- Payment integration

│   ├── seed-admin.js       # Admin user seeding script- Advanced analytics dashboard

│   ├── seed-properties.js  # Sample data seeding script- Mobile app development

│   └── server.js           # Main server file- Multi-language support

├── frontend/               # Frontend React application

│   ├── public/             # Static files## 🤝 Contributing

│   ├── src/

│   │   ├── components/     # Reusable React components1. Fork the repository

│   │   │   ├── layout/            # Header, Footer components2. Create a feature branch

│   │   │   ├── sections/          # TrendingProperties, etc.3. Commit your changes

│   │   │   └── ui/                # Buttons, Forms, etc.4. Push to the branch

│   │   ├── context/        # React Context5. Create a Pull Request

│   │   │   └── AuthContext.tsx    # Authentication context

│   │   ├── pages/          # Page components## 📝 License

│   │   │   ├── AdminDashboard.tsx  # Admin management interface

│   │   │   ├── AgentDashboard.tsx  # Agent property managementThis project is licensed under the MIT License.

│   │   │   ├── UserDashboard.tsx   # User favorites and alerts

│   │   │   ├── AddProperty.tsx     # Property creation form---

│   │   │   ├── Login.tsx           # Login page

│   │   │   └── Register.tsx        # Registration page**Built with ❤️ for the Kenyan Real Estate Market**

│   │   ├── utils/          # Frontend utilities
│   │   │   └── config.ts           # API configuration
│   │   └── App.tsx         # Main App component
└── README.md              # Project documentation
```````

## 🔐 Authentication System

### User Roles & Permissions

| Role      | Permissions                                                     |
| --------- | --------------------------------------------------------------- |
| **Guest** | Browse properties, search, view details                         |
| **User**  | All guest permissions + save favorites, contact agents, reviews |
| **Agent** | All user permissions + create/manage listings, view analytics   |
| **Admin** | All permissions + user management, content moderation           |

### Security Features

- **JWT Authentication**: Secure token-based authentication with 7-day expiry
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Role-based Access Control**: Route protection by user role
- **Input Validation**: Comprehensive validation and sanitization
- **Security Headers**: Helmet.js for security headers
- **Login Attempt Limiting**: Protection against brute force attacks

## 🗃️ Database Schema

### Key Collections

#### Users

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: ['guest', 'user', 'agent', 'admin'],
  isActive: Boolean,
  activity: {
    lastLogin: Date,
    loginCount: Number
  },
  security: {
    loginAttempts: Number,
    lockUntil: Date
  }
}
```

#### Properties

```javascript
{
  title: String,
  description: String,
  propertyType: ['apartment', 'house', 'villa', 'townhouse', 'studio'],
  listingType: ['rent', 'sale', 'lease'],
  price: {
    amount: Number,
    currency: 'KES',
    period: ['monthly', 'yearly', 'one-time']
  },
  location: {
    address: String,
    city: String,
    neighborhood: String,
    coordinates: [Number, Number]
  },
  specifications: {
    bedrooms: Number,
    bathrooms: Number,
    size: {
      value: Number,
      unit: String
    }
  },
  features: [String],
  amenities: [String],
  images: [String],
  agent: ObjectId (ref: User),
  status: ['active', 'inactive', 'pending']
}
```

#### Inquiries

```javascript
{
  user: ObjectId (ref: User),
  property: ObjectId (ref: Property),
  agent: ObjectId (ref: User),
  message: String,
  status: ['pending', 'responded', 'closed'],
  createdAt: Date
}
```

## 📊 API Endpoints

### Authentication

```
POST /api/auth/login       # User login
POST /api/auth/register    # User registration
POST /api/auth/logout      # User logout
GET  /api/auth/profile     # Get user profile
```

### Properties

```
GET    /api/properties              # Get all properties (with filters)
GET    /api/properties/:id          # Get single property
POST   /api/properties              # Create property (Agent/Admin)
PUT    /api/properties/:id          # Update property (Agent/Admin)
DELETE /api/properties/:id          # Delete property (Agent/Admin)
GET    /api/properties/search       # Advanced property search
GET    /api/properties/trending     # Get trending properties
```

### Admin

```
GET  /api/admin/stats               # Platform statistics
GET  /api/admin/users               # User management
GET  /api/admin/properties          # Property management
POST /api/admin/users/:id/:action   # User actions (activate/deactivate)
POST /api/admin/properties/:id/:action # Property actions (approve/reject)
```

### Inquiries

```
GET  /api/inquiries                 # Get user inquiries
POST /api/inquiries                 # Create new inquiry
PUT  /api/inquiries/:id             # Update inquiry status
```

## 🎨 Design System

### Color Palette

- **Primary**: Indigo/Blue (#4F46E5) for trust and professionalism
- **Secondary**: Green (#10B981) accents for success states
- **Neutrals**: Gray scale (#6B7280, #374151) for text and backgrounds
- **Status Colors**: Red (#EF4444) errors, Yellow (#F59E0B) warnings, Green (#10B981) success

### Component Architecture

- **Atomic Design**: Atoms → Molecules → Organisms → Pages
- **Responsive Breakpoints**: Mobile-first design approach
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized images and lazy loading

### Key UI Components

- **Property Cards**: Consistent property display across all views
- **Dashboard Layouts**: Role-specific interfaces with navigation
- **Forms**: Multi-step property creation and user authentication
- **Modals**: Contact agents and confirmation dialogs
- **Charts**: Analytics visualization using Recharts

## 🔧 Development Guidelines

### Code Standards

- **TypeScript**: Strict typing for better development experience
- **ESLint**: Code linting and formatting
- **Component Structure**: Functional components with hooks
- **State Management**: Context API for global state

### Best Practices

- **Security First**: Input validation, sanitization, and authentication
- **Performance**: Optimized queries and efficient rendering
- **User Experience**: Loading states, error handling, and feedback
- **Scalability**: Modular architecture and separation of concerns

### Adding New Features

1. **Backend**: Create controller → Add routes → Update models
2. **Frontend**: Create components → Add routing → Update context
3. **Testing**: Test API endpoints → Test UI components
4. **Documentation**: Update README → Add API docs

## 📄 .gitignore Configuration

Create/update your `.gitignore` file with:

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
build/
dist/
.next/
out/

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache
.cache/
.parcel-cache/

# Next.js build output
.next/

# Nuxt.js build output
.nuxt/

# Vuepress build output
.vuepress/dist/

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~
*.sublime-project
*.sublime-workspace

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Uploads directory (if storing files locally)
uploads/
public/uploads/

# Database files
*.db
*.sqlite
*.sqlite3

# Test files
test-results/
coverage/

# Temporary files
temp/
tmp/
*.tmp

# Editor backups
*~
*.bak
*.swp

# Compiled source
*.com
*.class
*.dll
*.exe
*.o
*.so

# Archives
*.7z
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip

# System Files
.DS_Store
Thumbs.db
```

## 🚀 Deployment

### Production Environment Setup

#### Backend Deployment (Heroku/Railway/Render)

```bash
# Build production bundle
npm run build

# Set environment variables in hosting platform:
MONGODB_URI=<production-mongodb-connection>
JWT_SECRET=<strong-production-secret>
NODE_ENV=production
FRONTEND_URL=<production-frontend-url>
```

#### Frontend Deployment (Vercel/Netlify)

```bash
# Build React app
npm run build

# Set environment variables:
REACT_APP_API_URL=<production-backend-url>
```

### Recommended Hosting Services

- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Railway, Render, Heroku, or AWS EC2
- **Database**: MongoDB Atlas (recommended for production)
- **File Storage**: AWS S3 or Cloudinary for property images

## 📊 Performance Monitoring

### Key Metrics to Track

- **Page Load Times**: Frontend performance monitoring
- **API Response Times**: Backend endpoint performance
- **Database Query Performance**: MongoDB slow queries
- **User Engagement**: Property views, searches, inquiries
- **Error Rates**: Frontend errors and backend exceptions

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Errors

```bash
# Check connection string format
# Ensure IP whitelist includes your address
# Verify database user permissions
```

#### CORS Issues

```bash
# Update FRONTEND_URL in backend .env
# Check cors configuration in server.js
```

#### Authentication Problems

```bash
# Verify JWT_SECRET is consistent
# Check token expiry settings
# Validate password requirements
```

#### Build Errors

```bash
# Clear node_modules and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install

# Check Node.js version compatibility
# Verify all environment variables are set
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Setup for Contributors

1. Follow installation instructions above
2. Create a new branch for your feature
3. Test your changes thoroughly
4. Update documentation if needed
5. Submit pull request with clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Email**: support@rentflow360.com
- **GitHub Issues**: [Create an issue](https://github.com/your-username/rentflow360/issues)
- **Documentation**: Refer to this README and inline code comments

## 🙏 Acknowledgments

- **MongoDB Atlas** for reliable database hosting
- **Tailwind CSS** for the utility-first CSS framework
- **React Community** for the amazing ecosystem and components
- **Node.js Community** for robust backend development tools
- **Kenya Real Estate Market** for inspiration and requirements

## 📈 Future Roadmap

### Phase 1 (Current)

- ✅ Core property management system
- ✅ User authentication and roles
- ✅ Admin dashboard
- ✅ Basic property creation

### Phase 2 (Planned)

- 🔄 Image upload functionality
- 🔄 Advanced property search filters
- 🔄 Real-time notifications
- 🔄 Payment integration

### Phase 3 (Future)

- 📱 Mobile app development
- 🌍 Multi-language support (Swahili, English)
- 📊 Advanced analytics dashboard
- 💬 Real-time messaging system
- 🗺️ Map integration with property locations

---

**Built with ❤️ for the Kenyan Real Estate Market**

_Rentflow360 - Simplifying Property Discovery and Management_
