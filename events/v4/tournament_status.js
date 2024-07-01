const tournamentStatusRunningEvent = {
    name: 'tournament_status',
    data: {
        status: "running",
        tournament_id: 1243,
        name: "For QA 2",
        reason: "Tournament started",
        leaderboard: [
            {
                place: 1,
                prize: [
                    {
                        type: "freespin",
                        wager: 0,
                        amount: 10,
                        currency_amount: [],
                        idx: 1
                    }
                ],
                player: {},
            },
        ]
    }
};

const tournamentStatusCompletedEvent = {
    name: 'tournament_status',
    data: {
        status: "complete",
        tournament_id: 1243,
        name: "For QA 2",
        reason: "",
        leaderboard: [
            {
                place: 1,
                prize: [
                    {
                        type: "freespin",
                        wager: 0,
                        amount: 10,
                        currency_amount: [],
                        idx: 1
                    }
                ],
                player: {
                    participant_id: 38188,
                    login: "TEST*****",
                    currency: "EUR",
                    rounds: 2,
                    total_rounds: 2,
                    bet: 12,
                    win: 0,
                    rating: 2,
                    current: true
                }
            }
        ]
    }
};

const tournamentStatusCancelledEvent = {
    name: 'tournament_status',
    data: {
        status: "canceled",
        tournament_id: 1242,
        name: "For QA",
        reason: "The tournament did not take place and was canceled"
    }
}

module.exports = { tournamentStatusRunningEvent, tournamentStatusCompletedEvent, tournamentStatusCancelledEvent };