const actions = ['delete', 'deactivate', 'reactivate'] as const;
export type Action = (typeof actions)[number];

export function isAction(action: string): action is Action {
    return actions.includes(action as Action);
}

export function getAction(name: string | null) {
    switch (name) {
        case 'delete': {
            return {
                actionName: 'Delete application',
                phraseToMatch: 'delete',
            };
        }
        case 'deactivate': {
            return {
                actionName: 'Deactivate application',
                phraseToMatch: 'deactivate',
            };
        }
        case 'reactivate': {
            return {
                actionName: 'Reactivate application',
                phraseToMatch: 'reactivate',
            };
        }
    }
    return {
        actionName: 'Dangerous action',
        phraseToMatch: 'dangerous-action',
    };
}
