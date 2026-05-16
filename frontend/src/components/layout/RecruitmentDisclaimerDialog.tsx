import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RecruitmentDisclaimerDialog() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        initialFocus={false}
      >
        <DialogHeader>
          <DialogTitle>Demo project</DialogTitle>
          <DialogDescription className="text-pretty">
            This site is a technical demonstration built for a recruitment
            task. It is not a real product, does not sell eSIM plans, and is not
            affiliated with or endorsed by the official Saily website or
            service.
          </DialogDescription>
        </DialogHeader>
        <div>
          <DialogClose
            className="w-full"
            render={<Button type="button" className="w-full" />}
          >
            Got it
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
