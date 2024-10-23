import { Component, inject, OnInit } from '@angular/core';
import { StudentsService } from '../services/students.service';
import { Observable } from 'rxjs';
import { Student } from '../types/student';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit{
  
  students$!:Observable<Student[]>

  studentService = inject(StudentsService);

  constructor(private toasterService: ToastrService) {}

  ngOnInit(): void {
    this.getStudents();
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.toasterService.success("Successfully Deleted.");
        this.getStudents(); // Refresh the list
      },
      error: () => {
        this.toasterService.error("Failed to delete student.");
      }
    });
  }

  private getStudents():void {
    this.students$ = this.studentService.getStudents()
  }
}
