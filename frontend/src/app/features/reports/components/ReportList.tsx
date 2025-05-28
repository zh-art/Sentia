import { FC } from "react";
import ReportItem from "./ReportItem";
import { Reporte } from "../types";
interface Props {
  reportes: Reporte[];
  onDelete: (id: string) => void;
}

const ReportList: FC<Props> = ({ reportes, onDelete }) => {
  return (
    <div className="space-y-4">
      {reportes.map((r) => (
        <ReportItem
          key={r.fecha}
          contenido={r.contenido}
          fecha={r.fecha}
          onDelete={() => onDelete(r._id)}
        />
      ))}
    </div>
  );
};

export default ReportList;
