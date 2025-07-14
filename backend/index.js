// backend/index.js

const express = require('express');
const path = require('path');
const cors = require('cors');
const {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  DeleteItemCommand
} = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8080;

// AWS / JWT config
const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'transactions';
const USER_TABLE = process.env.DYNAMODB_USER_TABLE || 'users';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const db = new DynamoDBClient({ region: REGION });

app.use(cors());
app.use(express.json());

// ---- AUTH ROUTES (all under /api) ----

// Register new user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if user exists
    const existing = await db.send(new ScanCommand({
      TableName: USER_TABLE,
      FilterExpression: 'username = :u',
      ExpressionAttributeValues: { ':u': { S: username } }
    }));
    if (existing.Items?.length) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    await db.send(new PutItemCommand({
      TableName: USER_TABLE,
      Item: {
        username: { S: username },
        password: { S: hashedPassword }
      }
    }));
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register', details: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const data = await db.send(new ScanCommand({
      TableName: USER_TABLE,
      FilterExpression: 'username = :u',
      ExpressionAttributeValues: { ':u': { S: username } }
    }));
    if (!data.Items?.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = unmarshall(data.Items[0]);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login', details: err.message });
  }
});

// JWT middleware
function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ---- EXPENSE ROUTES ----

// List all expenses/incomes for the authenticated user
app.get('/api/expenses', authenticateJWT, async (req, res) => {
  try {
    const data = await db.send(new ScanCommand({ TableName: TABLE_NAME }));
    const items = (data.Items || [])
      .map(i => unmarshall(i))
      .filter(e => e.username === req.user.username);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses', details: err.message });
  }
});

// Add a new expense/income
app.post('/api/expenses', authenticateJWT, async (req, res) => {
  const { description, amount, type } = req.body;
  if (!description || typeof amount !== 'number' || !['expense', 'income'].includes(type)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const id = Date.now().toString();
  const item = {
    id: { S: id },
    description: { S: description },
    amount: { N: amount.toString() },
    type: { S: type },
    username: { S: req.user.username }
  };

  try {
    await db.send(new PutItemCommand({ TableName: TABLE_NAME, Item: item }));
    res.status(201).json({ id, description, amount, type });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add record', details: err.message });
  }
});

// Delete an expense/income by ID
app.delete('/api/expenses/:id', authenticateJWT, async (req, res) => {
  const id = req.params.id;
  try {
    // Verify ownership
    const data = await db.send(new ScanCommand({ TableName: TABLE_NAME }));
    const record = (data.Items || [])
      .map(i => unmarshall(i))
      .find(e => e.id === id && e.username === req.user.username);
    if (!record) {
      return res.status(404).json({ error: 'Record not found or not yours' });
    }

    await db.send(new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: { id: { S: id } }
    }));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record', details: err.message });
  }
});

// ---- STATIC ASSETS & CATCH-ALL FOR REACT ----

app.use(express.static(path.join(__dirname, '../frontend/build')));

// Only catch non-API GET requests and serve index.html.
// This regex route never touches a full URL, so path-to-regexp never sees "https://..."
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// ---- START SERVER ----

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});