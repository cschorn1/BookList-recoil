import { useRecoilValue } from "recoil";
import { syncStatusAtom } from "../atoms/syncStatusAtom";

export default function SyncIndicator() {
  const syncStatus = useRecoilValue(syncStatusAtom);

  const statusConfig = {
    sincronizado: {
      label: "Sincronizado",
      color: "bg-green-500",
      icon: "✓",
    },
    sincronizando: {
      label: "Sincronizando...",
      color: "bg-blue-500",
      icon: "⟳",
    },
    offline: {
      label: "Offline",
      color: "bg-red-500",
      icon: "⚠",
    },
  };

  const config = statusConfig[syncStatus];

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-2 rounded-full px-4 py-2 text-white shadow-lg ${config.color} transition-all duration-300`}>
      <span className={`text-lg ${syncStatus === "sincronizando" ? "animate-spin" : ""}`}>
        {config.icon}
      </span>
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}
