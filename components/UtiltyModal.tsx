import { Dialog, DialogContent } from "@/components/ui/dialog";

export function UtilityModal({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className="sm:max-w-[425px] border-0 p-0 px-[3%]">
        {children}
      </DialogContent>
    </Dialog>
  );
}
