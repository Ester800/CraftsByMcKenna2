const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { readdirSync } = require('fs');
const path = require('path');
require('dotenv').config();

//app
const app = express();

// db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
.then(() => console.log('DB CONNECTED'))
.catch(err => console.log(`DB CONNECTION ERROR`, err));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

// routes middleware
// app.use('/api', authRoutes); --> quieted after refactoring code below!
readdirSync('./routes').map((r) => app.use("/api", require('./routes/' + r)));  // automates the routing process

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));



