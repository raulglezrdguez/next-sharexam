import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Valida si una cadena de texto es una expresión JavaScript sintácticamente correcta.
 *
 * @param expression La cadena que se desea validar.
 * @returns {boolean} True si la expresión es sintácticamente correcta, false en caso contrario.
 */
export function isValidJavaScriptExpression(expression: string): {
  result: boolean;
  error?: string;
} {
  if (typeof expression !== "string") {
    return {
      result: false,
      error: "La expresión debe ser una cadena de texto.",
    };
  }

  if (expression.trim() === "") {
    return { result: true }; // Consideramos una cadena vacía como válida.
  }

  try {
    const validationCode = `return (${expression});`;

    new Function("answers", validationCode);

    return { result: true };
  } catch (error) {
    return { result: false, error: (error as Error).message };
  }
}
