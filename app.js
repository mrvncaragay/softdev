require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const userRoute = require('./routes/userRoutes');

const app = express();

// Parse incoming request with json and urlencoded payload
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Log additional info for every request
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api/users', userRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
