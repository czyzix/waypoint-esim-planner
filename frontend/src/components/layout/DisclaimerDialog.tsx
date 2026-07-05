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
          This is a personal side project built for learning and experimentation. 
          To make the demo feel more realistic, it uses publicly available eSIM plans inspired by Saily's offer. 
          This project is not affiliated with, endorsed by, or associated with Saily in any way.
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
