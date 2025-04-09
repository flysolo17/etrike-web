import { Component, Input } from '@angular/core';
import { Reports } from '../../../../models/report/report';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css',
})
export class ReportCardComponent {
  @Input() report!: Reports;
}
