const bonusIssuedEvent = {
    name: "bonus_issued",
    data: {
        result: [
            {
                bonus_id: 11971,
                name: "Cash bonus",
                type: "casino",
                amount: 4,
                status: "new",
                wager: 50,
                currency: "CAD",
                rollover: 200,
                exclusive: {},
                sticky: false,
                expire: "2023-10-08 06:56:30",
                created: "2023-09-28 06:56:30",
                source: "shop"
            },
            {
                bonus_id: 15299,
                name: "Deadwood",
                type: "freespin",
                amount: 10,
                status: "new",
                game: {
                    game_id: 15792,
                    name: "Deadwood",
                    alias: "64476-deadwood",
                    ratio: "16:9",
                    images: {
                        small: "https://altacdn.com/wl/img/games/64476-deadwood.jpg",
                        mid: null,
                        big: null,
                        promo: "https://altacdn.com/wl/img/games/64476-deadwood.jpg"
                    },
                    idx: 29,
                    rtp: null,
                    brand: {
                        brand_id: 938,
                        name: "Nolimit city",
                        logo: "https://altacdn.com/wl/img/brands/nolimit-city_logo.svg"
                    },
                    tournament: false,
                    categories: [],
                    collections: [],
                    demo: true
                },
                wager: 50,
                currency: "CAD",
                exclusive: {},
                sticky: false,
                expire: "2023-12-14 16:41:06",
                created: "2023-12-04 16:41:06",
                source: "shop"
            }
        ]
    }
};

module.exports = { bonusIssuedEvent };