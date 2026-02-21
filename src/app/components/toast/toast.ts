import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'

export type ToastType = 'success' | 'danger' | 'warning'

@Component({
    selector: 'cmp-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.html'
})
export class ToastComponent {
    @Input() type: ToastType = 'success'
    @Input() message = ''
    @Input() id = ''
    @Output() close = new EventEmitter<void>()

    getIconPath(): string {
        const icons = {
            success: 'M5 11.917 9.724 16.5 19 7.5',
            danger: 'M6 18 17.94 6M18 18 6.06 6',
            warning: 'M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
        }
        return icons[this.type]
    }

    getIconLabel(): string {
        return {
            success: 'Success',
            danger: 'Error',
            warning: 'Warning'
        }[this.type]
    }

    getContainerClasses(): string {
        return {
            success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
            danger: 'bg-red-50 text-red-900 border-red-200',
            warning: 'bg-amber-50 text-amber-900 border-amber-200'
        }[this.type]
    }

    getIconContainerClasses(): string {
        return {
            success: 'bg-emerald-100 text-emerald-600',
            danger: 'bg-red-100 text-red-600',
            warning: 'bg-amber-100 text-amber-600'
        }[this.type]
    }
}