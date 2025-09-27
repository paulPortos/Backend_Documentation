# 📚 My First Backend App: Notes & Login System

**What is this?** This is a simple web application that runs on your computer! It lets people create accounts, log in, and save their notes online. Think of it like a digital notebook with a secure login system.

**What does it do?** 
- People can create accounts (like signing up for Instagram or TikTok)
- They can log in with their username and password
- Once logged in, they can write, save, edit, and delete their personal notes
- Each person can only see their own notes (privacy!)

## Table of Contents (What's in this guide)
- [What can this app do?](#what-can-this-app-do)
- [What do I need before starting?](#what-do-i-need-before-starting)
- [How to set it up step by step](#how-to-set-it-up-step-by-step)
- [Understanding the folders and files](#understanding-the-folders-and-files)
- [Settings and configuration](#settings-and-configuration)
- [How the database works](#how-the-database-works)
- [How to use the app](#how-to-use-the-app)
- [Examples and testing](#examples-and-testing)

## What can this app do?

- ✅ **Sign Up**: New users can create accounts
- ✅ **Log In**: Users can sign in with email and password
- ✅ **Secure Login**: Passwords are encrypted (scrambled) for safety
- ✅ **Profile**: Users can view and update their profile info
- ✅ **Create Notes**: Write and save personal notes
- ✅ **Edit Notes**: Change notes you already wrote
- ✅ **Delete Notes**: Remove notes you don't want anymore
- ✅ **Search Notes**: Find notes by typing keywords
- ✅ **Organize Notes**: Mark notes as important or put them in categories
- ✅ **User Types**: Different permission levels (admin vs regular user)
- ✅ **Safe & Secure**: Only you can see your notes, passwords are protected

## What do I need before starting?

Think of these like ingredients you need before cooking. You need to install these programs on your computer first:

- **Node.js** (version 16 or newer) - This is like the engine that runs our app
- **MongoDB** (version 4.4 or newer) - This is our database where we store user info and notes
- **npm** - This comes with Node.js and helps us install other code packages (like downloading apps on your phone)

**Don't worry!** We'll show you how to install these step by step.

## How to set it up step by step

### Step 1: Download the code
If you got this from somewhere like GitHub, download it to your computer:
```bash
# If you have git installed:
git clone <repository-url>
cd Backend_Documentation

# Or just download the ZIP file and unzip it
```

### Step 2: Install the required packages
Open your command prompt/terminal and type:
```bash
npm install
```
*This downloads all the extra code packages our app needs to work (like downloading dependencies for a mobile app)*

### Step 3: Set up your secret settings
Create a file called `.env` in your main folder (this file stores secret information):
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/backend_auth_notes
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**What do these mean?**
- `PORT=5000` - Your app will run on "port 5000" (like apartment number 5000)
- `MONGODB_URI` - This is the address where your database lives
- `JWT_SECRET` - A secret password for encrypting user login tokens
- `NODE_ENV=development` - Tells the app you're still testing it

### Step 4: Start your database
Make sure MongoDB is running on your computer:
```bash
# On Windows:
net start MongoDB

# On Mac:
brew services start mongodb-community
```

### Step 5: Start your app! 🚀
```bash
# For development (app restarts automatically when you make changes):
npm run dev

# For normal running:
npm start
```

Your app will start at `http://localhost:5000` - that's like the address of your app on your computer!

### Step 6: Check if it's working
- Open your browser and go to: `http://localhost:5000/health` - you should see a success message
- Or go to: `http://localhost:5000/api` - this shows what your app can do

## Understanding the folders and files

Think of this like organizing your bedroom - everything has its place! Here's what each folder and file does:

```
Backend_Documentation/          ← Main folder (like your bedroom)
├── .env                       ← Secret settings file (like your diary - keep it private!)
├── package.json               ← List of what packages our app needs
├── documentation.md           ← This instruction manual you're reading
└── src/                       ← Source folder (where all our code lives)
    ├── app.js                 ← Main app setup (like the blueprint of our app)
    ├── server.js              ← Starts our app and connects to database
    ├── configs/               ← Configuration folder
    │   └── database.js        ← Instructions for connecting to our database
    ├── controllers/           ← Controllers folder (the "brain" of our app)
    │   ├── authController.js  ← Handles login/signup logic
    │   └── notesController.js ← Handles creating/editing/deleting notes
    ├── middleware/            ← Middleware folder (like security guards)
    │   ├── auth.js            ← Checks if users are logged in
    │   └── errorHandler.js    ← Handles errors when something goes wrong
    ├── models/                ← Models folder (database blueprints)
    │   ├── UsersModel.js      ← Blueprint for user information
    │   └── NotesModel.js      ← Blueprint for notes information
    └── routers/               ← Routes folder (like street addresses)
        ├── authRoutes.js      ← Addresses for login/signup features
        └── notesRoutes.js     ← Addresses for notes features
```

### What each file does (in simple terms):

#### `server.js` - The Starter
- This file starts our entire app (like pressing the "ON" button)
- Connects our app to the database
- Makes sure everything is working properly

#### `app.js` - The Main Setup
- Sets up our app's basic rules and settings
- Tells our app how to handle different types of requests
- Like setting up the rules for a game before you start playing

#### `configs/database.js` - The Database Connector
- Contains the instructions for connecting to our database
- Like having the WiFi password to connect to the internet

#### `models/` folder - The Blueprints
- **UsersModel.js**: Describes what information we store about each user (name, email, password, etc.)
- **NotesModel.js**: Describes what information we store about each note (title, content, who wrote it, etc.)

#### `middleware/` folder - The Security Guards
- **auth.js**: Checks if someone is logged in before letting them access their notes
- **errorHandler.js**: When something goes wrong, this explains what happened

#### `controllers/` folder - The Brain
- **authController.js**: The smart code that handles logging in, signing up, and managing profiles
- **notesController.js**: The smart code that handles creating, reading, updating, and deleting notes

#### `routers/` folder - The Street Addresses
- **authRoutes.js**: All the web addresses (URLs) for login-related features
- **notesRoutes.js**: All the web addresses (URLs) for notes-related features

## Settings and configuration

These are like the settings on your phone - they control how your app behaves:

| Setting Name | What it does | Example Value |
|-------------|-------------|---------------|
| `PORT` | Which "door number" your app uses on your computer | 5000 |
| `MONGODB_URI` | The address where your database lives | mongodb://localhost:27017/backend_auth_notes |
| `JWT_SECRET` | A secret password for protecting user login sessions | your-super-secret-password |
| `NODE_ENV` | Whether you're testing or actually using the app | development |

## How the database works

Think of the database like filing cabinets where we store information. We have two main filing cabinets:

### 📁 Users Filing Cabinet (`UsersModel.js`)

This is where we keep information about each person who signs up:

```javascript
Each user folder contains:
{
  fullName: "John Doe",           // Their full name (required, max 100 letters)
  email: "john@example.com",      // Their email (required, must be valid email format)
  password: "******",             // Their password (required, at least 6 characters, encrypted)
  userType: "rentor",             // What type of user they are (admin or rentor)
  createdAt: "2025-01-15",        // When they signed up (automatically added)
  updatedAt: "2025-01-15"         // When they last updated their info (automatically updated)
}
```

**Cool features:**
- Passwords are automatically scrambled (encrypted) so even we can't see them!
- Email addresses must be real email format (like name@email.com)
- Each email can only be used once (no duplicate accounts)
- We automatically track when accounts are created and updated

### 📁 Notes Filing Cabinet (`NotesModel.js`)

This is where we keep all the notes that users write:

```javascript
Each note folder contains:
{
  title: "My Shopping List",      // The note title (required, max 200 letters)
  content: "Buy milk, eggs...",   // The actual note content (required, max 2000 letters)
  category: "Personal",           // What type of note it is (optional, max 50 letters)
  isImportant: false,             // Whether the user marked it as important (true/false)
  user: "user123456",             // Which user wrote this note (automatically connected)
  createdAt: "2025-01-15",        // When the note was created (automatically added)
  updatedAt: "2025-01-15"         // When the note was last changed (automatically updated)
}
```

**Cool features:**
- Notes are automatically connected to the user who wrote them
- Users can search through their notes by typing keywords
- We can quickly find notes because the database is organized efficiently
- Notes are organized by when they were created (newest first)

## How to use the app

Think of these like different buttons or pages in your app. Each one does something different:

### 🔐 Login and Signup Features

#### Sign up for a new account
**What it does:** Creates a new user account
**How to use it:** Send information to `POST /api/auth/register`

**What to send:**
```json
{
  "fullName": "John Doe",          // Your full name
  "email": "john@example.com",     // Your email address
  "password": "password123",       // Your password (at least 6 characters)
  "userType": "rentor"            // What type of user (admin or rentor)
}
```

**What you get back:**
```json
{
  "success": true,                 // Whether it worked or not
  "message": "User registered successfully",
  "data": {
    "user": { your user info },   // Your account information
    "token": "abc123xyz"          // Special login key for future requests
  }
}
```

#### Log into your account
**What it does:** Logs you into your existing account
**How to use it:** Send information to `POST /api/auth/login`

**What to send:**
```json
{
  "email": "john@example.com",     // Your email
  "password": "password123"        // Your password
}
```

**What you get back:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { your user info },   // Your account details
    "token": "abc123xyz"          // Your login key (save this!)
  }
}
```

#### View your profile
**What it does:** Shows your account information
**How to use it:** Send request to `GET /api/auth/profile`
**Important:** You need to include your login token!

**What you get back:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "userType": "rentor"
    }
  }
}
```

#### Update your profile
**What it does:** Changes your name or email
**How to use it:** Send information to `PUT /api/auth/profile`

**What to send:**
```json
{
  "fullName": "John Smith",        // New name (optional)
  "email": "johnsmith@example.com" // New email (optional)
}
```

### 📝 Notes Features

#### See all your notes
**What it does:** Shows a list of all your notes (with pages like a book)
**How to use it:** Send request to `GET /api/notes`
**You can add filters:** `GET /api/notes?page=1&limit=10&category=Work&isImportant=true&search=meeting`

**Filter options:**
- `page=1` - Which page of notes to see
- `limit=10` - How many notes per page
- `category=Work` - Only show notes from "Work" category
- `isImportant=true` - Only show important notes
- `search=meeting` - Only show notes containing the word "meeting"

#### See one specific note
**What it does:** Shows details of just one note
**How to use it:** `GET /api/notes/[note-id]` (replace [note-id] with the actual note ID)

#### Create a new note
**What it does:** Saves a new note for you
**How to use it:** Send information to `POST /api/notes`

**What to send:**
```json
{
  "title": "My Shopping List",     // Note title
  "content": "Buy milk, eggs, bread", // The actual note content
  "category": "Personal",          // What type of note (optional)
  "isImportant": true             // Whether it's important (optional)
}
```

#### Edit an existing note
**What it does:** Changes a note you already wrote
**How to use it:** Send updated information to `PUT /api/notes/[note-id]`

**What to send:**
```json
{
  "title": "Updated Shopping List",
  "content": "Buy milk, eggs, bread, and cheese",
  "category": "Personal",
  "isImportant": false
}
```

#### Delete a note
**What it does:** Permanently removes a note
**How to use it:** Send request to `DELETE /api/notes/[note-id]`
**Warning:** This cannot be undone!

#### Get statistics about your notes
**What it does:** Shows you cool stats like how many notes you have
**How to use it:** Send request to `GET /api/notes/stats`

**What you get back:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalNotes": 25,            // Total number of notes you have
      "importantNotes": 8,         // How many are marked important
      "categories": ["Work", "Personal", "Study"] // List of your categories
    }
  }
}
```
Authorization: Bearer <jwt_token>

Response:
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "note": { ... }
  }
}
```

#### Get Notes Statistics
```
GET /api/notes/stats
Authorization: Bearer <jwt_token>

Response:
{
  "success": true,
  "message": "Notes statistics retrieved successfully",
  "data": {
    "stats": {
      "totalNotes": 25,
      "importantNotes": 8,
      "categories": ["Work", "Personal", "Study"]
    }
  }
}
```

## Examples and testing

### 🔧 How to test your app (for beginners)

**Option 1: Using your web browser**
- Go to `http://localhost:5000/health` to check if your app is running
- Go to `http://localhost:5000/api` to see what your app can do

**Option 2: Using a tool called Postman (recommended for beginners)**
1. Download Postman (it's free) from `https://www.postman.com/downloads/`
2. Open Postman
3. Try these examples:

#### Test 1: Create an account
- Choose "POST" method
- URL: `http://localhost:5000/api/auth/register`
- In "Headers" tab, add: `Content-Type: application/json`
- In "Body" tab, choose "raw" and "JSON", then paste:
```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "userType": "rentor"
}
```
- Click "Send"
- You should get a success message and a token (save this token!)

#### Test 2: Create a note
- Choose "POST" method  
- URL: `http://localhost:5000/api/notes`
- In "Headers" tab, add:
  - `Content-Type: application/json`
  - `Authorization: Bearer [paste your token here]`
- In "Body" tab, paste:
```json
{
  "title": "My First Note",
  "content": "This is my first note using the API!",
  "category": "Test",
  "isImportant": true
}
```
- Click "Send"

### 🧪 Testing checklist (things to try)

**User Account Tests:**
- ✅ Create a new account with valid information
- ✅ Try to create an account with an invalid email (should fail)
- ✅ Try to create an account with an email that already exists (should fail)
- ✅ Log in with correct email and password
- ✅ Try to log in with wrong password (should fail)
- ✅ View your profile information
- ✅ Update your profile information

**Notes Tests:**
- ✅ Create a new note
- ✅ View all your notes
- ✅ View one specific note
- ✅ Edit a note you created
- ✅ Delete a note you created
- ✅ Search for notes with specific words
- ✅ Try to access someone else's notes (should fail)

## 🛡️ Safety and security stuff

**Important things to know about keeping your app safe:**

1. **Keep your secrets secret!** 
   - Never share your `.env` file with anyone
   - The JWT_SECRET should be really hard to guess
   - Don't put your `.env` file on GitHub or other public places

2. **Passwords are protected**
   - When someone creates an account, their password gets scrambled (encrypted)
   - Even you (the developer) can't see the real passwords
   - This is done automatically by our code

3. **Login tokens expire**
   - When someone logs in, they get a special token
   - This token is like a temporary key that expires after 7 days
   - After 7 days, they need to log in again

4. **Users can only see their own stuff**
   - Each person can only see and edit their own notes
   - The app automatically checks who is logged in before showing any notes

## 🚀 If you want to put this on the internet (deployment)

**For beginners - things to remember:**
1. Change `NODE_ENV=production` in your settings
2. Use a cloud database like MongoDB Atlas (free tier available)
3. Create a really strong JWT_SECRET (use a password generator)
4. Update the CORS settings with your website's address
5. Consider using services like Heroku, Railway, or Vercel for hosting

## 🔧 When things go wrong (troubleshooting)

**Common problems and how to fix them:**

**Problem:** "Can't connect to MongoDB"
- **Solution:** Make sure MongoDB is running on your computer, or check your database connection string

**Problem:** "Port 5000 is already in use"
- **Solution:** Either close the program using port 5000, or change PORT=5000 to PORT=5001 in your .env file

**Problem:** "Invalid token" errors
- **Solution:** Make sure you're including the token in your requests, and that it hasn't expired (tokens last 7 days)

**Problem:** "CORS error" when trying to use from a website
- **Solution:** Add your website's address to the CORS configuration in app.js

**Problem:** "Validation error" when creating users or notes
- **Solution:** Check that you're including all required fields (fullName, email, password for users; title, content for notes)

**Problem:** Can't see any notes
- **Solution:** Make sure you're logged in and using the correct token, and that you've actually created some notes

---

**📚 Congratulations!** You now have a working notes app with user accounts! 

**What you learned:**
- How to set up a web server
- How to connect to a database
- How to handle user registration and login
- How to create, read, update, and delete data
- How to keep user data secure and private

**Next steps you could try:**
- Add more fields to notes (like tags, due dates, or attachments)
- Create a simple website or mobile app that uses your API
- Learn about testing frameworks to automatically test your code
- Add features like sharing notes with other users
- Learn about deploying your app to the cloud

---

**Last Updated:** September 27, 2025  
**Made for:** High school students learning programming  
**Version:** 1.0.0 - Beginner Friendly
