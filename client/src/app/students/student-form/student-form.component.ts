import { JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentsService } from '../../services/students.service';
import { Subscription } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, RouterLink, ToastrModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss',
})
export class StudentFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  studentformSubscription!: Subscription;
  paramsSubscription!: Subscription;
  studentService = inject(StudentsService);

  isEdit = false;
  id=0;

  constructor(
    private fb: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService
  ) {}

  ngOnDestroy(): void {
    if (this.studentformSubscription) {
      this.studentformSubscription.unsubscribe();
    }

    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if(!this.isEdit) {
      this.studentformSubscription = this.studentService
      .createStudnet(this.form.value)
      .subscribe({
        next: () => {
          this.toasterService.success("Student successfully create.")
          this.router.navigateByUrl('/students');
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
        this.studentService.updateStudent(this.id, this.form.value).subscribe(
          {
            next: value => {
              this.toasterService.success("Edited successfully");
              this.router.navigateByUrl('/students');
            }, error: err => {
              this.toasterService.error("Unable to edit");
            }
          }
        )
    }
    
  }

  ngOnInit(): void {
    this.paramsSubscription = this.activatedRouter.params.subscribe({
      next: (response) => {
        const id = response['id'];
        this.id = id;

        if (!id) return;

        this.studentService.getStudentById(id).subscribe({
          next: (response: any) => {
            this.form.patchValue(response);
            this.isEdit = true;
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [],
      phoneNumber: [],
      email: ['', Validators.email],
    });
  }
}
