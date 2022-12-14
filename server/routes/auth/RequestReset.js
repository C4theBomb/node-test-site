const { CourierClient } = require('@trycourier/courier');

const { User } = require('../../db/models/index');
const config = require('../../config/error.json');

async function RequestReset(req, res, next) {
    try {
        // Make sure that the request contains an email
        const email = req.query.email;
        if (!email) {
            return res.status(400).send(config.errorIncomplete);
        }

        // Confirm that a user exists with that email
        const result = await User.findOne({ where: { email: email } });
        if (!result) {
            return res.status(404).send(config.errorNotFound);
        }

        // Create resetRequest instance and send email containing reset information
        const courier = CourierClient({
            authorizationToken: process.env.COURIER_AUTH_TOKEN,
        });

        const resetRequest = await result.createResetRequest();

        await courier.send({
            message: {
                to: { email: result.email },
                template: 'FSTM4WF60KM570KS9DBQRH0T41GJ',
                data: {
                    email: result.email,
                    resetRequest: resetRequest.id,
                },
            },
        });

        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res.status(500).send(config.errorGeneric);
    }
}

module.exports = RequestReset;
