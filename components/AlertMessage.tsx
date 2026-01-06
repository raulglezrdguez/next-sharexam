import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { XCircle } from "lucide-react";

type Props = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  title: string;
  message: string;
  confirmAction: () => void;
};

const AlertMessage = ({
  dialogOpen,
  setDialogOpen,
  title,
  message,
  confirmAction,
}: Props) => {
  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <button className="btn btn-error">
          <XCircle size={14} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border border-gray-50 bg-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-200">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-200">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="w-full flex flex-row justify-around items-center align-middle">
            <AlertDialogCancel className="text-gray-200 bg-green-600 hover:text-gray-200 hover:bg-green-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className="bg-red-600 hover:bg-red-700 text-gray-200"
            >
              Ok
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertMessage;
