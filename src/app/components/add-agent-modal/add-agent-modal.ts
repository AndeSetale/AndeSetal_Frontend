import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-agent-modal',
  imports: [],
  templateUrl: './add-agent-modal.html',
  styleUrl: './add-agent-modal.css',
})
export class AddAgentModal {
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}