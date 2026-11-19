const fs = require('fs');
function log(msg) {
    fs.appendFileSync('debug.log', msg + '\n');
    console.log(msg);
}

log('Step 1: Starting debug script');

try {
    log('Step 2: Loading dotenv');
    const dotenv = require('dotenv');
    const path = require('path');
    dotenv.config({ path: path.join(__dirname, 'server', '.env') });
    log('PORT: ' + process.env.PORT);
    log('MONGODB_URL: ' + (process.env.MONGODB_URL ? 'exists' : 'missing'));

    log('Step 3: Loading express');
    const express = require('express');
    const app = express();

    log('Step 4: Loading database config');
    const database = require('./server/config/database');
    
    log('Step 5: Loading cloudinary config');
    const { cloudinaryConnect } = require('./server/config/cloudinary');

    log('Step 6: Loading routes');
    const userRoutes = require("./server/routes/user");
    log('userRoutes loaded');
    const profileRoutes = require("./server/routes/profile");
    log('profileRoutes loaded');
    const courseRoutes = require("./server/routes/Course");
    log('courseRoutes loaded');
    const paymentRoutes = require("./server/routes/Payments");
    log('paymentRoutes loaded');
    const contactUsRoute = require("./server/routes/Contact");
    log('contactUsRoute loaded');

    log('Step 7: Connecting to database');
    database.connect();

    log('Step 8: Starting HTTP server on port ' + (process.env.PORT || 4000));
    app.get("/", (req, res) => {
        return res.json({
            success: true,
            message: "Your server is up and running ...",
        });
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        log(`App is listening at ${PORT}`);
    });

} catch (err) {
    log('ERROR: ' + err.stack);
}
