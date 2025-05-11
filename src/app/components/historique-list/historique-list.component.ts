import { Component, OnInit } from '@angular/core';
import { HistoriqueActionService } from 'src/app/services/historique-action.service';
import { HistoriqueAction } from 'src/app/services/historique-action.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historique-list',
  templateUrl: './historique-list.component.html',
  styleUrls: ['./historique-list.component.css'],
})
export class HistoriqueListComponent implements OnInit {
  actions: HistoriqueAction[] = [];
  selectedType: string = '';

  constructor(private historiqueService: HistoriqueActionService) {}

  ngOnInit(): void {
    this.loadActions();
  }

  loadActions(): void {
    this.historiqueService.getAllActions().subscribe({
      next: (data) => {
        console.log('Raw actions response:', JSON.stringify(data, null, 2));
        this.actions = data;
      },
      error: (error) => {
        console.error('Error fetching actions:', error);
        console.error('Error response:', error.error);
        this.handleError('Erreur lors du chargement des actions', error);
      },
    });
  }

  getType(actionText: string | undefined): string {
    if (!actionText) return 'Autre';

    // Normalize text: lowercase, remove accents
    const normalizedText = actionText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Handle variations of "role" and "utilisateur"
    if (
      ['role', 'rôle', 'roles'].some((term) => normalizedText.includes(term))
    ) {
      return 'Role';
    } else if (
      ['utilisateur', 'user'].some((term) => normalizedText.includes(term))
    ) {
      return 'Utilisateur';
    }
    return 'Autre';
  }

  filteredActions(): HistoriqueAction[] {
    if (!this.selectedType) {
      return this.actions;
    }
    return this.actions.filter(
      (action) => this.getType(action.action) === this.selectedType
    );
  }

  countUtilisateurs(): number {
    return this.actions.filter(
      (action) => this.getType(action.action) === 'Utilisateur'
    ).length;
  }

  countRoles(): number {
    return this.actions.filter(
      (action) => this.getType(action.action) === 'Role'
    ).length;
  }

  countHistoriqueActions(): number {
    return this.actions.length;
  }

  private handleError(msg: string, err: any): void {
    console.error(msg, err);
    Swal.fire('Erreur', `${msg}: ${err.message || 'Erreur inconnue'}`, 'error');
  }
}
