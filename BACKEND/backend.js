const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios'); // Added for making API requests to Daraja

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_and_long_jwt_secret_key'; 

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

// --- DARAJA M-PESA HELPER FUNCTIONS ---
const getDarajaToken = async () => {
    const consumerKey = process.env.DARAJA_CONSUMER_KEY;
    const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
    if (!consumerKey || !consumerSecret) {
        throw new Error("Daraja Consumer Key or Secret is not defined in .env file.");
    }
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}` },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to get Daraja token:', error.response ? error.response.data : error.message);
        throw new Error('Could not retrieve Daraja auth token.');
    }
};

const initiateSTKPush = async (token, phone, amount, accountReference) => {
    const shortcode = process.env.DARAJA_SHORTCODE;
    const passkey = process.env.DARAJA_PASSKEY;
    const callbackUrl = `${process.env.BACKEND_URL}/api/payments/callback`;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phone,
                PartyB: shortcode,
                PhoneNumber: phone,
                CallBackURL: callbackUrl,
                AccountReference: accountReference,
                TransactionDesc: 'Unlock Somanamimi Videos',
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error('STK Push failed:', error.response ? error.response.data : error.message);
        throw new Error('STK Push initiation failed.');
    }
};


// --- AUTHENTICATION MIDDLEWARE ---
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            
            const [rows] = await db.query('SELECT id, name, email, role, has_subscription FROM users WHERE id = ?', [decoded.id]);
            req.user = rows[0];

            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// ... existing admin middleware ...
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};


// --- API ROUTES ---

// ... existing Auth and Video routes ...
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const [userExists] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        const insertId = result.insertId;

        if (insertId) {
             const token = jwt.sign({ id: insertId }, JWT_SECRET, { expiresIn: '30d' });
             res.status(201).json({ 
                 message: 'User registered successfully',
                 token 
             });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                has_subscription: user.has_subscription,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

app.get('/api/videos', async (req, res) => {
    try {
        const [videos] = await db.query('SELECT id, title, description, url, category, thumbnail_url, is_free FROM videos');
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch videos' });
    }
});

app.post('/api/videos', protect, admin, async (req, res) => {
    const { title, description, url, category, thumbnail_url, is_free } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO videos (title, description, url, category, thumbnail_url, is_free) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, url, category, thumbnail_url, is_free]
        );
        res.status(201).json({ message: 'Video added successfully', videoId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add video' });
    }
});

app.put('/api/videos/:id', protect, admin, async (req, res) => {
    const { title, description, url, category, thumbnail_url, is_free } = req.body;
    try {
        await db.query(
            'UPDATE videos SET title = ?, description = ?, url = ?, category = ?, thumbnail_url = ?, is_free = ? WHERE id = ?',
            [title, description, url, category, thumbnail_url, is_free, req.params.id]
        );
        res.json({ message: 'Video updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update video' });
    }
});

app.delete('/api/videos/:id', protect, admin, async (req, res) => {
    try {
        await db.query('DELETE FROM videos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Video removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove video' });
    }
});


// --- NEW PAYMENT ROUTES ---

app.post('/api/payments/stk-push', protect, async (req, res) => {
    const { phone, amount } = req.body;
    const userId = req.user.id; // Get user ID from our 'protect' middleware

    try {
        const token = await getDarajaToken();
        const response = await initiateSTKPush(token, phone, amount, `USER${userId}`);
        
        // Log the payment attempt in our database
        await db.query(
            'INSERT INTO payments (user_id, phone_number, amount, merchant_request_id, checkout_request_id) VALUES (?, ?, ?, ?, ?)',
            [userId, phone, amount, response.MerchantRequestID, response.CheckoutRequestID]
        );
        
        res.status(200).json({ message: "STK Push initiated successfully. Please check your phone." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Failed to initiate STK push." });
    }
});

app.post('/api/payments/callback', async (req, res) => {
    console.log('--- Daraja Callback Received ---');
    console.log(JSON.stringify(req.body, null, 2));

    const callbackData = req.body.Body.stkCallback;
    const merchantRequestID = callbackData.MerchantRequestID;
    const resultCode = callbackData.ResultCode;

    try {
        if (resultCode === 0) {
            // Payment was successful
            // Find the original payment record
            const [payments] = await db.query('SELECT user_id FROM payments WHERE merchant_request_id = ?', [merchantRequestID]);
            if (payments.length > 0) {
                const userId = payments[0].user_id;
                // Update the user's subscription status
                await db.query('UPDATE users SET has_subscription = TRUE WHERE id = ?', [userId]);
                // Update the payment status to 'completed'
                await db.query("UPDATE payments SET status = 'completed' WHERE merchant_request_id = ?", [merchantRequestID]);
                console.log(`User ${userId} subscription activated.`);
            }
        } else {
            // Payment failed or was cancelled
            await db.query("UPDATE payments SET status = 'failed' WHERE merchant_request_id = ?", [merchantRequestID]);
            console.log(`Payment failed for MerchantRequestID: ${merchantRequestID}`);
        }
        
        res.status(200).json({ message: 'Callback processed' });
    } catch (error) {
        console.error('Error processing callback:', error);
        res.status(500).json({ message: 'Error processing callback' });
    }
});


// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});

