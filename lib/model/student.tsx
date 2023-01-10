import { BaseType, ListResponse, Paginator } from './api';
import { CourseShort } from './course';

// export interface Student<T = CourseShort> {
//   createdAt: string;
//   updatedAt: string;
//   ctime: string;
//   id: number;
//   email: string;
//   name: string;
//   country: string;
//   profileId: number;
//   type: BaseType | null;
//   courses: T[];
// }

export interface Student<T = CourseShort> {
  id: number;
  name: string;
  updatedAt: string;
  country: string;
  ctime: string;
  email: string;
  courses: T[];
  type: BaseType | null;
  // createdAt: string;
  // profileId: number;
}

export interface StudentRequest extends Paginator {
  query?: string;
  userId?: number;
}

export interface StudentResponse extends ListResponse {
  students: Student[];
}

export interface AddStudentRequest {
  name: string;
  country: string;
  email: string;
  type: number;
}

export type AddStudentResponse = Student;
