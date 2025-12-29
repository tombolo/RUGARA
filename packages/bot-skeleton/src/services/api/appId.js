import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getSocketURL, website_name } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import APIMiddleware from './api-middleware';

/**
 * IMPORTANT:
 * - Token MUST be created under app_id = 70344
 * - Do NOT use this in public production frontend
 */
const APP_ID = 70344;
const HARDCODED_TOKEN = 'xq6qr5hO0TgHVLc';

export const generateDerivApiInstance = () => {
    const socket_url = `wss://${getSocketURL()}/websockets/v3?app_id=${APP_ID}&l=${getLanguage()}&brand=${website_name.toLowerCase()}`;

    const deriv_socket = new WebSocket(socket_url);

    const deriv_api = new DerivAPIBasic({
        connection: deriv_socket,
        middleware: new APIMiddleware({}),
    });

    return deriv_api;
};

/**
 * OAuth / login state is NOT used
 */
export const getLoginId = () => null;

/**
 * Always return the hardcoded token
 */
export const getToken = () => ({
    token: HARDCODED_TOKEN,
    account_id: undefined,
});
