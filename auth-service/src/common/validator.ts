import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsLettersOnly(opts?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: opts,
      validator: {
        validate(value: any) {
          if (typeof value !== "string" || value.length === 0) return false;
          for (const ch of value) {
            const ok = (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
            if (!ok) return false;
          }
          return true;
        },
        defaultMessage() {
          return "must contain letters only";
        },
      },
    });
}

export function HasNoSpaces(opts?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: opts,
      validator: {
        validate(value: any) {
          return typeof value === "string" && !value.includes(" ");
        },
        defaultMessage() {
          return "must not contain spaces";
        },
      },
    });
}

export function HasMinDigits(min: number, opts?: ValidationOptions) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: opts,
      constraints: [min],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;
          let count = 0;
          for (const ch of value) if (ch >= "0" && ch <= "9") count++;
          return count >= (args.constraints[0] as number);
        },
        defaultMessage(args: ValidationArguments) {
          return `must contain at least ${args.constraints[0]} digits`;
        },
      },
    });
}

export function HasAllowedEmailDomain(
  suffixes: string[],
  opts?: ValidationOptions
) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: opts,
      constraints: [suffixes],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;
          const list = args.constraints[0] as string[];
          const lower = value.toLowerCase();
          return list.some((s) => lower.endsWith(s));
        },
        defaultMessage(args: ValidationArguments) {
          const list = args.constraints[0] as string[];
          return `email must end with: ${list.join(", ")}`;
        },
      },
    });
}
