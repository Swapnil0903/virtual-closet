const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ensure JSON files exist
if (!fs.existsSync('users.json')) {
    fs.writeFileSync('users.json', JSON.stringify([]));
}
if (!fs.existsSync('items.json')) {
    fs.writeFileSync('items.json', JSON.stringify([]));
}

// Register Route
app.post('/api/register', (req, res) => {
    const { name, email, username, password } = req.body;
    const newUser = { name, email, username, password };

    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: 'Error reading user data' });
        }
        const users = data ? JSON.parse(data) : [];
        users.push(newUser);
        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).json({ error: 'Failed to register user' });
            }
            console.log("User registered successfully:", newUser);
            res.status(200).json({ message: 'User registered successfully' });
        });
    });
});

// Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log("Login attempt:", { username, password });

    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: 'Error reading user data' });
        }

        const users = JSON.parse(data);
        console.log("Loaded users:", users);

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            console.log("Login successful for:", user);
            res.status(200).json({ message: 'Login successful' });
        } else {
            console.log("Login failed for:", { username, password });
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

// Get Items Route
app.get('/api/items', (req, res) => {
    fs.readFile('items.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading items file:", err);
            return res.status(500).json({ error: 'Error reading items data' });
        }

        const items = JSON.parse(data || '[]');
        console.log("Items fetched successfully:", items);
        res.status(200).json(items);
    });
});

// Add Item Route
app.post('/api/add-item', (req, res) => {
    const { name, ageGroup, location, image } = req.body;
    const newItem = { name, ageGroup, location, image };

    fs.readFile('items.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading items file:", err);
            return res.status(500).json({ error: 'Error reading items data' });
        }

        const items = JSON.parse(data || '[]');
        items.push(newItem);

        fs.writeFile('items.json', JSON.stringify(items, null, 2), (err) => {
            if (err) {
                console.error("Error writing items file:", err);
                return res.status(500).json({ error: 'Failed to add item' });
            }
            console.log("Item added successfully:", newItem);
            res.status(200).json({ message: 'Item added successfully' });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
