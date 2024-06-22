import type { Types } from 'mongoose';
import type { FieldMessageFactory } from 'express-validator';
import type { ApiError } from './errors';
import type { Document } from '../globals';

/**
 * @param [strict=true] - When set to `true` (default), the generated regular expression will match the
 *                        input string exactly, ensuring that the entire string is matched from start to
 *                        finish. When set to `false`, the generated regular expression will allow partial
 *                        matches, meaning the input string can appear anywhere within the text being
 *                        searched. Default `true`.
 */
export const stringToCaseInsensitiveRegex = (
  string: string,
  strict: boolean = true
): RegExp => {
  if (strict) string = `^${string}$`;
  return new RegExp(string, 'i');
};

export const capitalizeString = (string: string): string => {
  if (!string) return string;
  return `${string[0]!.toUpperCase()}${string.slice(1)}`;
};

export const passValidationError = (error: ApiError): FieldMessageFactory => {
  return (_, { req }) => (req.error = error);
};

export function isDocumentRefPopulated<T extends Document>(
  field: Types.ObjectId | T
): field is T;
export function isDocumentRefPopulated<T extends Document>(
  field: (Types.ObjectId | T)[]
): field is T[];
export function isDocumentRefPopulated<T extends Document>(
  field: Types.ObjectId | T | (Types.ObjectId | T)[]
) {
  const isArr = Array.isArray(field);
  const isDocArr = isArr && !!(field[0] as T)?.toJson;
  const isDoc = !!(field as T).toJson;
  return isDoc || isDocArr;
}

export function documentRefToJson<T extends Document>(
  field: Types.ObjectId | T
): string | ReturnType<T['toJson']>;
export function documentRefToJson<T extends Document>(
  field: (Types.ObjectId | T)[]
): (string | ReturnType<T['toJson']>)[];
export function documentRefToJson<T extends Document>(
  field: Types.ObjectId | T | (Types.ObjectId | T)[]
) {
  if (Array.isArray(field)) {
    return isDocumentRefPopulated(field)
      ? field.map((item) => item.toJson())
      : field.map((item) => item.toString());
  }
  return isDocumentRefPopulated(field) ? field.toJson() : field.toString();
}
