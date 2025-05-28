import { FC } from "react";

interface Props {
  contenido: string;
  fecha: string;
  onDelete?: () => void;
}

const ReportItem: FC<Props> = ({ contenido, fecha, onDelete }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow mb-4">
      <div className="text-sm text-gray-400">
        {new Date(fecha).toLocaleString()}
      </div>
      <p className="text-base text-gray-900 dark:text-gray-100 mt-2">
        {contenido}
      </p>
      {onDelete && (
        <button
          className="text-red-500 text-sm mt-2 hover:underline"
          onClick={onDelete}
        >
          Eliminar
        </button>
      )}
    </div>
  );
};

export default ReportItem;
