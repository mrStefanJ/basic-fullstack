import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../types/student';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  apiUrl = "http://localhost:5218/api/students";
  constructor(private http: HttpClient) {}

  getStudents = (): Observable<Student[]> =>
    this.http.get<Student[]>(this.apiUrl);

  createStudnet = (student: Student): Observable<Student> =>
    this.http.post<Student>(this.apiUrl, student);

  getStudentById = (id: number): Observable<Student> => {
    return this.http.get<Student>(this.apiUrl + '/' + id);
  };

  updateStudent = (id: number, student: Student) => {
    return this.http.put<Student>(this.apiUrl + '/' + id, student);
  };

  deleteStudent = (id: number):Observable<void> => {
    return this.http.delete<void>(this.apiUrl + '/' + id);
  };
}
