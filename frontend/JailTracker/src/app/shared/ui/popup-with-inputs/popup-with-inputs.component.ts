import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dictionary } from 'src/app/models/dictionary.model';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupDataModel,
  InputPopupModel,
} from 'src/app/models/input-popup-data.model';

@Component({
  selector: 'app-popup-with-inputs',
  templateUrl: './popup-with-inputs.component.html',
  styleUrls: ['./popup-with-inputs.component.scss'],
})
export class PopupWithInputsComponent {
  public primary = ButtonTypes.PRIMARY;

  closePopup() {
    this.dialogRef.close('primary');
  }

  constructor(
    public dialogRef: MatDialogRef<PopupWithInputsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputPopupDataModel
  ) {}

  getDict(dict: Dictionary<InputPopupModel>) {
    return Object.entries(dict);
  }
  trackByFn(index: number, item: [key: string, val: InputPopupModel]) {
    return item[0];
  }

  async btnClick(button: ButtonPopupModel) {
    if (button.onClick != null) await button.onClick();
    this.closePopup();
  }
}
