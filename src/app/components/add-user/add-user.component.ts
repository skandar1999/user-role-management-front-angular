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
  roles: any[] = [];

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
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) =>
        console.error('Erreur lors du chargement des rôles :', err),
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
          nom: '', // Optional if your backend only cares about the ID
          description: '', // Optional as well
        },
        actif: this.userForm.value.actif === 'true',
      };

      this.userService.addUser(formData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Utilisateur ajouté avec succès', 'success');
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
