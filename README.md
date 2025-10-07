# 🏠 Rentflow360 - Real Estate Platform# 🏠 Rentflow360 - Real Estate Platform# Rentflow360 - Real Estate Platform

A comprehensive real estate web platform for discovering, filtering, and interacting with property listings across Kenyan cities.A comprehensive real estate web platform for discovering, filtering, and interacting with property listings across Kenyan cities.A comprehensive real estate web platform for discovering, filtering, and interacting with property listings across Kenyan cities.

## 📖 Project Overview## 📖 Project Overview## 🏠 Project Overview

Rentflow360 is a full-stack real estate platform that supports multiple user roles and provides a complete property management experience:Rentflow360 is a full-stack real estate platform that supports multiple user roles and provides a complete property management experience:Rentflow360 supports multiple user roles and provides a complete property management experience:

- **🔍 Guests**: Browse and search properties without registration- **🔍 Guests**: Browse and search properties without registration- **Guests**: Browse and search properties

- **👤 Registered Users**: Save favorites, set alerts, contact agents, leave reviews

- **🏢 Agents**: Create and manage listings, track performance, handle inquiries- **👤 Registered Users**: Save favorites, set alerts, contact agents, leave reviews- **Registered Users**: Save favorites, set alerts, contact sellers, leave reviews

- **⚡ Administrators**: Moderate content, manage users, view platform analytics

- **🏢 Agents**: Create and manage listings, track performance, handle inquiries- **Agents/Sellers**: Create and manage listings, track performance

## ✨ Key Features

- **⚡ Administrators**: Moderate content, manage users, view platform analytics- **Administrators**: Moderate content, manage users, view analytics

### Core Functionality

- **3-Page Property View System**: Preview → Full Details → Photo Gallery## ✨ Key Features## 🚀 Key Features

- **Intelligent Search**: Handles fuzzy input like "1-bedroom Kasarani apartment"

- **Role-Based Dashboards**: Customized interfaces for each user type### Core Functionality### Core Functionality

- **Real-time Analytics**: Track property views, inquiries, and performance

- **Property Management**: Complete CRUD operations for agents- **3-Page Property View System**: Preview → Full Details → Photo Gallery

- **Contact System**: Direct communication between users and agents

- **Admin Panel**: Comprehensive user and property management- **Intelligent Search**: Handles fuzzy input like "1-bedroom Kasarani apartment"- **3-Page Property View System**: Preview → Full Details → Photo Gallery

### Technical Highlights- **Role-Based Dashboards**: Customized interfaces for each user type- **Intelligent Search**: Handles fuzzy input like "1-bedroom Kasarani"

- **Responsive Design**: Mobile-first approach with Tailwind CSS

- **Secure Authentication**: JWT-based with role-based access control- **Real-time Analytics**: Track property views, inquiries, and performance- **Role-Based Dashboards**: Customized interfaces for each user type

- **Scalable Architecture**: RESTful APIs with MongoDB Atlas

- **Advanced Search**: Multi-field filtering with location-based results- **Property Management**: Complete CRUD operations for agents- **Real-time Analytics**: Track views, inquiries, and performance

- **Real-time Updates**: Dynamic content updates and notifications

- **Contact System**: Direct communication between users and agents

## 🛠️ Tech Stack

- **Admin Panel**: Comprehensive user and property management### Technical Highlights

### Frontend

- **React.js** (v18) - User interface framework### Technical Highlights- **Responsive Design**: Mobile-first approach with Tailwind CSS

- **TypeScript** - Type-safe JavaScript

- **Tailwind CSS** - Utility-first CSS framework- **Responsive Design**: Mobile-first approach with Tailwind CSS- **Secure Authentication**: JWT-based with role permissions

- **React Router** - Client-side routing

- **Recharts** - Data visualization for analytics- **Secure Authentication**: JWT-based with role-based access control- **Scalable Architecture**: RESTful APIs with MongoDB

### Backend- **Scalable Architecture**: RESTful APIs with MongoDB Atlas- **SEO Optimized**: Clean URLs and meta tags

- **Node.js** (v16+) - JavaScript runtime

- **Express.js** - Web application framework- **Advanced Search**: Multi-field filtering with location-based results

- **MongoDB** - NoSQL database

