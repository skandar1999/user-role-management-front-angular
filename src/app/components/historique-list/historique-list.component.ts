import { Component, OnInit } from '@angular/core';
import { HistoriqueActionService } from 'src/app/services/historique-action.service';

@Component({
  selector: 'app-historique-list',
  templateUrl: './historique-list.component.html',
  styleUrls: ['./historique-list.component.css'],
})
export class HistoriqueListComponent implements OnInit {
  actions: any[] = [];

  constructor(private historiqueService: HistoriqueActionService) {}

  ngOnInit(): void {
    this.historiqueService.getAllActions().subscribe(
      (data) => (this.actions = data),
      (error) => console.error('Error fetching actions', error)
    );
  }
}
