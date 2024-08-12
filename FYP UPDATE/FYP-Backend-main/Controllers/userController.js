const db = require("../Config/Database"); // Update the path to your Firebase config file
const firebase = require("firebase/app");
const jwt = require("jsonwebtoken");
require("firebase/auth");
const sendEmail = require('./sendEmail');
const bcrypt = require("bcrypt");
const jwtKey = "FYP";
let userData = {};
let verificationCode = 0;
let FPEmail = null;
const SALT_ROUNDS = 10;

const signUp = async (req, res) => {
    try {
        const existingUser = await db.collection("users").where("email", "==", req.body.email).get();
        
        if (!existingUser.empty) {
            return res.status(400).send({ already: true, error: "Email already exists" });
        } else {
            userData = req.body; 
            verificationCode = Math.floor(100000 + Math.random() * 900000);
            sendEmail(userData.email, verificationCode); 
            res.json({ success: true, message: "Email sent successfully", email: userData.email });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

const code = async (req, res) => {
    try {
        if (req.body.forgetpassword && req.body.code) {
            if (verificationCode == req.body.code) {
                verificationCode = 0;
                return res.json({ "Verify": "Email has been verified" });
            } else {
                return res.status(400).json({ "error": "Code Error" });
            }
        }

        if (verificationCode == req.body.code && req.body.SignupEmailVerify) {
            verificationCode = 0;
        
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
            userData.password = hashedPassword;
        
            const userRef = await db.collection("users").add(userData);
            const userDoc = await userRef.get();
        
            if (userDoc.exists) {
                const token = jwt.sign({ uid: userDoc.id }, jwtKey, { expiresIn: "2h" });
                return res.json({ "user": userDoc.data(), "auth_token": token });
            } else {
                return res.status(500).json({ "error": "Something went wrong" });
            }
        }
         else {
            return res.status(400).json({ "error": "Code Not matched" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ "error": "Something went wrong" });
    }
};

const resend = async(req,res)=>{
    verificationCode = Math.floor(100000 + Math.random() * 900000);
    sendEmail(userData.email, verificationCode); 
    res.send({ "resend": true });
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();

        if (userSnapshot.empty) {
            return res.send({ "error": "User not found" });
        }

        const user = userSnapshot.docs[0].data();

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ uid: userSnapshot.docs[0].id }, jwtKey, { expiresIn: "2h" });
            res.send({ user, auth_token: token });
        } else {
            res.send({ "error": "Invalid credentials" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ "error": "Something went wrong" });
    }
}

const forgetpassword = async(req,res)=>{
    try {
        const userSnapshot = await db.collection("users").where("email", "==", req.body.email).limit(1).get();
        if (!userSnapshot.empty) {
            verificationCode = Math.floor(100000 + Math.random() * 900000);
            sendEmail(req.body.email, verificationCode); 
            res.send({ resend : true });
            FPEmail = { email: req.body.email };
        } else {
            res.status(400).send({ notalready: true, error: "Email not exists. Please Signup." });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ "error": "Something went wrong" });
    }
}

const getemail = (req, res) => {
    if (FPEmail && FPEmail.email) {
        res.send({ email: FPEmail.email });
    } else {
        res.send({ error: "Something went wrong" });
    }
};

const updatepassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();

        if (!userSnapshot.empty) {
            const userDocRef = userSnapshot.docs[0].ref;
            await userDocRef.update({ password: password });
            res.status(200).json({ update: true });
            FPEmail = null;
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const resendforFP= async(req,res)=>{
    if(FPEmail != null){
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        sendEmail(FPEmail.email, verificationCode); 
        res.send({ "resend": true, email:FPEmail.email });
    }
    else{
        res.send({ "notentermail": true, });
    }
}

module.exports = {
    signUp, signIn, code, resend, forgetpassword, getemail,updatepassword,resendforFP,
};

