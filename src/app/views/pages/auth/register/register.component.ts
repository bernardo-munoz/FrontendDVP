import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { TypeDocument } from '../model/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup; // Formulario Reactivo
  submitted = false; // Para verificar si el formulario ha sido enviado
  errorMessage: string = ""; // Mensaje de error

  listTypesDocuments: TypeDocument[] = []

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private toastr: ToastrService
   ) {
    this.getTypesDocuments();
    }

  ngOnInit(): void {
    // Inicializar el formulario con formBuilder
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      document: ['', Validators.required],
      typeDocument: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      user: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      authCheck: [false, Validators.required]
    });
  }

    get f() { return this.registerForm.controls; }

    getTypesDocuments(){
      // Llamar al servicio para guardar los datos del usuario
    this.loginService.getTypeDocuments().subscribe(
      response => {
        if(response.success){
          //this.toastr.success(response.message);

          this.listTypesDocuments = Object.values(response.result);

        }else{
          this.toastr.error(response.message);

          this.router.navigate(['/auth/login']);
        }
      },
      error => {
        console.error('Error al registrar usuario', error);
        this.errorMessage = 'Error al registrar usuario. Por favor, inténtelo de nuevo.';

      }
    );
    }

  onRegister() {

    this.submitted = true;

    // Detener aquí si el formulario es inválido
    if (this.registerForm.invalid || !this.f.authCheck.value) {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
          control.markAsTouched();
          control.markAsDirty();
        }
      });
      return;
    }

    // Llamar al servicio para guardar los datos del usuario
    this.loginService.setUsers(this.registerForm.value).subscribe(
      response => {
        if(response.success){
          this.toastr.success(response.message);
          this.registerForm.reset();
          this.router.navigate(['/auth/login']);

        }else{
          this.toastr.error(response.message);

          this.router.navigate(['/auth/login']);
        }
      },
      error => {
        console.error('Error al registrar usuario', error);
        this.errorMessage = 'Error al registrar usuario. Por favor, inténtelo de nuevo.';

      }
    );
  }

}
