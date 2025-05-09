import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService, Role } from 'src/app/services/Role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
})
export class RoleManagementComponent implements OnInit {
  roleForm!: FormGroup;
  roles: Role[] = [];
  selectedRoleId: number | null = null;

  constructor(private fb: FormBuilder, private roleService: RoleService) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Error loading roles:', err),
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const roleData = {
        nom: this.roleForm.value.nom,
        description: this.roleForm.value.description,
      };

      if (this.selectedRoleId) {
        // UPDATE
        this.roleService
          .updateRole(this.selectedRoleId, roleData as Role)
          .subscribe({
            next: () => {
              Swal.fire('Succès', 'Role mis à jour avec succès', 'success');
              this.loadRoles();
              this.roleForm.reset();
              this.selectedRoleId = null;
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour:', err);
              Swal.fire(
                'Erreur',
                'Impossible de mettre à jour le role',
                'error'
              );
            },
          });
      } else {
        // CREATE
        this.roleService.addRole(roleData as Role).subscribe({
          next: () => {
            Swal.fire('Succès', 'Role ajouté avec succès', 'success');
            this.loadRoles();
            this.roleForm.reset();
          },
          error: (err) => {
            console.error("Erreur lors de l'ajout du role:", err);
            Swal.fire('Erreur', "Impossible d'ajouter le role", 'error');
          },
        });
      }
    }
  }

  editRole(role: Role): void {
    this.selectedRoleId = role.id;
    this.roleForm.patchValue({
      nom: role.nom,
      description: role.description,
    });
  }

  cancelEdit(): void {
    this.roleForm.reset();
    this.selectedRoleId = null;
  }

  deleteRole(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera le rôle définitivement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.deleteRole(id).subscribe({
          next: () => {
            Swal.fire('Supprimé!', 'Le rôle a été supprimé.', 'success');
            this.roles = this.roles.filter((role) => role.id !== id);
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
            Swal.fire('Erreur', 'Impossible de supprimer le rôle', 'error');
          },
        });
      }
    });
  }
}
