const { v4: uuidv4 } = require('uuid');
const { CourierClient } = require('@trycourier/courier');

const { User, ResetRequest } = require('../../models/index');

async function RequestReset(req, res, next) {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(500).send('Request missing required fields');
        }

        const result = await User.findOne({ where: { email: email } });
        if (!result) {
            return res.status(400).send('Whoops something went wrong');
        }

        const courier = CourierClient({
            authorizationToken: process.env.COURIER_AUTH_TOKEN,
        });

        const resetRequest = await ResetRequest.create({
            userID: result.userID,
        });

        await courier.send({
            message: {
                to: { email: result.email },
                template: 'FSTM4WF60KM570KS9DBQRH0T41GJ',
                data: {
                    email: result.email,
                    resetRequest: resetRequest.reqID,
                },
            },
        });

        console.log(`${resetRequest.reqID}`);

        return res.send(
            'Password reset request sent. If a user exists with this email, an email will be sent with the required information.'
        );
    } catch (e) {
        console.log(e);
        return res.status(500).send('Whoops, something went wrong.');
    }
}

module.exports = RequestReset;