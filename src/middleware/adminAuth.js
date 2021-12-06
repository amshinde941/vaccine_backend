import jwt from 'jsonwebtoken';
import {Admin} from '../models/admin.js';

const adminAuth = async (req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ","");
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const admin = await Admin.findOne({
            _id: decodedToken._id,
            "tokens.token": token,
        });
        
        if(!admin){
            throw new Error();
        }

        req.admin = admin;
        req.token = token;

        next();
    }catch(e){
        res.status(401).send({error: "authentication failed"});
    }
};

export  {adminAuth};