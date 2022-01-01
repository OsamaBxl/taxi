import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


export enum SnackBarState {
  Warning,
  Error,
  Success,
  Info
}
export interface SnackbarData {
  state: SnackBarState;
  message: string;
}

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  snackBarState = SnackBarState;

  constructor(
    public snackbarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData
  ) { }

  ngOnInit(): void {
  }

}
