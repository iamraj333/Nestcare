const express = require('express');
const cors = require('cors');
const MongoConnection = require('./config/mongoConnection');
const UserRouter = require('./routes & controllers/userRoutesController');
require('dotenv').config();
const cookieParser=require('cookie-parser');
const ProfessionalRouter = require('./routes & controllers/professionalRoutesController');
const AdminRouter = require('./routes & controllers/adminRoutesController');
const SubscriptionPlanRouter = require('./routes & controllers/SubscriptionPlanRoutesController');
const SubscriptionRouter = require('./routes & controllers/subscriptionRoutesController');
const ServiceRouter = require('./routes & controllers/serviceRouteController');
const AuthRouter = require('./routes & controllers/AuthRoutesController');
const AdminProfessionalRouter = require('./routes & controllers/AdminProfessionalRouterController');
const AdminUserRouter = require('./routes & controllers/AdminUserRouterController');
const BookingRouter=require('./routes & controllers/bookingRoutesController');
const DisputeRouter = require('./routes & controllers/DisputeRouterController');
const CommunityRouter = require('./routes & controllers/CommunityRouterController');
const ContactRouter = require('./routes & controllers/ContactRouterController');

const app = express();


/*=================== MIDDLEWARE ========================*/
const corsExtra = {
    origin: process.env.CLIENT_URL,
    methods: 'GET, POST, PUT, DELETE, PATCH, HEAD',
    credentials: true
}
app.use(cors(corsExtra))
app.use(express.json({limit: "10MB"}));

app.use(express.urlencoded({extended: true,limit: "10mb"}));
app.use(cookieParser())


/*==================== ROUTES ==================================*/
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'NestCare web is run successfully.'
    })
})

// External Router
app.use("/user",UserRouter)
app.use('/professional',ProfessionalRouter)
app.use('/admin',AdminRouter)
app.use('/admin/user',AdminRouter)
app.use('/admin/professional',AdminProfessionalRouter)
app.use('/admin/user',AdminUserRouter)
app.use('/auth',AuthRouter)
app.use('/subscriptionPlan',SubscriptionPlanRouter)
app.use('/user/subscription',SubscriptionRouter)
app.use('/service', ServiceRouter)
app.use('/user/service', BookingRouter)
app.use('/admin/service/booking', BookingRouter)
app.use('/booking',BookingRouter)
app.use('/dispute',DisputeRouter)
app.use('/community',CommunityRouter)
app.use('/contact',ContactRouter)


/*================= Server Listen and Error Handling =======================================*/
app.use((err,req,res,next)=>{
    res.status(500).json({message:"Server is not responding..."})

})
const PORT = process.env.SERVER_PORT || 5000;
MongoConnection();
app.listen(PORT, () => {
    console.log(`NestCare server is running on ${PORT}`)
})
