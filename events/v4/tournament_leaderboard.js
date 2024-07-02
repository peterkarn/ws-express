const tournamentLeaderboardEvent = {
    name: 'tournament_leaderboard',
    data: {
        leaderboard: [
            {
                place: 0,
                prize: [
                    {
                        type: {
                            freespin: 0,
                            loyalty: 0,
                            casino: 0
                        },
                        amount: 0,
                        game_id: 0,
                        wager: 0,
                        currency_amount: [
                            {
                                currency: "string",
                                amount: 0
                            }
                        ],
                        game_exclusive: true,
                        brand_exclusive: true
                    }
                ],
                player: {
                    participant_id: 0,
                    login: "string",
                    currency: "string",
                    rounds: 0,
                    total_rounds: 0,
                    bet: 0,
                    win: 0,
                    rating: 0,
                    current: true
                }
            }
        ],
        amount: 10,
        currency_amount: [],
        idx: 1,
        type: "loyalty",
        wager: 0,
        name: "For QA (coins)",
        reason: "Tournament started",
        status: "running",
        tournament_id: 42839,
    }
};

module.exports = { tournamentLeaderboardEvent };