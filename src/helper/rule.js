const user = function(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        active: user.active,
        avatar: user.avatar,
        scores: user.scores,
        surplus: user.surplus,
        status: user.status,
        socket: user.socket
    };
};

const mentor = function(mentor) {
    if (mentor)
        return {
            specialized: mentor.specialized.name,
            cost: mentor.cost,
            description: mentor.description,
            semester: mentor.semester.name,
            achievements: mentor.achievements,
            skype: mentor.skype
        };
    else return null;
};

module.exports = { user, mentor };
