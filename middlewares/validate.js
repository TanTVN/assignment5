const Joi = require("joi");

// Create validation strategy. Use Joi package to check 
const schemas = {
    userSchema: Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().min(6).max(30),
        confirmPassword: Joi.string().min(6).max(30).valid(Joi.ref("password")),
        otp: Joi.string()
    }),
};

// Function to check body
const validateBody = (name) => {
    return (req, res, next) => {
        const validatorResult = schemas[name].validate(req.body);

        if (validatorResult.error) {
            // Filter error message
            const errorList = validatorResult.error.details.map((e) => {
                let path = e.path;
                return { message: e.message, path: e.context.value };
            });

            return res.status(400).json(errorList);
        } else {
            req.body = validatorResult.value;
            next();
        }
    };
};
module.exports = {
    validateBody,
};
