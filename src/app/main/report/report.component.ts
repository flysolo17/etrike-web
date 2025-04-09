import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { map, startWith, switchMap } from 'rxjs';
import { Reports } from '../../models/report/report';
import { EmergencyService } from '../../services/emergency.service';
import { Emergency, LocationInfo } from '../../models/emergency/emergency';
import { CrashesService } from '../../services/crashes.service';
import { Crash } from '../../models/crashes/Crash';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  tabs$ = ['Crashes', 'Emergency', 'Reports'];
  searchTerm$ = new FormControl('');

  private reportsSource$ = this.reportService.getAllReports();
  reportFilter = new FormControl('', { nonNullable: true });
  reports$ = this.reportFilter.valueChanges.pipe(
    startWith(''),
    switchMap((text) =>
      this.reportsSource$.pipe(
        map((reports) => this.searchReport(reports, text))
      )
    )
  );

  private emergencySource$ = this.emergencyService.getEmergencyReports();
  emergencyFilter = new FormControl('', { nonNullable: true });
  emegency$ = this.emergencyFilter.valueChanges.pipe(
    startWith(''),
    switchMap((text) =>
      this.emergencySource$.pipe(
        map((emergencies) => this.searchEmergency(emergencies, text))
      )
    )
  );

  private crashSource$ = this.crashService.getAllCrashes();
  crashFilter = new FormControl('', { nonNullable: true });
  crashes$ = this.crashFilter.valueChanges.pipe(
    startWith(''),
    switchMap((text) =>
      this.crashSource$.pipe(
        map((crashes) => this.searchCrashes(crashes, text))
      )
    )
  );

  constructor(
    private reportService: ReportService,
    private emergencyService: EmergencyService,
    private crashService: CrashesService
  ) {}

  ngOnInit(): void {}

  searchCrashes(crashes: Crash[], text: string): Crash[] {
    if (!text.trim()) return crashes;
    const term = text.toLowerCase();
    return crashes.filter((crash: Crash) =>
      [
        crash.impact?.toString(),
        crash.location,
        crash.driverID,
        crash.passengerID,
      ]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(term))
    );
  }

  searchReport(reports: Reports[], text: string): Reports[] {
    if (!text.trim()) return reports; // Return all reports if no search term
    const term = text.toLowerCase();
    return reports.filter((report: Reports) =>
      [
        report.issues?.toString(),
        report.details,
        report.driver?.name,
        report.passenger?.name,
      ]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(term))
    );
  }

  searchEmergency(emergencies: Emergency[], text: string): Emergency[] {
    if (!text.trim()) return emergencies; // Return all reports if no search term
    const term = text.toLowerCase();
    return emergencies.filter((emergency: Emergency) =>
      [
        emergency.transactionID?.toString(),
        emergency.location?.latitude.toString(),
        emergency.location?.longitude.toString(),
        emergency.driverInfo?.name,
        emergency.passengerInfo?.name,
      ]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(term))
    );
  }

  viewOnMap(location: LocationInfo) {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
      '_blank'
    );
  }
}
