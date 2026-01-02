import Link from "next/link";
import { Users } from "lucide-react";

function MenuEditor({}) {
  return (
    <div id="editor-menu" className="fixed top-4 left-2 z-50 text-nowrap">
      <div className="backdrop-blur-sm bg-white/10 border border-white/80 rounded-full px-4 py-2">
        <div className="hidden md:flex space-x-6">
          <Link
            href={`/patients`}
            className="text-gray-800/80 bg-yellow-200/80 border rounded-2xl font-medium transition-all duration-300 hover:text-green-800 hover:bg-amber-200/80 px-4 py-2 hover:border-green-400 hover:border cursor-pointer"
          >
            <Users className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MenuEditor;
