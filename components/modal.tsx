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
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

const modal = ({
  loading,
  open,
  setOpen,
  onclick,
}: {
  loading: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  onclick: () => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="w-10 h-10 flex items-center justify-center rounded-lg">
          <Trash2 strokeWidth={1.2} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            product and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={loading}
            onClick={onclick}
            className="bg-secondaryBg disabled:bg-secondaryBg"
          >
            {loading ? (
              <span className="animate-spin">
                <Loader2 />
              </span>
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default modal;
