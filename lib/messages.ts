export const MESSAGES = {
    // Common
    SUCCESS: 'Success',
    ERROR: 'Error',
    WARNING: 'Warning',
    INFO: 'Information',
    LOADING: 'Processing...',
    UNKNOWN_ERROR: 'An unknown error occurred. Please try again later.',

    // Orders
    ORDER: {
        CREATED_SUCCESS: 'Order created successfully. Initiating payment...',
        CREATED_ERROR: 'Failed to create order.',
        STATUS_UPDATED: 'Order status has been updated successfully.',
        STATUS_UPDATE_ERROR: 'Failed to update order status.',
        ACCEPTED_SUCCESS: 'The order has been accepted.',
        ACCEPTED_ERROR: 'Failed to accept order.',
        CANCELLED_SUCCESS: 'The order has been cancelled.',
        CANCELLED_ERROR: 'Failed to cancel order.',
        REJECTED_SUCCESS: 'The order has been rejected.',
        REJECTED_ERROR: 'Failed to reject order.',
        EMPTY_RESPONSE: 'Empty response received from the server.',
        PAYMENT_LOADING: 'Processing payment from your wallet...',
        PAYMENT_ERROR: 'An error occurred while processing your payment.',
    },

    // Products
    PRODUCT: {
        CREATED_SUCCESS: 'Product created successfully.',
        CREATED_ERROR: 'Failed to create product.',
        UPDATED_SUCCESS: 'Product updated successfully.',
        UPDATED_ERROR: 'Failed to update product.',
        DELETED_SUCCESS: 'Product deleted successfully.',
        DELETED_ERROR: 'Failed to delete product.',
    },

    // Users/Profile
    USER: {
        LOGIN_SUCCESS: 'Logged in successfully.',
        LOGIN_ERROR: 'Failed to login.',
        REGISTER_SUCCESS: 'Registered successfully.',
        REGISTER_ERROR: 'Failed to register.',
        PROFILE_UPDATED: 'Profile updated successfully.',
        PROFILE_UPDATE_ERROR: 'Failed to update profile.',
    }
};
