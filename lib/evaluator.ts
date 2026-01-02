import { create, all } from "mathjs";

const blacklist = [
  // --- 1. Riesgo de Denegación de Servicio (DoS) ---
  "factorial", // Factorial de números grandes explota el navegador.
  "combinations", // Cálculos combinatorios que pueden ser muy pesados.
  "permutations", // Cálculos combinatorios pesados.
  "lcm", // Mínimo común múltiplo (puede ser intensivo en arrays grandes).
  "gcd", // Máximo común divisor (puede ser intensivo en arrays grandes).
  "sum", // Suma de arrays grandes (mejor usar map/reduce si es necesario).
  "prod", // Producto de arrays grandes.
  "mean", // Media de arrays grandes.
  "distance", // Cálculo de distancia (puede ser costoso).
  "logarithm", // Generalización de log que puede ser compleja.

  // --- 2. Funciones de Ejecución y Metaprogramación ---
  "eval", // Evaluación de una cadena de texto dentro del sandbox (mejor evitar).
  "parser", // Creación de un nuevo parser (innecesario y peligroso).
  "compile", // Compilación de expresiones.
  "parse", // Conversión a árbol de expresiones (innecesario para el usuario final).

  // --- 3. Manipulación Compleja de Datos (Matrices, Arrays, Tipos) ---
  "matrix", // Creación de objetos Matrix (innecesario para condiciones booleanas).
  "sparse", // Creación de matrices dispersas (innecesario).
  "zeros", // Creación de matrices de ceros (DoS si el tamaño es grande).
  "ones", // Creación de matrices de unos.
  "identity", // Creación de matrices identidad.
  "concat", // Concatenación de matrices.
  "subset", // Extracción de subconjuntos de matrices.
  "resize", // Redimensionamiento de matrices.
  "sort", // Ordenación de arrays grandes.
  "forEach", // Iteración.

  // --- 4. Tipos de Datos No Primitivos (Mejor no exponerlos al usuario) ---
  "BigNumber", // El tipo BigNumber de mathjs.
  "Fraction", // El tipo Fraction de mathjs.
  "Complex", // El tipo Complex de mathjs.
  "Unit", // El tipo Unit para unidades de medida.

  // --- 5. Funciones de Entorno (Relevantes para Node.js, pero por precaución) ---
  // Aunque suelen estar deshabilitadas en el navegador, se incluyen por precaución:
  "import",
  "require",
  "config",
];

const allowedScope = { ...all };

blacklist.forEach((key) => {
  if (allowedScope.hasOwnProperty(key)) {
    delete allowedScope[key];
  }
});

const safeMath = create(allowedScope);

export function evaluateCondition(
  condition: string | null,
  answers: Record<string, unknown>
): boolean {
  if (!condition) return true;

  try {
    const scope = { answers: answers };

    let result = safeMath.evaluate(condition, scope);

    if (typeof result === "boolean") {
      return result;
    }

    if (typeof result.valueOf === "function") {
      result = result.valueOf();
    }

    return !!result;
  } catch (error) {
    console.error(`Error de evaluación: "${condition}"`, error);
    return false;
  }
}
