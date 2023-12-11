import jwt, { GetPublicKeyOrSecret, Secret, VerifyErrors } from "jsonwebtoken";

// import jwt from 'jsonwebtoken';
interface DecodedUser {
    email: string;
    isAdmin: number;
}

const verifyTokenMiddleware = (req :Request, res:Response, next) => {
    const token = req.cookies.token;

    if (!process.env.SECRET_KEY || !token ) {
        return res.sendStatus(401); 
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    console.log(jwt.verify(token, process.env.SECRET_KEY))
    if(!decodedToken){
        return res.sendStatus(401); 
    }else{
        return res.json({
            login: true,
            data: decodedToken,
        })
    }
    // jwt.verify(token, process.env.SECRET_KEY, verifyOptions, function (err: VerifyErrors | null, decoded: DecodedUser | undefined) {
    //         if (err) {
    //             return res.sendStatus(403);
    //         }

    //         req.user = decoded;
    //         next();
    //     });
};

export default verifyTokenMiddleware;
