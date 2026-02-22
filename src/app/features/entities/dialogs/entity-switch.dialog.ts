import { Component, ViewChild } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog.component';

@Component({
  selector: 'app-entity-switch-dialog',
  standalone: true,
  imports: [DialogComponent],
  template: `<button
      (click)="dialog.open()"
      class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
      type="button"
    >
      Open Dialog
    </button>
    <app-dialog
      #dialog
      title="Its a simple dialog."
      (confirmed)="onConfirm()"
    >
      The key to more success is to have a lot of pillows. Put it this way, it
      took me twenty five years to get these plants, twenty five years of blood
      sweat and tears, and I&apos;m never giving up, I&apos;m just getting
      started. I&apos;m up to something. Fan luv.
    </app-dialog>`,
})
export class EntitySwitchDialog {
  @ViewChild('dialog') dialog!: DialogComponent;

  onConfirm() {
    console.log('Dialog confirmed');
  }
}
