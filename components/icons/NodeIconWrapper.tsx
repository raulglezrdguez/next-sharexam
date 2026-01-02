import React from "react";

interface NodeIconWrapperProps {
  color: string;
  children: React.ReactNode;
  label: string;
}
/**
 * Componente envolvente para aplicar estilos de círculo de color al icono.
 * @param {object} props
 * @param {string} props.color El color del círculo de fondo.
 * @param {React.ReactNode} props.children El icono de Lucide React.
 * @param {string} props.label La etiqueta del nodo.
 */
const NodeIconWrapper = ({ color, children, label }: NodeIconWrapperProps) => {
  return (
    <div className="flex flex-col items-center m-2 cursor-grab text-center">
      <div
        className="flex items-center justify-center rounded-[50%] shadow-md w-8 h-8"
        style={{
          background: color,
        }}
      >
        {children}
      </div>
      <small className="mt-2 text-xs text-gray-600">{label}</small>
    </div>
  );
};

export default NodeIconWrapper;
