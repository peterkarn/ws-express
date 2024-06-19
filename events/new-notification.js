const newNotificationEvent = {
    name: 'new_notification',
    data: {
        "notification_id": 1742,
        "created": "Mon Mar 04 2024 15:03:56 GMT+0000 (Coordinated Universal Time)",
        "reading": false,
        "notification_type": "system",
        "delivery_types": [
            1,
            2,
            3
        ],
        "translations": {
            "header_translation": "111 Deposit Confirmed",
            "content_translation": " Your deposit of 1000 EUR has been successfully processed",
            "popup_header_translation": "Deposit Confirmed",
            "popup_content_translation": "Your deposit of 1000 EUR has been successfully processed",
            "toast_content_translation": "Deposit has been processed.",
        }
    }
};

module.exports = { newNotificationEvent };