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
        <Button
          variant={"outline"}
          className="hover:cursor-pointer text-red-400 hover:text-red-200 transition-colors duration-300 ease-in-out"
        >
          <XCircle size={14} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border border-gray-50">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-200">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-200">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-gray-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmAction}
            className="bg-red-600 hover:bg-red-700 text-gray-200"
          >
            Ok
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertMessage;
