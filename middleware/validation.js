const validator = require('../util/validate');

// Check data to be added to the plant collection
const plantCheck = async (req, res, next) => {
    const validationRule = {
      "name": "required|string",
      "type": "required|string"
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
      "title": "required|string",
      "artist_id": "required|string|min:24|max:24",
      "media": "required|string",
      "genre": "required|string",
      "year": "required|integer",
      "tracks": "integer",
      "mins": "integer",
      "discnbr": "integer"
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
      "title": "required|string",
      "artist_id": "required|string|min:24|max:24",
      "album_id": "required|string|min:24|max:24",
      "time": "string"
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
      "title": "required|string",
      "artist_id": "required|string|min:24|max:24",
      "album_id": "required|string|min:24|max:24",
      "time": "string"
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