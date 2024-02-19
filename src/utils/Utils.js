const BadRequestError = require('../common/errors/types/BadRequestError')

exports.isUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

exports.isNumber = (value) => {
    if (!value) return false
    if (String(value).replace(/[0-9.,]/g, '') === "") return true;

    return false;
}

exports.paramsValidator = (paramTypes = [], params = {}) => {
    for (const { name, type, rules } of paramTypes) {
        if (
            params[name] === undefined
            && rules.includes('isOptional')
        ) continue;

        const types = Array.isArray(type) ? type : [type];
        if (!types.includes(typeof params[name])) {
            throw new BadRequestError(
                `Invalid parameter ${name}. Expected: ${types.join(" or ")}, received: ${typeof params[name]}`
            );
        }

        if (rules && rules.length) {
            for (const rule of rules) {
                switch (rule) {
                    case 'isNotEmpty':
                        if (params[name] === "") {
                            throw new BadRequestError(`The ${name} field cannot be empty`);
                        }
                        break;

                    case 'isUUID':
                        if (!this.isUUID(params[name])) {
                            throw new BadRequestError(`Invalid ${name}`);
                        }
                        break;

                    case 'isNumber':
                        if (!this.isNumber(params[name])) {
                            throw new BadRequestError(`Invalid ${name}`);
                        }
                        break;

                    default:
                        break;
                }
            }
        }
    }
}