import { Component, OnInit } from '@angular/core';
import { UserService, Utilisateur } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-users',
  templateUrl: './liste-users.component.html',
  styleUrls: ['./liste-users.component.css'],
})
export class ListeUsersComponent implements OnInit {
  users: Utilisateur[] = [];
  id: any;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) =>
        console.error('Erreur lors du chargement des utilisateurs :', err),
    });
  }

  deleteUser(id: number): void {
    // Display confirmation dialog using SweetAlert2
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas annuler cette action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.users = this.users.filter((user) => user.id !== id);
            Swal.fire('Supprimé!', "L'utilisateur a été supprimé.", 'success');
          },
          error: (err) => {
            console.error(
              'Erreur lors de la suppression de l’utilisateur :',
              err
            );
            // Error notification
            Swal.fire('Erreur!', 'Une erreur est survenue.', 'error');
          },
        });
      }
    });
  }
}