- **Mongoose** - MongoDB object modeling- **Real-time Updates**: Dynamic content updates and notifications## 🛠 Tech Stack

- **JWT** - JSON Web Token authentication

- **bcryptjs** - Password hashing## 🛠️ Tech Stack- **Frontend**: React.js, Tailwind CSS, React Router

- **express-validator** - Input validation and sanitization

- **Backend**: Node.js, Express.js

### Development Tools

- **Nodemon** - Development server auto-restart### Frontend- **Database**: MongoDB with Mongoose ODM

- **CORS** - Cross-Origin Resource Sharing

- **Helmet** - Security middleware- **React.js** (v18) - User interface framework- **Authentication**: JWT tokens

- **Compression** - Response compression

- **TypeScript** - Type-safe JavaScript- **File Storage**: Multer for image uploads

## 🚀 Installation & Setup

- **Tailwind CSS** - Utility-first CSS framework- **Search**: Fuse.js for fuzzy searching

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)- **React Router** - Client-side routing

- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/atlas)

- **Git** - [Download here](https://git-scm.com/)- **Recharts** - Data visualization for analytics## 📋 Installation & Setup

### 1. Clone the Repository### Backend### Prerequisites

```bash- **Node.js** (v16+) - JavaScript runtime

git clone https://github.com/dominicmutuku/rentflow360-real-estate-platform.git

cd rentflow360-real-estate-platform- **Express.js** - Web application framework- Node.js (v16 or higher)

```

- **MongoDB** - NoSQL database- MongoDB (local or cloud)

### 2. Backend Setup

- **Mongoose** - MongoDB object modeling- Git

#### Install Dependencies

```bash- **JWT** - JSON Web Token authentication

cd backend

npm install- **bcryptjs** - Password hashing### Installation Steps

```

- **express-validator** - Input validation and sanitization

#### Environment Configuration

Create a `.env` file in the `backend` directory:1. **Clone the repository**

`````env### Development Tools

# Database Configuration

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentflow360?retryWrites=true&w=majority- **Nodemon** - Development server auto-restart ```bash



# JWT Configuration- **CORS** - Cross-Origin Resource Sharing git clone <your-repo-url>

JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters

JWT_EXPIRES_IN=7d- **Helmet** - Security middleware cd Rentflow360



# Server Configuration- **Compression** - Response compression ```

PORT=5000

NODE_ENV=development## 🚀 Installation & Setup2. **Install backend dependencies**



# Frontend URL (for CORS)### Prerequisites ```bash

FRONTEND_URL=http://localhost:3000

```- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/) npm install



#### MongoDB Atlas Setup- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/atlas) ```

1. **Create MongoDB Atlas Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)

