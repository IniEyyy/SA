import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function HasMinWords(min: number, opts?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: opts,
      constraints: [min],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;
          const words = value
            .trim()
            .split(" ")
            .filter((w) => w.length > 0);
          return words.length >= (args.constraints[0] as number);
        },
        defaultMessage(args: ValidationArguments) {
          return `must contain at least ${args.constraints[0]} words`;
        },
      },
    });
}
