async function GetMemberOrgs(req, res, next) {
    const user = req.user;

    const result = await user.getMemberOrgs({
        attributes: { exclude: ['updatedAt'] },
    });

    console.log(result);

    return res.status(200).send(result);
}

module.exports = GetMemberOrgs;
