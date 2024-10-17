// Load environment variables from .env file (e.g., database credentials, API keys)
import dotenv from 'dotenv';
import express from 'express';
import pkg from 'pg'; // Import PostgreSQL package
import cors from 'cors'; // Middleware to enable CORS for cross-origin requests
import OpenAI from 'openai'; // OpenAI client
import rateLimit from 'express-rate-limit'; // Middleware to limit repeated requests
import { body, validationResult } from 'express-validator'; // Middleware for request validation
import bcrypt from 'bcryptjs'; // Library for hashing passwords
import jwt from 'jsonwebtoken'; // Library for creating and verifying JSON Web Tokens (JWT)

// Destructure Pool from the PostgreSQL package
const { Pool } = pkg;

// Load environment variables
dotenv.config();

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// PostgreSQL configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Define allowed OpenAI models for cost control
const allowedModels = ['gpt-3.5-turbo', 'gpt-4']; // Add more models if needed
const MAX_TOKENS_PER_REQUEST = 150; // Limit for the number of tokens generated in a response

// Initialize OpenAI client with API key
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn("OpenAI API key is not set. Some features may not work.");
}

// Middleware to limit excessive login attempts to prevent abuse
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: "Too many login attempts, please try again later."
});

// Endpoint to register a new user
app.post('/api/register', [
  // Validation rules for request body
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8); // Hash the user's password for secure storage
  try {
    // Insert new user into the database
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    // Generate a JWT token for the new user
    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    // Handle duplicate email registration
    if (error.code === '23505') { // PostgreSQL error code for unique violation
      res.status(400).send('Email already registered');
    } else {
      res.status(500).send('Error creating user');
    }
  }
});

// Endpoint to login a user
app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    // Fetch user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // Compare provided password with stored hashed password
    if (user && bcrypt.compareSync(password, user.password)) {
      // Generate a JWT token upon successful login
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to save chat messages and interact with OpenAI
app.post('/api/chat', async (req, res) => {
  const { userId, message, model } = req.body;
  
  // Validate the selected model and default to 'gpt-3.5-turbo' if the model is not allowed or missing
  const chosenModel = allowedModels.includes(model) ? model : 'gpt-3.5-turbo';

  try {
    // Save the user's message to the database
    await pool.query('INSERT INTO chat (user_id, message) VALUES ($1, $2)', [userId, message]);
    
    let aiResponseText = "AI response is unavailable.";
    
    // Check if OpenAI is configured and available
    if (openai) {
      // Generate a response using the chosen model and limit the tokens to control costs
      const aiResponse = await openai.chat.completions.create({
        model: chosenModel,
        messages: [{ role: "user", content: `Provide a project update response based on this message: "${message}"` }],
        max_tokens: MAX_TOKENS_PER_REQUEST, // Limit tokens to control costs
      });
      aiResponseText = aiResponse.data.choices[0].message.content.trim();
    }

    // Return the original message and AI-generated response
    res.json({ userMessage: message, aiResponse: aiResponseText });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving message or generating response');
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  // Extract the 'Authorization' header from the request
  const authHeader = req.headers['authorization'];

  // Check if the 'Authorization' header exists
  if (!authHeader) {
    return res.sendStatus(401); // Unauthorized if no header is present
  }

  // Extract the token part (after 'Bearer')
  const token = authHeader.split(' ')[1];

  // Check if the token exists after 'Bearer'
  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token after "Bearer"
  }

  // Verify the token using the JWT_SECRET
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }

    // Attach the user information to the request object and proceed to the next function
    req.user = user;
    next();
  });
}

// Endpoint to retrieve chat history for a specific user
app.get('/api/chat/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch all chat messages for the specified user
    const result = await pool.query('SELECT * FROM chat WHERE user_id = $1', [userId]);
    res.json(result.rows); // Return chat history
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving chat history');
  }
});

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
