const messageEvent = {
    name: "message",
    data: {
        title: 'Bonus release limit',
        html: '<span>Bonus release was limited<span/>',
        message: 'Bonus release was limited',
        vars: {
            release: 3,
            writeoff: 7,
            currency: 'CAD',
        },
    }
};

module.exports = { messageEvent };