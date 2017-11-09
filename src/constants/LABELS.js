const LABELS = {
    "ACCEPTED": "GENERAL",
    "ACCOUNT_BILLING_ADDRESS_DESC": "ACCOUNT",
    "ACCOUNT_BILLING_ADDRESS_HEADER": "ACCOUNT",
    "ACCOUNT_DEFAULT_LISTING_LOCATION_DESC": "ACCOUNT",
    "ACCOUNT_DEFAULT_LISTING_LOCATION_HEADER": "ACCOUNT",
    "ACCOUNT_LANGUAGE_DETAILS_DESC": "ACCOUNT_MENU",
    "ACCOUNT_LANGUAGE_DETAILS_HEADER": "ACCOUNT_MENU",
    "ACCOUNT_MENU_BILLING_ADDRESS": "ACCOUNT_MENU",
    "ACCOUNT_MENU_DELETE_ACCOUNT": "ACCOUNT_MENU",
    "ACCOUNT_MENU_LANGUAGE": "ACCOUNT_MENU",
    "ACCOUNT_MENU_LISTING": "ACCOUNT_MENU",
    "ACCOUNT_MENU_NOTIFICATIONS": "ACCOUNT_MENU",
    "ACCOUNT_MENU_PROFILE": "ACCOUNT_MENU",
    "ACCOUNT_NOTIFICATIONS_DESC": "ACCOUNT",
    "ACCOUNT_NOTIFICATIONS_HEADER": "ACCOUNT",
    "ACCOUNT_SETTINGS": "ACCOUNT",
    "ACCOUNT_USER_DETAILS_DESC": "ACCOUNT",
    "ACCOUNT_USER_DETAILS_HEADER": "ACCOUNT",
    "ACTIVATE": "GENERAL_LABELS",
    "ACTIVE_LISTINGS": "PROFILE",
    "ACTIVE_LISTINGS_DESC": "PROFILE",
    "ADD_FILE_ACTION_DESC": "GENERAL",
    "ADD_FILE_ACTION_HEADER": "GENERAL",
    "ADD_PICTURE_ACTION_DESC": "PHOTOS",
    "ADD_PICTURE_ACTION_HEADER": "PHOTOS",
    "ALL_CATEGORIES": "GENERAL_LABELS",
    "ALREADY_APPLIED_REQUEST_ACTION_DESC": "REQUEST",
    "ALREADY_APPLIED_REQUEST_ACTION_HEADER": "REQUEST",
    "ALREADY_HAVE_AN_ACCOUNT": "SIGNUP_PAGE",
    "ARE_YOUR_SURE": "GENERAL",
    "ARE_YOU_SURE": "GENERAL",
    "BACK": "GENERAL_LABELS",
    "BILLING_ADDRESS": "BOOKING",
    "BILLING_ADDRESS_USE_LISTING_LOCATION": "BOOKING",
    "BILLING_TAX_NUMBER": "ORDER",
    "BOOKING_CONFIRM": "BOOKING",
    "BOOKING_SUCCESS_DESC": "BOOKING_SUCCESS_POPUP",
    "BOOKING_SUCCESS_HEADER": "BOOKING_SUCCESS_POPUP",
    "CANCEL": "GENERAL_LABELS",
    "CANCEL_LISTING_ACTION_HEADER": "LISTING",
    "CANCEL_LISTING_DESC": "LISTING",
    "CANCEL_LISTING_SUCCESS_DESC": "LISTING_CANCELLED_SUCCESS_POPUP",
    "CANCEL_LISTING_SUCCESS_HEADER": "LISTING_CANCELLED_SUCCESS_POPUP",
    "CANCEL_REQUEST_ACTION_DESC": "REQUEST",
    "CANCEL_REQUEST_ACTION_HEADER": "REQUEST",
    "CANCEL_REQUEST_ACTION_SUCCESS": "REQUEST",
    "CATEGORY": "GENERAL_LABELS",
    "CHANGE_PASSWORD": "ACCOUNT",
    "CHANGE_PASSWORD_SUCCESS": "ACCOUNT",
    "CHANGE_PROFILE_PICTURE": "PROFILE",
    "CHAT": "3_GENERAL",
    "CHAT_MESSAGE_SUBMIT": "CHAT",
    "CHAT_PAGE_DESC": "CHAT_PAGE",
    "CHAT_PAGE_HEADER": "CHAT_PAGE",
    "CLOSE_ORDER": "BOOKING",
    "CLOSE_ORDER_DESC": "BOOKING",
    "COMMENTS": "3_GENERAL",
    "COMMENTS_DESC": "3_GENERAL",
    "CONFIRM": "GENERAL",
    "CONFIRM_BEFORE_POSTING": "NEW_LISTING",
    "CONFIRM_BOOKING": "BOOKING",
    "CONFIRM_BOOKING_DESC": "BOOKING",
    "CONFIRM_BOOKING_HEADER": "BOOKING",
    "CONTINUE": "GENERAL_LABELS",
    "DELETE_YOUR_ACCOUNT_ACTION": "ACCOUNT",
    "DELETE_YOUR_ACCOUNT_DESC": "ACCOUNT",
    "DELETE_YOUR_ACCOUNT_HEADER": "ACCOUNT",
    "DESCRIBE_YOUR_LISTING": "GENERAL",
    "DETERMINE_PRICING_MODEL": "GENERAL",
    "DOCUMENT_UPLOADED": "GENERAL",
    "EDIT": "GENERAL_LABELS",
    "EDIT_PROFILE": "PROFILE",
    "EMAIL": "SIGNUP_PAGE",
    "EMAIL_ADDRESS": "GENERAL_LABELS",
    "EMAIL_EXISTS": "GENERAL",
    "EMAIL_NOTIFICATIONS": "ACCOUNT",
    "EMAIL_NOT_FOUND": "ERRORS",
    "EMAIL_NOT_VERIFIED_DESC": "EMAIL_VERIFICATION",
    "EMAIL_NOT_VERIFIED_HEADER": "EMAIL_VERIFICATION",
    "EMAIL_VERIFIED": "GENERAL",
    "EMAIL_WRONGLY_FORMATTED": "ERRORS",
    "EMAIL_LISTING-CANCELLED": "EMAILS",
    "EMAIL_MESSAGE-RECEIVED": "EMAILS",
    "EMAIL_NEW-ORDER": "EMAILS",
    "EMAIL_NEW-REQUEST-RECEIVED": "EMAILS",
    "EMAIL_NEW-REQUEST-SENT": "EMAILS",
    "EMAIL_NEW-TASK": "EMAILS",
    "EMAIL_ORDER-CLOSED": "EMAILS",
    "EMAIL_ORDER-COMPLETED": "EMAILS",
    "EMAIL_ORDER-MARKED-AS-DONE": "EMAILS",
    "EMAIL_PASSWORD-RESET": "EMAILS",
    "EMAIL_REQUEST-ACCEPTED": "EMAILS",
    "EMAIL_REQUEST-CANCELLED": "EMAILS",
    "EMAIL_REQUEST-CLOSED": "EMAILS",
    "EMAIL_REQUEST-COMPLETED": "EMAILS",
    "EMAIL_REQUEST-DECLINED": "EMAILS",
    "EMAIL_REQUEST-MARKED-AS-DONE": "EMAILS",
    "EMAIL_REVIEW-LEFT": "EMAILS",
    "EMAIL_TASK-MARKED-SPAM": "EMAILS",
    "EMAIL_TASK-REQUEST-CANCELLED": "EMAILS",
    "EMAIL_USER-BLOCKED": "EMAILS",
    "EMAIL_WELCOME": "EMAILS",
    "ERROR_MESSAGE_TOO_SHORT": "ERRORS",
    "FIND_OR_POST_TASKS": "SIGNUP_PAGE",
    "FIND_TASKS": "SIGNUP_PAGE",
    "FIRST_NAME": "PROFILE",
    "GO_TO_LISTING": "BROWSE",
    "HEADER_ADD_LISTING": "GENERAL",
    "HEADER_BUTTON_FOR_BUYERS": "HOMEPAGE",
    "HEADER_BUTTON_FOR_SELLERS": "HOMEPAGE",
    "HEADER_DASHBOARD": "HEADER",
    "HEADER_LISTINGS": "HEADER",
    "HEADER_USER_DOCUMENTS": "GENERAL",
    "HOMEPAGE_FOOTER_HOW_IT_WORKS": "HOMEPAGE_FOOTER",
    "HOMEPAGE_FOOTER_FAQ": "HOMEPAGE_FOOTER",
    "HOMEPAGE_FOOTER_BLOG": "HOMEPAGE_FOOTER",
    "HOMEPAGE_FOOTER_CATEGORIES": "HOMEPAGE_FOOTER",
    "HOMEPAGE_FOOTER_CONTACT": "HOMEPAGE_FOOTER",
    "HOMEPAGE_FOOTER_IMPRINT": "HOMEPAGE_FOOTER",
    "HOMEPAGE_FOOTER_PRIVACY": "HOMEPAGE_FOOTER",
    "HOMEPAGE_FOOTER_SOCIAL_MEDIA": "HOMEPAGE_FOOTER",
    "HOMEPAGE_FOOTER_TERMS": "HOMEPAGE_FOOTER",
    "HOW_IT_WORKS_BUYERS_STEP_1_DESC": "HOW_IT_WORKS",
    "HOW_IT_WORKS_BUYERS_STEP_1_HEADER": "HOW_IT_WORKS",
    "HOW_IT_WORKS_BUYERS_STEP_1_ICON": "HOW_IT_WORKS",
    "HOW_IT_WORKS_BUYERS_STEP_2_DESC": "HOW_IT_WORKS",
    "HOW_IT_WORKS_BUYERS_STEP_2_HEADER": "HOW_IT_WORKS",
    "HOW_IT_WORKS_BUYERS_STEP_2_ICON": "HOW_IT_WORKS",
    "HOW_IT_WORKS_BUYERS_STEP_3_DESC": "HOW_IT_WORKS",
    "HOW_IT_WORKS_BUYERS_STEP_3_HEADER": "HOW_IT_WORKS",
    "HOW_IT_WORKS_BUYERS_STEP_3_ICON": "HOW_IT_WORKS",
    "HOW_IT_WORKS_SELLERS_STEP_1_DESC": "HOW_IT_WORKS",
    "HOW_IT_WORKS_SELLERS_STEP_1_HEADER": "HOW_IT_WORKS",
    "HOW_IT_WORKS_SELLERS_STEP_1_ICON": "HOW_IT_WORKS",
    "HOW_IT_WORKS_SELLERS_STEP_2_DESC": "HOW_IT_WORKS",
    "HOW_IT_WORKS_SELLERS_STEP_2_HEADER": "HOW_IT_WORKS",
    "HOW_IT_WORKS_SELLERS_STEP_2_ICON": "HOW_IT_WORKS",
    "HOW_IT_WORKS_SELLERS_STEP_3_DESC": "HOW_IT_WORKS",
    "HOW_IT_WORKS_SELLERS_STEP_3_HEADER": "HOW_IT_WORKS",
    "HOW_IT_WORKS_SELLERS_STEP_3_ICON": "HOW_IT_WORKS",
    "IMPRINT": "2_GENERAL",
    "IN_THIS_CHAT": "CHAT",
    "IS_NOT_CORRECT": "GENERAL",
    "IS_NOT_SUPPORTED": "POSTAL_CODE_ERROR",
    "IS_REQUIRED": "GENERAL_LABELS",
    "LAST_NAME": "PROFILE",
    "LEAVE_REVIEW": "REVIEW",
    "LIMIT_IMAGE_SIZE": "ERRORS",
    "LIST": "BROWSE",
    "LISTINGS_POSTED": "DASHBOARD",
    "LISTINGS_PROMO_DESC": "LISTINGS",
    "LISTINGS_PROMO_HEADER": "LISTINGS",
    "LISTING_ADDRESS_ADDITION": "LISTING",
    "LISTING_CITY": "LISTING",
    "LISTING_COMMENTS_DESC": "GENERAL",
    "LISTING_COMMENTS_HEADER": "GENERAL",
    "LISTING_COMMENTS_SUBMIT": "GENERAL",
    "LISTING_COUNTRY": "LISTING",
    "LISTING_DATE": "LISTING",
    "LISTING_DESCRIPTION": "LISTING",
    "LISTING_DESCRIPTION_TOO_SHORT": "ERRORS",
    "LISTING_DURATION": "LISTING",
    "LISTING_FILTER_GEO": "BROWSE",
    "LISTING_IMAGES": "LISTING",
    "LISTING_INFO": "LISTING",
    "LISTING_LOCATION": "LISTING",
    "LISTING_POSTAL_CODE": "LISTING",
    "LISTING_STREET": "LISTING",
    "LISTING_TITLE": "LISTING",
    "LISTING_TITLE_TOO_SHORT": "ERRORS",
    "LOCATION_ADDRESS_ADDITION": "GENERAL",
    "LOCATION_CITY": "GENERAL",
    "LOCATION_COUNTRY": "GENERAL_LABELS",
    "LOCATION_POSTAL_CODE": "GENERAL_LABELS",
    "LOCATION_STREET": "GENERAL_LABELS",
    "LOCATION_STREET_NUMBER": "GENERAL_LABELS",
    "LOGIN": "SIGNUP_PAGE",
    "LOGIN_SUCCESSFUL": "LOGIN",
    "LOGIN_TO_CONTINUE": "SIGNUP_PAGE",
    "LOGOUT": "GENERAL",
    "MAP": "BROWSE",
    "MARKED_DONE": "ORDER",
    "MARK_DONE": "REQUEST",
    "MESSAGE": "GENERAL_LABELS",
    "MORE": "GENERAL_LABELS",
    "NEW_LISTING_ADDRESS_DESC": "NEW_LISTING",
    "NEW_LISTING_ADDRESS_HEADER": "NEW_LISTING",
    "NEW_LISTING_BASICS_DESC": "NEW_LISTING",
    "NEW_LISTING_BASICS_HEADER": "NEW_LISTING",
    "NEW_LISTING_CATEGORY_DESC": "NEW_LISTING",
    "NEW_LISTING_CATEGORY_HEADER": "NEW_LISTING",
    "NEW_LISTING_CONFIRM_AND_POST": "NEW_LISTING",
    "NEW_LISTING_DATE_DESC": "NEW_LISTING",
    "NEW_LISTING_DATE_HEADER": "NEW_LISTING",
    "NEW_LISTING_DURATION_DESC": "NEW_LISTING",
    "NEW_LISTING_DURATION_HEADER": "NEW_LISTING",
    "NEW_LISTING_FINAL_REVIEW_DESC": "NEW_LISTING",
    "NEW_LISTING_FINAL_REVIEW_HEADER": "NEW_LISTING",
    "NEW_LISTING_PHOTO_DESC": "NEW_LISTING",
    "NEW_LISTING_PHOTO_HEADER": "NEW_LISTING",
    "NEW_LISTING_PRICING_DESC": "NEW_LISTING",
    "NEW_LISTING_PRICING_HEADER": "NEW_LISTING",
    "NEW_LISTING_SUCCESS_DESC": "NEW_LISTING_SUCCESS_POPUP",
    "NEW_LISTING_SUCCESS_HEADER": "NEW_LISTING_SUCCESS_POPUP",
    "NEW_PASSWORD": "SIGNUP_PAGE",
    "NO_ACTIVE_LISTINGS": "LISTING",
    "NO_BOOKINGS": "DASHBOARD",
    "NO_LISTINGS": "LISTINGS",
    "NO_LISTING_IMAGES": "LISTING",
    "NO_OPEN_LISTINGS": "DASHBOARD",
    "NO_ORDERS_COMPLETED": "DASHBOARD",
    "NO_ORDERS_IN_PROGRESS": "DASHBOARD",
    "NO_REQUESTS": "REQUEST",
    "NO_REVIEWS": "REVIEW",
    "OPTIONAL": "GENERAL",
    "ORDERS_COMPLETED": "DASHBOARD",
    "ORDERS_IN_PROGRESS": "DASHBOARD",
    "ORDER_AUTOSETTLEMENT_CANCELED": "GENERAL",
    "ORDER_AUTOSETTLEMENT_ON": "BOOKING",
    "ORDER_CLOSED": "BOOKING",
    "ORDER_CLOSED_SUCCESS": "BOOKING",
    "ORDER_CLOSED_SUCCESS_DESC": "ORDER_SUCCESS_POPUP",
    "ORDER_CLOSED_SUCCESS_HEADER": "ORDER_SUCCESS_POPUP",
    "ORDER_CREATE": "BOOKING",
    "ORDER_IN_PROGRESS": "ORDER",
    "ORDER_MARKED_DONE": "ORDER",
    "ORDER_REVIEW_RATE_DESC": "REVIEW",
    "ORDER_REVIEW_RATE_HEADER": "REVIEW",
    "ORDER_REVIEW_TEXT_DESC": "REVIEW",
    "ORDER_REVIEW_TEXT_HEADER": "REVIEW",
    "ORDER_SETTLED": "ORDER",
    "ORDER_SETTLED_SUCCESS": "BOOKING",
    "PASSWORD": "GENERAL_LABELS",
    "PASSWORDS_DO_NOT_MATCH": "ERRORS",
    "PHONE_BIO": "GENERAL_LABELS",
    "PHONE_NO": "GENERAL",
    "POSTAL_CODE": "POSTAL_CODE_ERROR",
    "POST_NEW_LISTING": "GENERAL",
    "POST_TASKS": "SIGNUP_PAGE",
    "PRICE": "GENERAL",
    "PRICE_TYPE": "LISTING",
    "PRICING": "GENERAL",
    "PRICING_MODEL_HOURLY": "PRICING",
    "PRICING_MODEL_REQUEST_QUOTE": "PRICING",
    "PRICING_MODEL_TOTAL": "PRICING",
    "PRIVACY_POLICY": "2_GENERAL",
    "PROFILE": "GENERAL",
    "PROFILE_BIO": "GENERAL",
    "PROFILE_BIO_DESC": "PROFILE",
    "PROFILE_PREFERENCES_DESC": "PROFILE",
    "PROFILE_PREFERENCES_HEADER": "PROFILE",
    "PROFILE_PREFERENCES_NONE": "PROFILE",
    "PROFILE_REFERENCE_UPLOADED": "PROFILE",
    "PROFILE_REVIEWS_DESC": "PROFILE",
    "PROFILE_REVIEWS_HEADER": "PROFILE",
    "QUICK_CHOICE": "GENERAL_LABELS",
    "REGISTER": "SIGNUP_PAGE",
    "REGISTER_TO_APPLY": "REQUEST",
    "REMOVE": "GENERAL_LABELS",
    "REPEAT_PASSWORD": "SIGNUP_PAGE",
    "REPLY": "REQUEST",
    "REQUESTS": "REQUESTS",
    "REQUEST_ACTION_MARK_DONE": "REQUEST",
    "REQUEST_ACTION_MARK_DONE_DESC": "REQUEST",
    "REQUEST_ACTION_MARK_DONE_SUCCESS": "REQUEST",
    "REQUEST_ALREADY_SENT": "REQUEST",
    "REQUEST_BOOKED": "REQUEST",
    "REQUEST_CLOSED": "REQUEST",
    "REQUEST_MARKED_AS_DONE": "REQUEST",
    "REQUEST_MESSAGE_CONFIRM": "REQUEST",
    "REQUEST_MESSAGE_DESC": "REQUEST",
    "REQUEST_MESSAGE_HEADER": "REQUEST",
    "REQUEST_RECEIVED": "REQUEST",
    "REQUEST_REVIEWED": "REQUEST",
    "REQUEST_REVIEW_RATE_DESC": "REVIEW",
    "REQUEST_REVIEW_RATE_HEADER": "REVIEW",
    "REQUEST_REVIEW_TEXT_DESC": "REVIEW",
    "REQUEST_REVIEW_TEXT_HEADER": "REVIEW",
    "REQUEST_SETLLED": "REQUEST",
    "REQUEST_STATUS_ACCEPTED": "REQUEST_STATUS",
    "REQUEST_STATUS_CANCELED": "REQUEST_STATUS",
    "REQUEST_STATUS_CLOSED": "REQUEST_STATUS",
    "REQUEST_STATUS_DECLINED": "REQUEST_STATUS",
    "REQUEST_STATUS_MARKED_DONE": "REQUEST_STATUS",
    "REQUEST_STATUS_PENDING": "REQUEST_STATUS",
    "REQUEST_STATUS_SETTLED": "REQUEST_STATUS",
    "REQUEST_SUBMITTED_DESC": "REQUEST",
    "REQUEST_SUBMITTED_HEADER": "REQUEST",
    "RESEND_VERIFICATION_EMAIL": "EMAIL_VERIFICATION",
    "RESET_PASSWORD": "ACCOUNT",
    "REVIEW_SUBMIT": "REVIEW",
    "REVIEWED": "GENERAL",
    "REVIEW_SUBMITTED_SUCCESS_DESC": "REVIEW_SUBMITTED_SUCESS_POPUP",
    "REVIEW_SUBMITTED_SUCCESS_HEADER": "REVIEW_SUBMITTED_SUCESS_POPUP",
    "REVOKE_AUTOSETTLEMENT": "GENERAL",
    "REVOKE_AUTOSETTLEMENT_DESC": "BOOKING",
    "REVOKE_AUTOSETTLEMENT_SUCCESS": "BOOKING",
    "SAVE": "GENERAL_LABELS",
    "SEND_REQUEST": "REQUEST",
    "SENT_REQUESTS_ACCEPTED": "DASHBOARD",
    "SENT_REQUESTS_COMPLETED": "DASHBOARD",
    "SENT_REQUESTS_PENDING": "DASHBOARD",
    "SENT_REQUESTS_SETTLED": "DASHBOARD",
    "SETTLE_ORDER": "ORDER",
    "SETTLE_ORDER_DESC": "GENERAL",
    "SIGNUP": "GENERAL_LABELS",
    "SIGNUP_PAGE_DESC": "SIGNUP_PAGE",
    "SIGNUP_PAGE_TITLE": "SIGNUP_PAGE",
    "START_PAGE_AUTOCOMPLETE_LABEL": "HOMEPAGE",
    "START_PAGE_AUTOCOMPLETE_LABEL_SELLERS": "HOMEPAGE",
    "START_PAGE_DESC": "HOMEPAGE",
    "START_PAGE_DESC_SELLERS": "HOMEPAGE",
    "START_PAGE_HEADER": "HOMEPAGE",
    "START_PAGE_HEADER_SELLERS": "HOMEPAGE",
    "START_PAGE_LISTING_CATEGORIES_DESC": "START_PAGE",
    "START_PAGE_LISTING_CATEGORIES_HEADER": "START_PAGE",
    "STEP": "GENERAL_LABELS",
    "SUCCESS": "GENERAL_LABELS",
    "TERMS_AND_PRIVACY_AGREEMENT_STATEMENT": "SIGNUP_PAGE",
    "TERMS_OF_SERVICE": "2_GENERAL",
    "UNSUPPORTED_IMAGE_FORMAT": "ERRORS",
    "USER_DOCUMENTS_DESC": "GENERAL",
    "USER_DOCUMENTS_HEADER": "GENERAL",
    "USER_PREFERENCES": "ACCOUNT_MENU",
    "USER_PREFERENCE_DESC": "GENERAL",
    "USER_PREFERENCE_HEADER": "GENERAL",
    "USER_VERIFICATIONS": "ACCOUNT_MENU",
    "USER_VERIFICATION_DESC": "USER_VERIFICATION",
    "USER_VERIFICATION_FACEBOOK_LABEL": "USER_VERIFICATION",
    "USER_VERIFICATION_FACEBOOK_TITLE": "USER_VERIFICATION",
    "USER_VERIFICATION_HEADER": "USER_VERIFICATION",
    "USER_VERIFICATION_PERSONAL_ID_BACKSITE_TITLE": "GENERAL",
    "USER_VERIFICATION_PERSONAL_ID_TITLE": "USER_VERIFICATION",
    "VERIFICATION_EMAIL_SENT": "EMAIL_VERIFICATION",
    "WEBSITE": "PROFILE",
    "WRONG_PASSWORD": "ERRORS",
    "YOUR_BOOKINGS": "DASHBOARD",
    "YOUR_LISTING_HAS_BEEN_SUBMITTED": "NEW_LISTING",
    "YOUR_REQUESTS": "DASHBOARD",
    "YOU_MUST_LEAVE_REVIEW": "REVIEW",
    "ZIP_CODE": "ZIP_CODE"
  };

export default LABELS;
