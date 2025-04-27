const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Route to handle Google OAuth callback
app.get("/callback", async (req, res) => {
  const code = req.query.code; // The authorization code sent by Google
  if (!code) {
    return res.status(400).send('No authorization code provided.');
  }

  try {
    // Exchange the code for access and refresh tokens
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token } = response.data;

    // Store tokens or send them back in the response
    res.json({ access_token, refresh_token });

  } catch (error) {
    console.error('Error exchanging code:', error);
    res.status(500).send('Error exchanging authorization code.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

