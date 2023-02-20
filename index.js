const app = require("express")();

const cors = require("cors");

const mongoose = require("mongoose");

app.use(cors());

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

let userModel = mongoose.model("user", userSchema);

app.post('/api/users/register', async (req, res) => {
    await mongoose.connect("mongodb://localhost:27017/test-db");
    let user = await userModel.findOne({ email: req.query.email });
    if (user) {
        res.json("الحساب موجود مسبقاً");
    } else {
        let newUser = new userModel({
            name: req.query.name,
            email: req.query.email,
            password: req.query.password,
        });
        await newUser.save();
        res.json("تم إنشاء الحساب بنجاح");
    }
});

app.get("/api/users/login", async (req, res) => {
    await mongoose.connect("mongodb://localhost:27017/test-db");
    let user = await userModel.findOne({ email: req.query.email, password: req.query.password });
    if (user) {
        res.json(user);
    } else {
        res.json("عذراً إما الحساب غير موجود أو كلمة السر خطأ");
    }
});

app.get("/api/users/all-users", async (req, res) => {
    await mongoose.connect("mongodb://localhost:27017/test-db");
    let users = await userModel.find({});
    res.json(users);
});

app.delete("/api/users/delete-user/:userId", async (req, res) => {
    await mongoose.connect("mongodb://localhost:27017/test-db");
    let userId = req.params.userId;
    let users = await userModel.deleteOne({_id: userId});
    res.json(users);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`The Server Is Running: http://localhost:${PORT}`));