export const MESSAGES = {
    // Common
    SUCCESS: 'common.success',
    ERROR: 'common.error',
    WARNING: 'common.warning',
    INFO: 'common.information',
    LOADING: 'common.processing',
    UNKNOWN_ERROR: 'errors.unknown',

    // Orders
    ORDER: {
        CREATED_SUCCESS: 'orders.created.success',
        CREATED_ERROR: 'orders.created.error',
        STATUS_UPDATED: 'orders.statusUpdated.success',
        STATUS_UPDATE_ERROR: 'orders.statusUpdated.error',
        ACCEPTED_SUCCESS: 'orders.accepted.success',
        ACCEPTED_ERROR: 'orders.accepted.error',
        CANCELLED_SUCCESS: 'orders.cancelled.success',
        CANCELLED_ERROR: 'orders.cancelled.error',
        REJECTED_SUCCESS: 'orders.rejected.success',
        REJECTED_ERROR: 'orders.rejected.error',
        EMPTY_RESPONSE: 'errors.emptyResponse',
        PAYMENT_LOADING: 'orders.payment.loading',
        PAYMENT_ERROR: 'orders.payment.error',
    },

    // Products
    PRODUCT: {
        CREATED_SUCCESS: 'products.created.success',
        CREATED_ERROR: 'products.created.error',
        UPDATED_SUCCESS: 'products.updated.success',
        UPDATED_ERROR: 'products.updated.error',
        DELETED_SUCCESS: 'products.deleted.success',
        DELETED_ERROR: 'products.deleted.error',
    },

    // Users/Profile
    USER: {
        LOGIN_SUCCESS: 'auth.login.success',
        LOGIN_ERROR: 'auth.login.error',
        REGISTER_SUCCESS: 'auth.register.success',
        REGISTER_ERROR: 'auth.register.error',
        PROFILE_UPDATED: 'profile.updated.success',
        PROFILE_UPDATE_ERROR: 'profile.updated.error',
    }
};
