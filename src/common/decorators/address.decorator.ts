import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsValidNumberPipeString(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isValidNumberPipeString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if(!value) return true;
                    const regex = /^\d+\|.+$/;
                    return typeof value === 'string' && regex.test(value);
                },
                defaultMessage() {
                    return 'The string must be in the format "number|string", e.g., "10|QUẬN HOÀN KIẾM".';
                },
            },
        });
    };
}