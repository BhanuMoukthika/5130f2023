const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer'); 
const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const databaseFile = 'userDatabase.json';


function saveUsers(users) {
  fs.writeFileSync(databaseFile, JSON.stringify(users, null, 2));
}

function loadUsers() {
  if (fs.existsSync(databaseFile)) {
    const data = fs.readFileSync(databaseFile, 'utf8');
    return JSON.parse(data);
  } else {
    return [];
  }
}

function isValidEmail(email) {
  
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: 'bhanumoukthikad@gmail.com',
    pass: 'Moukthika123@',
  },
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send('Invalid email format');
  }

  if (userExists(email)) {
    return res.status(400).send('User already exists');
  }

  // Generate a secret key for 2FA
  const secret = speakeasy.generateSecret();

  // Store the user profile in the database (for simplicity, just a JSON file)
  const newUser = { email, password, secret: secret.base32 };
  const users = loadUsers();
  users.push(newUser);
  saveUsers(users);

  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
  });

  console.log('Generated OTP:', otp);

  const mailOptions = {
    from: 'bhanumoukthikad@email.com',
    to: email,
    subject: 'Your OTP for 2FA Setup',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).send('Error sending OTP');
    }
    console.log('OTP sent:', info.response);

    // Generate a QR code for the Authenticator app
    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return res.status(500).send('Error generating QR code');
      }
      // Render a page with the QR code for the user to scan
      res.send(`
        <html>
        <head>
          <title>2FA Setup</title>
        </head>
        <body>
          <h1>2FA Setup</h1>
          <p>Scan the QR code below with your Authenticator app:</p>
          <img src="${data_url}" alt="QR Code">
          <p>Save the secret key: ${secret.base32}</p>
          <a href="/">Back to Home</a>
        </body>
        </html>
      `);
    });
  });
});

app.post('/signin', (req, res) => {
  const { email, password, otp } = req.body;

  // Check if the user exists and the password matches (insecure for demonstration purposes)
  if (userExists(email) && getUser(email).password === password) {
    // Verify the OTP
    const user = getUser(email);
    const otpVerification = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: otp,
    });

    if (otpVerification) {
      return res.status(200).send('Login successful');
    } else {
      return res.status(401).send('2FA verification failed');
    }
  } else {
    return res.status(401).send('Login failed');
  }
});

function userExists(email) {
  const users = loadUsers();
  return users.some((user) => user.email === email);
}

function getUser(email) {
  const users = loadUsers();
  return users.find((user) => user.email === email);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
