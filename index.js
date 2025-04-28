const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET);
console.log('REDIRECT_URI:', process.env.REDIRECT_URI);

const port = process.env.PORT || 3000;

// Route to handle Google OAuth callback
app.get("/callback", async (req, res) => {
  const code = req.query.code; // The authorization code sent by Google
  const codeVerifier = req.body.code_verifier;
  
  iif (!code || !codeVerifier) {
    return res.status(400).send('Missing code or code_verifier');
  }

  try {
    // Exchange the code for access and refresh tokens
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
      code_verifier: codeVerifierHere
    });

    const { access_token, refresh_token } = response.data;

    // Store tokens or send them back in the response
    res.json({ access_token, refresh_token });

  } catch (error) {
   // console.error('Error exchanging code:', error);
    console.error('Error exchanging code:', error.response?.data || error.message);
    res.status(500).send('Error exchanging authorization code.');
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

