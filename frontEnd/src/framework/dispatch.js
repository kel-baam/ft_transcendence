import { handleRouting } from "./routing.js";

export function dispatch(action)
{
    switch (action.type)
    {
        case 'NAVIGATE':
            const path = `/${action.payload}`;
            handleRouting(path.slice(2));
            break;
        default:
            console.log('Unknown action type:', action.type);
    }
}

export default dispatch;
