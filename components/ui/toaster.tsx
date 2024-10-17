'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { TriangleAlertIcon } from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="flex items-center gap-x-2">
                  {props?.variant == 'default' ? (
                    <FaCheckCircle className="size-5 text-emerald-500 shrink-0" />
                  ) : (
                    <TriangleAlertIcon className="size-5 shrink-0" />
                  )}{' '}
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
