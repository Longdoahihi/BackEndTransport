/**
 * Định nghĩa các routes dành cho các  views và dành cho các routes api
 */
const billOfLadingRouter  = require('./admin/billOfLadingsRoutes');
const billOfLadingApiRouter  = require('./api/billOfLadingsRoutes');
const customersRoutesApiRouter  = require('./api/customersRoutes');
const registerEmployeeApiRouter  = require('./api/registerEmployeeRoutes');
const registerApiRouter  = require('./api/register');
const loginApiRouter  = require('./api/login');
const adminLoginApiRouter  = require('./api/adminLoginRoutes');
const wareHouseApiRouter  = require('./api/warehousesRoutes');
function route ( app) {
    app.use('/api/bill-of-ladings',billOfLadingApiRouter);
    app.use('/api/customer',customersRoutesApiRouter);
    app.use('/api/admin-login',adminLoginApiRouter);
    app.use("/api/employee-register",registerEmployeeApiRouter);
    app.use("/api/register",registerApiRouter);
    app.use("/api/login",loginApiRouter);
    app.use("/api/warehouse",wareHouseApiRouter);
    //luôn đặt trước router chủ
    app.use("/",(req,res)=>{
        res.render("home")
    })
}

module.exports = route;
