export function createSetReducers(...fields) {
    const output = {};
    fields.forEach((field) => {
        output[`set${capitalize(field)}`] = (state, { payload }) => {
            state[field] = payload;
        };
    });
    return output;
}

export function addActionCallbacks(reducer) {
    return {
        reducer,
        prepare: (payload, success, error) => ({
            payload,
            meta: {
                success,
                error,
            },
        }),
    };
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
