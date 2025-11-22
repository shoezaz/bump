import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { users, watches, watchHistory, transfers, stolenReports } from './data.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ========== AUTH ROUTES ==========

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      kycStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== WATCHES ROUTES ==========

// GET /api/watches
app.get('/api/watches', authenticateToken, (req, res) => {
  const { ownerId } = req.query;
  let filteredWatches = watches;

  if (ownerId) {
    filteredWatches = watches.filter(w => w.currentOwnerId === ownerId);
  }

  res.json(filteredWatches);
});

// GET /api/watches/:id
app.get('/api/watches/:id', authenticateToken, (req, res) => {
  const watch = watches.find(w => w.id === req.params.id);
  if (!watch) {
    return res.status(404).json({ message: 'Watch not found' });
  }
  res.json(watch);
});

// GET /api/watches/serial/:serialNumber
app.get('/api/watches/serial/:serialNumber', authenticateToken, (req, res) => {
  const watch = watches.find(w => w.serialNumber === req.params.serialNumber);
  if (!watch) {
    return res.status(404).json({ message: 'Watch not found' });
  }
  res.json(watch);
});

// POST /api/watches
app.post('/api/watches', authenticateToken, (req, res) => {
  const newWatch = {
    id: uuidv4(),
    ...req.body,
    currentOwnerId: req.user.id,
    status: 'certified',
    blockchainHash: '0x' + uuidv4().replace(/-/g, ''),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  watches.push(newWatch);
  res.status(201).json(newWatch);
});

// PUT /api/watches/:id
app.put('/api/watches/:id', authenticateToken, (req, res) => {
  const index = watches.findIndex(w => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Watch not found' });
  }
  watches[index] = { ...watches[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(watches[index]);
});

// GET /api/watches/:id/history
app.get('/api/watches/:id/history', authenticateToken, (req, res) => {
  const history = watchHistory.filter(h => h.watchId === req.params.id);
  res.json(history);
});

// POST /api/watches/:id/history
app.post('/api/watches/:id/history', authenticateToken, (req, res) => {
  const newHistory = {
    id: uuidv4(),
    watchId: req.params.id,
    ...req.body,
    performedBy: req.user.id,
    eventDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  watchHistory.push(newHistory);
  res.status(201).json(newHistory);
});

// ========== TRANSFERS ROUTES ==========

// GET /api/transfers
app.get('/api/transfers', authenticateToken, (req, res) => {
  res.json(transfers);
});

// GET /api/transfers/:id
app.get('/api/transfers/:id', authenticateToken, (req, res) => {
  const transfer = transfers.find(t => t.id === req.params.id);
  if (!transfer) {
    return res.status(404).json({ message: 'Transfer not found' });
  }
  res.json(transfer);
});

// GET /api/transfers/token/:token
app.get('/api/transfers/token/:token', authenticateToken, (req, res) => {
  const transfer = transfers.find(t => t.transferToken === req.params.token);
  if (!transfer) {
    return res.status(404).json({ message: 'Transfer not found' });
  }
  res.json(transfer);
});

// POST /api/transfers
app.post('/api/transfers', authenticateToken, (req, res) => {
  const { watchId, fromUserId } = req.body;
  const newTransfer = {
    id: uuidv4(),
    watchId,
    fromUserId,
    toUserId: null,
    transferToken: 'TRF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'pending',
    expiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  transfers.push(newTransfer);
  res.status(201).json(newTransfer);
});

// PUT /api/transfers/:id/status
app.put('/api/transfers/:id/status', authenticateToken, (req, res) => {
  const index = transfers.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Transfer not found' });
  }

  const { status, toUserId } = req.body;
  transfers[index] = {
    ...transfers[index],
    status,
    toUserId: toUserId || transfers[index].toUserId,
    updatedAt: new Date().toISOString(),
  };

  // If transfer is completed, update watch owner
  if (status === 'completed' && toUserId) {
    const watchIndex = watches.findIndex(w => w.id === transfers[index].watchId);
    if (watchIndex !== -1) {
      watches[watchIndex].currentOwnerId = toUserId;
      watches[watchIndex].updatedAt = new Date().toISOString();
    }
  }

  res.json(transfers[index]);
});

// ========== REPORTS ROUTES ==========

// GET /api/reports
app.get('/api/reports', authenticateToken, (req, res) => {
  res.json(stolenReports);
});

// GET /api/reports/:id
app.get('/api/reports/:id', authenticateToken, (req, res) => {
  const report = stolenReports.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  res.json(report);
});

// GET /api/reports/watch/:watchId
app.get('/api/reports/watch/:watchId', authenticateToken, (req, res) => {
  const reports = stolenReports.filter(r => r.watchId === req.params.watchId);
  res.json(reports);
});

// POST /api/reports
app.post('/api/reports', authenticateToken, (req, res) => {
  const newReport = {
    id: uuidv4(),
    ...req.body,
    reportedBy: req.user.id,
    status: 'open',
    blockchainHash: '0x' + uuidv4().replace(/-/g, ''),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  stolenReports.push(newReport);
  res.status(201).json(newReport);
});

// PUT /api/reports/:id
app.put('/api/reports/:id', authenticateToken, (req, res) => {
  const index = stolenReports.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Report not found' });
  }
  stolenReports[index] = {
    ...stolenReports[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(stolenReports[index]);
});

// ========== USERS ROUTES ==========

// GET /api/users
app.get('/api/users', authenticateToken, (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

// GET /api/users/:id
app.get('/api/users/:id', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// PUT /api/users/:id
app.put('/api/users/:id', authenticateToken, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Don't allow password updates through this endpoint
  const { password, ...updates } = req.body;
  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { password: _, ...userWithoutPassword } = users[index];
  res.json(userWithoutPassword);
});

// ========== HEALTH CHECK ==========

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Watch Passport Mock API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      watches: '/api/watches',
      transfers: '/api/transfers',
      reports: '/api/reports',
      users: '/api/users',
    },
    demo: {
      email: 'demo@watchpassport.com',
      password: 'demo123',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Watch Passport Mock Backend running on port ${PORT}`);
  console.log(`📧 Demo credentials: demo@watchpassport.com / demo123`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});

export default app;
