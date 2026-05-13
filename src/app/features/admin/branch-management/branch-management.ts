import { Component } from '@angular/core';
import { Branch } from '../../../core/models/branch.model';
import { LogisticsService } from '../../../core/services/logistics.service';

@Component({
  selector: 'app-branch-management',
  imports: [],
  templateUrl: './branch-management.html',
})
export class BranchManagement {
  branches: Branch[] = [];

  constructor(private logisticsService: LogisticsService) {
    this.branches = this.logisticsService.getBranches();
  }

  getStatusStyle(status: Branch['status']): string {
    return this.logisticsService.getBranchStatusStyle(status);
  }
}
