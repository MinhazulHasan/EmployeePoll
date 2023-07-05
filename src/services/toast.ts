/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Swal from 'sweetalert2';

export class ToastMessage {
    public static toastWithConfirmation(icon: any, title: any, text: any): void {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            toast: true,
            position: 'top-right',
            showConfirmButton: true
        });
    }

    public static toastWithoutConfirmation(icon: any, title: any, text: any): void {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 1500,
        });
    }
}