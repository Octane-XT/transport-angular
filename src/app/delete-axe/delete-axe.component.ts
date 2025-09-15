import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';  

@Component({
  selector: 'app-delete-axe',
  standalone: true,
  imports: [
    MatDialogModule,  
    MatIcon,        
  ],
  templateUrl: './delete-axe.component.html',
  styleUrls: ['./delete-axe.component.css']
})
export class DeleteAxeComponent {

  constructor(private dialog: MatDialog) {}

  onSave() {
    console.log('Axe supprimé');
    this.closeDialog();  
  }


  onCancel() {
    console.log('Suppression annulée');
    this.closeDialog();  
  }

  closeDialog() {
    this.dialog.closeAll(); 
  }
}
