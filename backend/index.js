require('dotenv').config();
const express = require('express');
const cors = require('cors');



const router = require('./Route/route');
const path = require("path");
require('./DB/connections');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files (images, videos) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes for handling requests (including courses and other APIs)
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});