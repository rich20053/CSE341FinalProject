// Validation
const validator = require('../util/validate');

// Check data to be added to the plant collection
const plantCheck = async (req, res, next) => {
    const validationRule = {
      "name": "required|string",
      "scientificName": "required|string",
      "categoryId": "required|string|min:24|max:24",
      "coldestZone": "required|integer",
      "warmestZone": "required|integer",
      "colors": "required",
      "height": "required|integer",
      "space": "required|integer",
      "daysToGermination": "required|integer",
      "daysToFlower": "required|integer",
      "daysToHarvest": "required|integer"
      };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

const careCheck = async (req, res, next) => {
    const validationRule = {
      "plantId": "required|string|min:24|max:24",
      "careTypeId": "required|string|min:24|max:24",
      "description": "required|string",
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

const categoryCheck = async (req, res, next) => {
    const validationRule = {
      "name": "required|string"
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

const careTypeCheck = async (req, res, next) => {
    const validationRule = {
      "name": "required|string"
    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch( err => console.log(err))
}

module.exports = {
    plantCheck,
    careCheck,
    categoryCheck,
    careTypeCheck
};