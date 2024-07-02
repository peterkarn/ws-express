const notificationCenterEvent = {
    name: 'notification_center',
    data: {
        account_id: 49649,
        notification_id: 1058,
        created: "2024-05-07 11:34:22",
        notification_type: "activity",
        reading: false,
        link_url: "/wallet/deposit",
        delivery_types: [
            "base",
            "popup",
            "toast"
        ],
        message: {
            url:
                {
                    header: "Deposit",
                    content: "/wallet/deposit"
                },
            base:
                {
                    header: "NL Header text",
                    content: "NL content <b>strong</b> <img src=\"https://dev.winlegends.com/_nuxt/img/activity.4115351.webp\" />",
                    excerpt: "NL excerpt text"
                },
            popup:
                {
                    header: "Popup Header text",
                    content: "Popup content <b>strong</b> <img src=\"https://dev.winlegends.com/_nuxt/img/activity.4115351.webp\" />",
                    excerpt: "Popup excerpt text"
                },
            toast:
                {
                    excerpt: "Toast excerpt"
                }
        },
        translations:
            {
                link_translation: "Deposit",
                content_translation: "NL Header text",
                header_translation: "NL content <b>strong</b> <img src=\"https://dev.winlegends.com/_nuxt/img/activity.4115351.webp\" />",
                popup_header_translation: "Popup Header text",
                popup_content_translation: "Popup content <b>strong</b> <img src=\"https://dev.winlegends.com/_nuxt/img/activity.4115351.webp\" />"
            }
    }
};

module.exports = { notificationCenterEvent };