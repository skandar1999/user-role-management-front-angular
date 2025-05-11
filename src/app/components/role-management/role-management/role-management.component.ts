import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService, Role, Permission } from 'src/app/services/Role.service';
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
  availablePermissions: Permission[] = [];
  selectedPermissionId: { [key: number]: number | null } = {};

  constructor(private fb: FormBuilder, private roleService: RoleService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
    this.loadPermissions();
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      permissionIds: [[]], // Array for multiple permission IDs
    });
  }

  loadPermissions(): void {
    this.roleService.getAllPermissions().subscribe({
      next: (permissions) => {
        this.availablePermissions = permissions.filter(
          (p) => p.nom && p.description
        );
        console.log('Loaded permissions:', this.availablePermissions);
      },
      error: (err) => this.handleError('Erreur chargement permissions', err),
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (response) => {
        console.log('Raw roles response:', JSON.stringify(response, null, 2)); // Pretty-print raw response
        this.roles = response.map((role) => ({
          ...role,
          permissions:
            role.permissions?.map((p) => ({
              id: p.id,
              nom: p.nom || 'Unknown',
              description: p.description || 'No description',
            })) || [],
        }));
        this.roles.forEach((role) => {
          this.selectedPermissionId[role.id!] = null;
        });
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        console.error('Error response:', err.error); // Log error details
        this.handleError('Erreur de chargement', err);
      },
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const formValue = this.roleForm.value;
    const roleData: Role = {
      nom: formValue.nom,
      description: formValue.description,
      permissions: formValue.permissionIds
        ? formValue.permissionIds.map((id: number) => ({ id }))
        : [],
    };

    console.log('Sending role data:', JSON.stringify(roleData, null, 2));

    const request = this.selectedRoleId
      ? this.roleService.updateRole(this.selectedRoleId, roleData)
      : this.roleService.addRole(roleData);

    request.subscribe({
      next: (newRole) => {
        Swal.fire(
          'Succès',
          `Rôle ${this.selectedRoleId ? 'mis à jour' : 'ajouté'} avec succès`,
          'success'
        );
        this.loadRoles();
        this.roleForm.reset();
        this.roleForm.patchValue({ permissionIds: [] });
        this.selectedRoleId = null;
      },
      error: (err) => {
        console.error('Error during role operation:', err);
        this.handleError(
          `Erreur lors de ${
            this.selectedRoleId ? 'la mise à jour' : "l'ajout"
          }`,
          err
        );
      },
    });
  }

  editRole(role: Role): void {
    this.selectedRoleId = role.id!;
    this.roleForm.patchValue({
      nom: role.nom,
      description: role.description,
      permissionIds: role.permissions ? role.permissions.map((p) => p.id) : [],
    });
  }

  cancelEdit(): void {
    this.roleForm.reset();
    this.roleForm.patchValue({ permissionIds: [] });
    this.selectedRoleId = null;
  }

  deleteRole(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera le rôle.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.deleteRole(id).subscribe({
          next: () => {
            Swal.fire('Supprimé!', 'Le rôle a été supprimé.', 'success');
            this.roles = this.roles.filter((r) => r.id !== id);
          },
          error: (err) => this.handleError('Erreur de suppression', err),
        });
      }
    });
  }

  addPermissionToRole(roleId: number): void {
    const permissionId = this.selectedPermissionId[roleId];
    if (permissionId !== null) {
      this.roleService.addPermissionToRole(roleId, permissionId).subscribe({
        next: () => {
          Swal.fire('Succès', 'Permission ajoutée au rôle.', 'success');
          this.loadRoles();
          this.selectedPermissionId[roleId] = null;
        },
        error: (err) => this.handleError("Erreur d'ajout de permission", err),
      });
    }
  }

  removePermission(roleId: number, permissionId: number): void {
    this.roleService.removePermissionFromRole(roleId, permissionId).subscribe({
      next: () => {
        Swal.fire('Succès', 'Permission supprimée du rôle.', 'success');
        this.loadRoles();
      },
      error: (err) =>
        this.handleError('Erreur de suppression de permission', err),
    });
  }

  togglePermission(event: Event, permissionId: number): void {
    const input = event.target as HTMLInputElement;
    const currentPermissionIds = this.roleForm.value.permissionIds as number[];
    if (input.checked) {
      if (!currentPermissionIds.includes(permissionId)) {
        this.roleForm.patchValue({
          permissionIds: [...currentPermissionIds, permissionId],
        });
      }
    } else {
      this.roleForm.patchValue({
        permissionIds: currentPermissionIds.filter((id) => id !== permissionId),
      });
    }
  }

  private handleError(msg: string, err: any): void {
    console.error(msg, err);
    Swal.fire('Erreur', `${msg}: ${err.message || 'Erreur inconnue'}`, 'error');
  }
}
