export function UtilityModal({
  setOpen,
  children,
}: {
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={(open) => setOpen(!open)}
      className="fixed z-50 flex items-center justify-center top-0 bottom-0 right-0 left-0 bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-[425px] border-0 p-0 px-[3%]"
      >
        {children}
      </div>
    </div>
  );
}
