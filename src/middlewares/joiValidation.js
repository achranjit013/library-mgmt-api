import Joi from "joi";

const SHORTSTR = Joi.string().max(100);
const SHORTSTRREQ = Joi.string().max(100).required();
const LONGSTR = Joi.string().max(500);
const LONGSTRREQ = Joi.string().max(5000).required();
const SHORTNUM = Joi.number();
const SHORTNUMREQ = Joi.number().required();

const validationProcessor = ({ schemaObj, req, res, next }) => {
  try {
    const schema = Joi.object(schemaObj);

    const { error } = schema.validate(req.body);

    if (error) {
      return res.json({
        status: "error",
        message: error.message,
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export const newUserValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      phone: Joi.string().allow("", null),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().required(),
    });

    const { value, error } = schema.validate(req.body);
    if (error) {
      return res.json({
        status: "error",
        message: error.message,
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export const loginValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().required(),
    });

    const { value, error } = schema.validate(req.body);
    if (error) {
      return res.json({
        status: "error",
        message: error.message,
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

// books validation
export const newBookValidation = (req, res, next) => {
  const schemaObj = {
    thumbnail: LONGSTRREQ,
    name: SHORTSTRREQ,
    author: SHORTSTRREQ,
    publishYear: SHORTNUMREQ,
    isbn: SHORTSTRREQ,
    description: LONGSTRREQ,
  };

  validationProcessor({ schemaObj, req, res, next });
};

// books validation
export const updateBookValidation = (req, res, next) => {
  const schemaObj = {
    status: SHORTSTRREQ,
    _id: SHORTSTRREQ,
    thumbnail: LONGSTRREQ,
    name: SHORTSTRREQ,
    author: SHORTSTRREQ,
    publishYear: SHORTNUMREQ,
    description: LONGSTRREQ,
  };

  validationProcessor({ schemaObj, req, res, next });
};
