Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

bcryptjs

📁 Project Structure
BlogPlatform/
│
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── User.js
│   │   └── Post.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│       └── authRoutes.js
│       └── postRoutes.js
│
└── frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── post.html
    ├── styles/
    │   └── main.css
    └── scripts/
        └── api.js
        └── auth.js
        └── posts.js

🔗 API Endpoints
Authentication Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login & receive JWT token
Post Routes
Method	Endpoint	Description
GET	/api/posts	Get all posts
GET	/api/posts/:id	Get single post
POST	/api/posts	Create a new post (requires auth)
PUT	/api/posts/:id	Update a post (requires auth)
DELETE	/api/posts/:id	Delete a post (requires auth)
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/coolkunal9/BlogPlatform.git
cd BlogPlatform/backend

2️⃣ Install Backend Dependencies
npm install

3️⃣ Create .env File inside Backend Folder
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

4️⃣ Start Backend Server
node server.js


Server runs at:

http://localhost:5000

5️⃣ Start Frontend

Open any of the HTML files in the frontend folder (index.html) using Live Server or directly in your browser.


👨‍💻 Author

Kunal Prasad
Full-Stack Developer
