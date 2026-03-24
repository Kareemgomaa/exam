import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if (!authorization) {
            return res.json({ message: "token is required" });
        }
        let [bearer, token] = authorization.split(" ");
        let signature = "";
        switch (bearer) {
            case "admin":
                signature = "nti2026";
                break;
            case "user":
                signature = "nti2027";
                break;
            case "teacher":
                signature = "nti2028";
                break;
            default:
                signature = "nti2027"
        }
        let decode = jwt.verify(token, signature);
        req.user = decode;
        next();
    } catch (error) {
        return res.json({ message: "token error", error: error.message });
    }
};




export const generateToken = (user) => {
    if (!user) {
        console.error("Error: user object is undefined in generateToken");
        return null;
    }

    let signature = "";
    switch (user.role) {
        case "admin":
            signature = "nti2026";
            break;
        case "user":
            signature = "nti2027";
            break;
        case "teacher":
            signature = "nti2028";
            break;
        default:
            signature = "nti2027";
    }

    return jwt.sign({ _id: user._id, role: user.role }, signature, { expiresIn: "7d" });
};



export const allowedRoles = (roles) => {
    return (req, res, next) => {
        try {
            let { authorization } = req.headers;
            if (!authorization) return res.json({ message: "token is required" });
            let [bearer, token] = authorization.split(" ");
            let signature = "";
            switch (bearer) {
                case "admin":
                    signature = "nti2026";
                    break;
                case "user":
                    signature = "nti2027";
                    break;
                case "teacher":
                    signature = "nti2028";
                    break;
                default:
                    signature = "nti2027";
            }
            let decode = jwt.verify(token, signature);
            if (!roles.includes(decode.role)) {
                return res.status(403).json({ message: "You don't have permission" });
            }
            req.user = decode;
            next();
        } catch (error) {
            res.json({ message: "Invalid token", error: error.message });
        }
    };
};

