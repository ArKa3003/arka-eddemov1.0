"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const modalSizes = cva("max-w-lg", {
  variants: {
    size: {
      sm: "max-w-sm",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "max-w-[95vw] max-h-[95vh]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ModalProps extends Dialog.DialogProps {
  /**
   * Control the open state of the modal
   */
  open?: boolean;
  /**
   * Callback fired when the open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Children to render inside the modal root
   */
  children: React.ReactNode;
}

/**
 * Modal root component using Radix UI Dialog.
 * Provides backdrop, focus trap, and scroll lock.
 * 
 * @example
 * ```tsx
 * <Modal open={isOpen} onOpenChange={setIsOpen}>
 *   <ModalTrigger>Open</ModalTrigger>
 *   <ModalContent size="lg">
 *     <ModalTitle>Title</ModalTitle>
 *     <ModalDescription>Description</ModalDescription>
 *     Content here
 *   </ModalContent>
 * </Modal>
 * ```
 */
export function Modal({ open, onOpenChange, children, ...props }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal {...props}>
      {children}
    </Dialog.Root>
  );
}

export interface ModalContentProps
  extends Omit<Dialog.DialogContentProps, "size">,
    VariantProps<typeof modalSizes> {
  /**
   * Show close button in the top-right corner
   */
  showCloseButton?: boolean;
  /**
   * Prevent closing on backdrop click
   */
  preventBackdropClose?: boolean;
  /**
   * Prevent closing on escape key
   */
  preventEscapeClose?: boolean;
}

/**
 * Modal content component with backdrop and animations.
 * Supports multiple sizes and close behaviors.
 */
export function ModalContent({
  className,
  size,
  showCloseButton = true,
  preventBackdropClose = false,
  preventEscapeClose = false,
  children,
  ...props
}: ModalContentProps) {
  return (
    <Dialog.Portal>
      <AnimatePresence>
        <Dialog.Overlay
          asChild
          forceMount
          onClick={preventBackdropClose ? (e) => e.stopPropagation() : undefined}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
        </Dialog.Overlay>
      </AnimatePresence>
      <Dialog.Content
        asChild
        forceMount
        onEscapeKeyDown={preventEscapeClose ? (e) => e.preventDefault() : undefined}
        onPointerDownOutside={preventBackdropClose ? (e) => e.preventDefault() : undefined}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 shadow-lg focus:outline-none",
            modalSizes({ size }),
            className
          )}
        >
          {showCloseButton && (
            <Dialog.Close asChild>
              <button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:pointer-events-none"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          )}
          {children}
        </motion.div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

/**
 * Button that triggers the modal to open.
 */
export const ModalTrigger = Dialog.Trigger;

/**
 * Button that closes the modal.
 */
export const ModalClose = Dialog.Close;

/**
 * Modal title component (h2 by default).
 */
export const ModalTitle = Dialog.Title;

/**
 * Modal description component.
 */
export const ModalDescription = Dialog.Description;

/**
 * Modal header component for consistent header styling.
 */
export function ModalHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Modal footer component for action buttons.
 */
export function ModalFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Dialog Exports (for shadcn/ui compatibility)
// ============================================================================

export {
  // Re-export Radix Dialog primitives
  Dialog.Root as DialogRoot,
  Dialog.Trigger as DialogTrigger,
  Dialog.Close as DialogClose,
  Dialog.Portal as DialogPortal,
  Dialog.Overlay as DialogOverlay,
};

// Export DialogContent as an alias for ModalContent
export { ModalContent as DialogContent };

// Export DialogTitle as an alias for ModalTitle
export { ModalTitle as DialogTitle };

// Export DialogDescription as an alias for ModalDescription
export { ModalDescription as DialogDescription };

// Export DialogHeader as an alias for ModalHeader
export { ModalHeader as DialogHeader };

// Export DialogFooter as an alias for ModalFooter
export { ModalFooter as DialogFooter };

// Export Dialog as an alias for Modal (main component)
export { Modal as Dialog };