2. **Create a Cluster**: Choose the free tier- **Git** - [Download here](https://git-scm.com/)

3. **Create Database User**:

   - Go to Database Access3. **Install frontend dependencies**

   - Add new database user with username/password

   - Grant read/write access### 1. Clone the Repository

4. **Configure Network Access**:

   - Go to Network Access````bash

   - Add IP address (0.0.0.0/0 for development)

5. **Get Connection String**:```bash   cd frontend

   - Go to Clusters → Connect → Connect your application

   - Copy the connection stringgit clone https://github.com/your-username/rentflow360.git   npm install

   - Replace `<username>`, `<password>`, and `<database>` with your values

cd rentflow360   cd ..

#### Initialize Database

```bash```   ```

# Start the backend server

npm start



# In a new terminal, seed the database with sample data### 2. Backend Setup4. **Environment Setup**

node seed-properties.js

node seed-admin.jsCreate `.env` file in root directory:

`````

#### Install Dependencies

### 3. Frontend Setup

`bash`env

#### Install Dependencies

```bashcd backend   PORT=5000

cd ../frontend

npm installnpm install   MONGODB_URI=mongodb://localhost:27017/rentflow360

```

````JWT_SECRET=your_jwt_secret_key_here

#### Environment Configuration

Create a `.env` file in the `frontend` directory:NODE_ENV=development



```env#### Environment Configuration   ```

REACT_APP_API_URL=http://localhost:5000

REACT_APP_ENVIRONMENT=developmentCreate a `.env` file in the `backend` directory:

````

5. **Start the application**

#### Start Frontend Server

`bash`env

npm start

`# Database Configuration`bash

### 4. Access the ApplicationMONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentflow360?retryWrites=true&w=majority # Development mode (runs both frontend and backend)

- **Frontend**: http://localhost:3000npm run dev

- **Backend API**: http://localhost:5000

# JWT Configuration

## 👥 Default User Accounts

JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters # Or start individually

After running the seed scripts, you can use these accounts:

JWT_EXPIRES_IN=7d npm run server # Backend only

### Admin Account

- **Email**: `admin@rentflow360.com`npm run client # Frontend only

- **Password**: `admin123`

- **Access**: Full administrative privileges# Server Configuration ```

### Test Agent Account (Created during development)PORT=5000

- **Email**: `testagent@test.com`

- **Password**: `Test123`NODE_ENV=development6. **Access the application**

- **Access**: Agent dashboard and property creation

- Frontend: http://localhost:3000

### Creating New Users

Due to password validation requirements (must contain uppercase, lowercase, and number), create new accounts via the registration form with compliant passwords.# Frontend URL (for CORS) - Backend API: http://localhost:5000

**Password Requirements**:FRONTEND_URL=http://localhost:3000

- Minimum 8 characters

- At least one uppercase letter```## 📁 Project Structure

- At least one lowercase letter

- At least one number

## 📁 Project Structure#### MongoDB Atlas Setup```

```````````1. **Create MongoDB Atlas Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)Rentflow360/

rentflow360/

├── backend/                 # Backend Node.js application2. **Create a Cluster**: Choose the free tier├── backend/

│   ├── controllers/         # Route controllers

│   │   ├── authController.js       # Authentication logic3. **Create Database User**: │   ├── controllers/     # Route controllers

│   │   ├── propertyController.js   # Property CRUD operations

│   │   └── AdminController.js      # Admin panel operations- Go to Database Access│   ├── models/         # Database models

│   ├── middleware/          # Custom middleware

│   │   ├── auth.js                 # JWT authentication- Add new database user with username/password│   ├── routes/         # API routes

│   │   └── validation.js           # Input validation

│   ├── models/             # MongoDB/Mongoose models- Grant read/write access│   ├── middleware/     # Custom middleware

│   │   ├── User.js                 # User schema

│   │   ├── Property.js             # Property schema4. **Configure Network Access**:│   ├── utils/          # Utility functions

│   │   └── Inquiry.js              # Inquiry schema

│   ├── routes/             # API routes- Go to Network Access│   └── server.js       # Main server file

│   │   ├── auth.js                 # Authentication routes

│   │   ├── properties.js           # Property routes- Add IP address (0.0.0.0/0 for development)├── frontend/

│   │   └── admin.js                # Admin routes

│   ├── utils/              # Utility functions5. **Get Connection String**:│   ├── src/

│   │   ├── jwt.js                  # JWT utilities

│   │   └── password.js             # Password utilities- Go to Clusters → Connect → Connect your application│   │   ├── components/ # Reusable components

│   ├── seed-admin.js       # Admin user seeding script

│   ├── seed-properties.js  # Sample data seeding script- Copy the connection string│   │   ├── pages/      # Page components

│   └── server.js           # Main server file

├── frontend/               # Frontend React application- Replace `<username>`, `<password>`, and `<database>` with your values│   │   ├── context/    # React context

│   ├── public/             # Static files

│   ├── src/│   │   ├── utils/      # Frontend utilities

│   │   ├── components/     # Reusable React components

│   │   │   ├── layout/            # Header, Footer components#### Initialize Database│   │   └── styles/     # CSS files

│   │   │   ├── sections/          # TrendingProperties, etc.

│   │   │   └── ui/                # Buttons, Forms, etc.```bash│   └── public/         # Static assets

│   │   ├── context/        # React Context

│   │   │   └── AuthContext.tsx    # Authentication context# Start the backend server├── uploads/            # User uploaded files

│   │   ├── pages/          # Page components

│   │   │   ├── AdminDashboard.tsx  # Admin management interfacenpm start└── README.md

│   │   │   ├── AgentDashboard.tsx  # Agent property management

│   │   │   ├── UserDashboard.tsx   # User favorites and alerts````

│   │   │   ├── AddProperty.tsx     # Property creation form

│   │   │   ├── Login.tsx           # Login page# In a new terminal, seed the database with sample data

│   │   │   └── Register.tsx        # Registration page

│   │   ├── utils/          # Frontend utilitiesnode seed-properties.js## 🎯 Key Design Decisions

│   │   │   └── config.ts           # API configuration

│   │   └── App.tsx         # Main App componentnode seed-admin.js

└── README.md              # Project documentation

``````````1. **3-Page Property System**: Unique UX for progressive information disclosure



## 🔐 Authentication System2. **Fuzzy Search**: Enhanced user experience with intelligent query matching



### User Roles & Permissions### 3. Frontend Setup3. **Role-Based Architecture**: Clean separation of user capabilities



| Role | Permissions |4. **Mobile-First Design**: Ensures optimal mobile experience

|------|-------------|

| **Guest** | Browse properties, search, view details |#### Install Dependencies5. **RESTful API Design**: Scalable and maintainable backend structure

| **User** | All guest permissions + save favorites, contact agents, reviews |

| **Agent** | All user permissions + create/manage listings, view analytics |```bash

| **Admin** | All permissions + user management, content moderation |

cd ../frontend## 🧪 Testing

### Security Features

- **JWT Authentication**: Secure token-based authentication with 7-day expirynpm install

- **Password Hashing**: bcrypt with salt rounds for secure password storage

- **Role-based Access Control**: Route protection by user role``````bash

- **Input Validation**: Comprehensive validation and sanitization

- **Security Headers**: Helmet.js for security headersnpm test

- **Login Attempt Limiting**: Protection against brute force attacks

#### Environment Configuration```

## 🗃️ Database Schema

Create a `.env` file in the `frontend` directory:

### Key Collections

## 🚀 Deployment

#### Users

```javascript```env

{

  firstName: String,REACT_APP_API_URL=http://localhost:50001. **Build for production**

  lastName: String,

  email: String (unique),REACT_APP_ENVIRONMENT=development

  password: String (hashed),

  role: ['guest', 'user', 'agent', 'admin'],```   ```bash

  isActive: Boolean,

  activity: {   npm run build

    lastLogin: Date,

    loginCount: Number#### Start Frontend Server   ```

  },

  security: {```bash

    loginAttempts: Number,

    lockUntil: Datenpm start2. **Start production server**

  }

}```   ```bash

```````````

npm start

#### Properties

`javascript### 4. Access the Application`

{

title: String,

description: String,

propertyType: ['apartment', 'house', 'villa', 'townhouse', 'studio'],- **Frontend**: http://localhost:3000## 📊 API Endpoints

listingType: ['rent', 'sale', 'lease'],

price: {- **Backend API**: http://localhost:5000

    amount: Number,

    currency: 'KES',### Authentication

    period: ['monthly', 'yearly', 'one-time']

},## 👥 Default User Accounts

location: {

    address: String,- `POST /api/auth/register` - User registration

    city: String,

    neighborhood: String,After running the seed scripts, you can use these accounts:- `POST /api/auth/login` - User login

    coordinates: [Number, Number]

},- `GET /api/auth/profile` - Get user profile

specifications: {

    bedrooms: Number,### Admin Account

    bathrooms: Number,

    size: {- **Email**: `admin@rentflow360.com`### Properties

      value: Number,

      unit: String- **Password**: `admin123`

    }

},- **Access**: Full administrative privileges- `GET /api/properties` - Get all properties

features: [String],

amenities: [String],- `GET /api/properties/:id` - Get single property

images: [String],

agent: ObjectId (ref: User),### Test Agent Account (Created during development)- `POST /api/properties` - Create property (Agent only)

status: ['active', 'inactive', 'pending']

}- **Email**: `testagent@test.com`- `PUT /api/properties/:id` - Update property (Agent only)

````

- **Password**: `Test123`- `DELETE /api/properties/:id` - Delete property (Agent/Admin)

#### Inquiries

```javascript- **Access**: Agent dashboard and property creation

{

  user: ObjectId (ref: User),### Search & Filters

  property: ObjectId (ref: Property),

  agent: ObjectId (ref: User),### Creating New Users

  message: String,

  status: ['pending', 'responded', 'closed'],Due to password validation requirements (must contain uppercase, lowercase, and number), create new accounts via the registration form with compliant passwords.- `GET /api/search` - Search properties with filters

  createdAt: Date

}- `GET /api/properties/trending` - Get trending properties

````

**Password Requirements**:

## 📊 API Endpoints

- Minimum 8 characters### User Features

### Authentication

```- At least one uppercase letter

POST /api/auth/login       # User login

POST /api/auth/register    # User registration  - At least one lowercase letter  - `POST /api/favorites` - Add to favorites

POST /api/auth/logout      # User logout

GET  /api/auth/profile     # Get user profile- At least one number- `GET /api/favorites` - Get user favorites

```

- `POST /api/reviews` - Add property review

### Properties

```## 📁 Project Structure- `POST /api/reports` - Report property

GET /api/properties # Get all properties (with filters)

GET /api/properties/:id # Get single property

POST /api/properties # Create property (Agent/Admin)

PUT /api/properties/:id # Update property (Agent/Admin)```## 🔧 Development

DELETE /api/properties/:id # Delete property (Agent/Admin)

GET /api/properties/search # Advanced property searchrentflow360/

GET /api/properties/trending # Get trending properties

```├── backend/                 # Backend Node.js application### Adding New Features



### Admin  │   ├── controllers/         # Route controllers

```

GET /api/admin/stats # Platform statistics│ │ ├── authController.js # Authentication logic1. Create backend routes in `/backend/routes/`

GET /api/admin/users # User management

GET /api/admin/properties # Property management│ │ ├── propertyController.js # Property CRUD operations2. Add controllers in `/backend/controllers/`

POST /api/admin/users/:id/:action # User actions (activate/deactivate)

POST /api/admin/properties/:id/:action # Property actions (approve/reject)│ │ └── AdminController.js # Admin panel operations3. Create frontend components in `/frontend/src/components/`

````````

│   ├── middleware/          # Custom middleware4. Update API calls in frontend utilities

### Inquiries

```│   │   ├── auth.js                 # JWT authentication

GET  /api/inquiries                 # Get user inquiries

POST /api/inquiries                 # Create new inquiry│   │   └── validation.js           # Input validation### Database Models

PUT  /api/inquiries/:id             # Update inquiry status

```│   ├── models/             # MongoDB/Mongoose models



## 🎨 Design System│   │   ├── User.js                 # User schema- User (with roles: guest, user, agent, admin)



### Color Palette│   │   ├── Property.js             # Property schema- Property (with all property details)

- **Primary**: Indigo/Blue (#4F46E5) for trust and professionalism

- **Secondary**: Green (#10B981) accents for success states│   │   └── Inquiry.js              # Inquiry schema- Review (user reviews for properties)

- **Neutrals**: Gray scale (#6B7280, #374151) for text and backgrounds

- **Status Colors**: Red (#EF4444) errors, Yellow (#F59E0B) warnings, Green (#10B981) success│   ├── routes/             # API routes- Favorite (user's saved properties)



### Component Architecture│   │   ├── auth.js                 # Authentication routes- Report (reported properties)

- **Atomic Design**: Atoms → Molecules → Organisms → Pages

- **Responsive Breakpoints**: Mobile-first design approach│   │   ├── properties.js           # Property routes

- **Accessibility**: ARIA labels and keyboard navigation

- **Performance**: Optimized images and lazy loading│   │   └── admin.js                # Admin routes## 📈 Future Enhancements



### Key UI Components│   ├── utils/              # Utility functions

- **Property Cards**: Consistent property display across all views

- **Dashboard Layouts**: Role-specific interfaces with navigation│   │   ├── jwt.js                  # JWT utilities- Real-time messaging system

- **Forms**: Multi-step property creation and user authentication

- **Modals**: Contact agents and confirmation dialogs│   │   └── password.js             # Password utilities- Payment integration

- **Charts**: Analytics visualization using Recharts

│   ├── seed-admin.js       # Admin user seeding script- Advanced analytics dashboard

## 🔧 Development Guidelines

│   ├── seed-properties.js  # Sample data seeding script- Mobile app development

### Code Standards

- **TypeScript**: Strict typing for better development experience│   └── server.js           # Main server file- Multi-language support

- **ESLint**: Code linting and formatting

- **Component Structure**: Functional components with hooks├── frontend/               # Frontend React application

- **State Management**: Context API for global state

│   ├── public/             # Static files## 🤝 Contributing

### Best Practices

- **Security First**: Input validation, sanitization, and authentication│   ├── src/

- **Performance**: Optimized queries and efficient rendering

- **User Experience**: Loading states, error handling, and feedback│   │   ├── components/     # Reusable React components1. Fork the repository

- **Scalability**: Modular architecture and separation of concerns

│   │   │   ├── layout/            # Header, Footer components2. Create a feature branch

### Adding New Features

1. **Backend**: Create controller → Add routes → Update models│   │   │   ├── sections/          # TrendingProperties, etc.3. Commit your changes

2. **Frontend**: Create components → Add routing → Update context

3. **Testing**: Test API endpoints → Test UI components│   │   │   └── ui/                # Buttons, Forms, etc.4. Push to the branch

4. **Documentation**: Update README → Add API docs

│   │   ├── context/        # React Context5. Create a Pull Request

## 📄 .gitignore Configuration

│   │   │   └── AuthContext.tsx    # Authentication context

Create/update your `.gitignore` file with:

│   │   ├── pages/          # Page components## 📝 License

```gitignore

# Dependencies│   │   │   ├── AdminDashboard.tsx  # Admin management interface

node_modules/

npm-debug.log*│   │   │   ├── AgentDashboard.tsx  # Agent property managementThis project is licensed under the MIT License.

yarn-debug.log*

yarn-error.log*│   │   │   ├── UserDashboard.tsx   # User favorites and alerts

package-lock.json

yarn.lock│   │   │   ├── AddProperty.tsx     # Property creation form---



# Environment variables│   │   │   ├── Login.tsx           # Login page

.env

.env.local│   │   │   └── Register.tsx        # Registration page**Built with ❤️ for the Kenyan Real Estate Market**

.env.development.local

.env.test.local│   │   ├── utils/          # Frontend utilities

.env.production.local│   │   │   └── config.ts           # API configuration

│   │   └── App.tsx         # Main App component

# Build outputs└── README.md              # Project documentation

build/```````

dist/

.next/## 🔐 Authentication System

out/

### User Roles & Permissions

# Logs

logs/| Role      | Permissions                                                     |

*.log| --------- | --------------------------------------------------------------- |

| **Guest** | Browse properties, search, view details                         |

# Runtime data| **User**  | All guest permissions + save favorites, contact agents, reviews |

pids/| **Agent** | All user permissions + create/manage listings, view analytics   |

*.pid| **Admin** | All permissions + user management, content moderation           |

*.seed

*.pid.lock### Security Features



# Coverage directory used by tools like istanbul- **JWT Authentication**: Secure token-based authentication with 7-day expiry

coverage/- **Password Hashing**: bcrypt with salt rounds for secure password storage

*.lcov- **Role-based Access Control**: Route protection by user role

.nyc_output- **Input Validation**: Comprehensive validation and sanitization

- **Security Headers**: Helmet.js for security headers

# Dependency directories- **Login Attempt Limiting**: Protection against brute force attacks

jspm_packages/

## 🗃️ Database Schema

# Optional npm cache directory

.npm### Key Collections



# Optional REPL history#### Users

.node_repl_history

```javascript

# Output of 'npm pack'{

*.tgz  firstName: String,

  lastName: String,

# Yarn Integrity file  email: String (unique),

.yarn-integrity  password: String (hashed),

  role: ['guest', 'user', 'agent', 'admin'],

# parcel-bundler cache  isActive: Boolean,

.cache/  activity: {

.parcel-cache/    lastLogin: Date,

    loginCount: Number

# Next.js build output  },

.next/  security: {

    loginAttempts: Number,

# Nuxt.js build output    lockUntil: Date

.nuxt/  }

}

# Vuepress build output```

.vuepress/dist/

#### Properties

# Serverless directories

.serverless/```javascript

{

# FuseBox cache  title: String,

.fusebox/  description: String,

  propertyType: ['apartment', 'house', 'villa', 'townhouse', 'studio'],

# DynamoDB Local files  listingType: ['rent', 'sale', 'lease'],

.dynamodb/  price: {

    amount: Number,

# TernJS port file    currency: 'KES',

.tern-port    period: ['monthly', 'yearly', 'one-time']

  },

# IDE files  location: {

.vscode/    address: String,

.idea/    city: String,

*.swp    neighborhood: String,

*.swo    coordinates: [Number, Number]

*~  },

*.sublime-project  specifications: {

*.sublime-workspace    bedrooms: Number,

    bathrooms: Number,

# OS generated files    size: {

.DS_Store      value: Number,

.DS_Store?      unit: String

._*    }

.Spotlight-V100  },

.Trashes  features: [String],

ehthumbs.db  amenities: [String],

Thumbs.db  images: [String],

  agent: ObjectId (ref: User),

# Uploads directory (if storing files locally)  status: ['active', 'inactive', 'pending']

uploads/}

public/uploads/```



# Database files#### Inquiries

*.db

*.sqlite```javascript

*.sqlite3{

  user: ObjectId (ref: User),

# Test files  property: ObjectId (ref: Property),

test-results/  agent: ObjectId (ref: User),

coverage/  message: String,

  status: ['pending', 'responded', 'closed'],

# Temporary files  createdAt: Date

temp/}

tmp/```

*.tmp

## 📊 API Endpoints

# Editor backups

*~### Authentication

*.bak

*.swp```

POST /api/auth/login       # User login

# Compiled sourcePOST /api/auth/register    # User registration

*.comPOST /api/auth/logout      # User logout

*.classGET  /api/auth/profile     # Get user profile

*.dll```

*.exe

*.o### Properties

*.so

````````

# ArchivesGET /api/properties # Get all properties (with filters)

\*.7zGET /api/properties/:id # Get single property

\*.dmgPOST /api/properties # Create property (Agent/Admin)

\*.gzPUT /api/properties/:id # Update property (Agent/Admin)

\*.isoDELETE /api/properties/:id # Delete property (Agent/Admin)

\*.jarGET /api/properties/search # Advanced property search

\*.rarGET /api/properties/trending # Get trending properties

\*.tar```

\*.zip

### Admin

# System Files

.DS_Store```

Thumbs.dbGET /api/admin/stats # Platform statistics

````GET  /api/admin/users               # User management

GET  /api/admin/properties          # Property management

## 🚀 DeploymentPOST /api/admin/users/:id/:action   # User actions (activate/deactivate)

POST /api/admin/properties/:id/:action # Property actions (approve/reject)

### Production Environment Setup```



#### Backend Deployment (Heroku/Railway/Render)### Inquiries

```bash

# Build production bundle```

npm run buildGET  /api/inquiries                 # Get user inquiries

POST /api/inquiries                 # Create new inquiry

# Set environment variables in hosting platform:PUT  /api/inquiries/:id             # Update inquiry status

MONGODB_URI=<production-mongodb-connection>```

JWT_SECRET=<strong-production-secret>

NODE_ENV=production## 🎨 Design System

FRONTEND_URL=<production-frontend-url>

```### Color Palette



#### Frontend Deployment (Vercel/Netlify)- **Primary**: Indigo/Blue (#4F46E5) for trust and professionalism

```bash- **Secondary**: Green (#10B981) accents for success states

# Build React app- **Neutrals**: Gray scale (#6B7280, #374151) for text and backgrounds

npm run build- **Status Colors**: Red (#EF4444) errors, Yellow (#F59E0B) warnings, Green (#10B981) success



# Set environment variables:### Component Architecture

REACT_APP_API_URL=<production-backend-url>

```- **Atomic Design**: Atoms → Molecules → Organisms → Pages

- **Responsive Breakpoints**: Mobile-first design approach

### Recommended Hosting Services- **Accessibility**: ARIA labels and keyboard navigation

- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront- **Performance**: Optimized images and lazy loading

- **Backend**: Railway, Render, Heroku, or AWS EC2

- **Database**: MongoDB Atlas (recommended for production)### Key UI Components

- **File Storage**: AWS S3 or Cloudinary for property images

- **Property Cards**: Consistent property display across all views

## 📊 Performance Monitoring- **Dashboard Layouts**: Role-specific interfaces with navigation

- **Forms**: Multi-step property creation and user authentication

### Key Metrics to Track- **Modals**: Contact agents and confirmation dialogs

- **Page Load Times**: Frontend performance monitoring- **Charts**: Analytics visualization using Recharts

- **API Response Times**: Backend endpoint performance

- **Database Query Performance**: MongoDB slow queries## 🔧 Development Guidelines

- **User Engagement**: Property views, searches, inquiries

- **Error Rates**: Frontend errors and backend exceptions### Code Standards



## 🔧 Troubleshooting- **TypeScript**: Strict typing for better development experience

- **ESLint**: Code linting and formatting

### Common Issues- **Component Structure**: Functional components with hooks

- **State Management**: Context API for global state

#### MongoDB Connection Errors

```bash### Best Practices

# Check connection string format

# Ensure IP whitelist includes your address- **Security First**: Input validation, sanitization, and authentication

# Verify database user permissions- **Performance**: Optimized queries and efficient rendering

```- **User Experience**: Loading states, error handling, and feedback

- **Scalability**: Modular architecture and separation of concerns

#### CORS Issues

```bash### Adding New Features

# Update FRONTEND_URL in backend .env

# Check cors configuration in server.js1. **Backend**: Create controller → Add routes → Update models

```2. **Frontend**: Create components → Add routing → Update context

3. **Testing**: Test API endpoints → Test UI components

#### Authentication Problems4. **Documentation**: Update README → Add API docs

```bash

# Verify JWT_SECRET is consistent## 📄 .gitignore Configuration

# Check token expiry settings

# Validate password requirementsCreate/update your `.gitignore` file with:

````

````gitignore

#### Build Errors# Dependencies

```bashnode_modules/

# Clear node_modules and reinstallnpm-debug.log*

Remove-Item node_modules -Recurse -Forceyarn-debug.log*

Remove-Item package-lock.json -Forceyarn-error.log*

npm installpackage-lock.json

yarn.lock

# Check Node.js version compatibility

# Verify all environment variables are set# Environment variables

```.env

.env.local

## 🤝 Contributing.env.development.local

.env.test.local

1. **Fork the repository**.env.production.local

2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)

3. **Commit your changes** (`git commit -m 'Add amazing feature'`)# Build outputs

4. **Push to the branch** (`git push origin feature/amazing-feature`)build/

5. **Open a Pull Request**dist/

.next/

### Development Setup for Contributorsout/

1. Follow installation instructions above

2. Create a new branch for your feature# Logs

3. Test your changes thoroughlylogs/

4. Update documentation if needed*.log

5. Submit pull request with clear description

# Runtime data

## 📄 Licensepids/

*.pid

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.*.seed

*.pid.lock

## 📞 Support & Contact

# Coverage directory used by tools like istanbul

- **Email**: support@rentflow360.comcoverage/

- **GitHub Issues**: [Create an issue](https://github.com/dominicmutuku/rentflow360-real-estate-platform/issues)*.lcov

- **Documentation**: Refer to this README and inline code comments.nyc_output



## 🙏 Acknowledgments# Dependency directories

jspm_packages/

- **MongoDB Atlas** for reliable database hosting

- **Tailwind CSS** for the utility-first CSS framework  # Optional npm cache directory

- **React Community** for the amazing ecosystem and components.npm

- **Node.js Community** for robust backend development tools

- **Kenya Real Estate Market** for inspiration and requirements# Optional REPL history

.node_repl_history

## 📈 Future Roadmap

# Output of 'npm pack'

### Phase 1 (Current)*.tgz

- ✅ Core property management system

- ✅ User authentication and roles# Yarn Integrity file

- ✅ Admin dashboard.yarn-integrity

- ✅ Basic property creation

# parcel-bundler cache

### Phase 2 (Planned).cache/

- 🔄 Image upload functionality.parcel-cache/

- 🔄 Advanced property search filters

- 🔄 Real-time notifications# Next.js build output

- 🔄 Payment integration.next/



### Phase 3 (Future)# Nuxt.js build output

- 📱 Mobile app development.nuxt/

- 🌍 Multi-language support (Swahili, English)

- 📊 Advanced analytics dashboard# Vuepress build output

- 💬 Real-time messaging system.vuepress/dist/

- 🗺️ Map integration with property locations

# Serverless directories

---.serverless/



**Built with ❤️ for the Kenyan Real Estate Market**# FuseBox cache

.fusebox/

*Rentflow360 - Simplifying Property Discovery and Management*
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
````

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

# rentflow360-real-estate-platform
