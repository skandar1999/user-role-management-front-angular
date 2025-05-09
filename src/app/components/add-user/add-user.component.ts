import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, Utilisateur } from 'src/app/services/user.service';
import { RoleService, Role } from 'src/app/services/Role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  users: Utilisateur[] = [];
  roles: Role[] = [];
  selectedUserId: number | null = null; // ✅ Pour savoir si on modifie ou ajoute

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      role: ['', Validators.required],
      actif: ['true', Validators.required],
    });

    this.loadRoles();
    this.loadUsers();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Erreur chargement rôles :', err),
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Erreur chargement utilisateurs :', err),
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData: Utilisateur = {
        nom: this.userForm.value.nom,
        email: this.userForm.value.email,
        motDePasse: this.userForm.value.motDePasse,
        role: {
          id: +this.userForm.value.role,
          nom: '',
          description: '',
        },
        actif: this.userForm.value.actif === 'true',
      };

      if (this.selectedUserId) {
        // ✅ Modifier
        this.userService.updateUser(this.selectedUserId, formData).subscribe({
          next: () => {
            Swal.fire('Succès', 'Utilisateur modifié avec succès', 'success');
            this.loadUsers();
            this.userForm.reset();
            this.selectedUserId = null; // ✅ reset pour repasser en mode ajout
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Erreur', 'Une erreur est survenue', 'error');
          },
        });
      } else {
        // ✅ Ajouter
        this.userService.addUser(formData).subscribe({
          next: () => {
            Swal.fire('Succès', 'Utilisateur ajouté avec succès', 'success');
            this.loadUsers();
            this.userForm.reset();
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Erreur', 'Une erreur est survenue', 'error');
          },
        });
      }
    }
  }

  deleteUser(id: number): void {
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
            this.users = this.users.filter((u) => u.id !== id);
            Swal.fire('Supprimé!', 'Utilisateur supprimé.', 'success');
          },
          error: (err) => {
            console.error('Erreur suppression :', err);
            Swal.fire('Erreur!', 'Une erreur est survenue.', 'error');
          },
        });
      }
    });
  }

  editUser(user: Utilisateur): void {
    this.selectedUserId = user.id!;
    this.userForm.patchValue({
      nom: user.nom,
      email: user.email,
      motDePasse: user.motDePasse,
      role: user.role.id,
      actif: user.actif ? 'true' : 'false',
    });
  }

  cancelEdit(): void {
    this.userForm.reset();
    this.selectedUserId = null;
  }

  searchUtilisateurs(nom: string): void {
    if (nom.trim() === '') {
      this.loadUsers(); // Reload all users if the search input is empty
      return;
    }

    this.userService.searchUtilisateurByNom(nom).subscribe({
      next: (data) => {
        this.users = data;
        console.log('Found utilisateurs:', data);
      },
      error: (err) => {
        console.error('Error searching utilisateurs:', err);
      },
    });
  }
}
