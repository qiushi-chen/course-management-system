import { BaseType, ListResponse, Paginator } from './api';
import { Course, CourseShort } from './course';

export interface Student<T = CourseShort> {
  id: number;
  name: string;
  updateAt: string;
  country: string;
  ctime: string;
  email: string;
  courses: T[];
  type: BaseType | null;
}

export interface StudentsRequest extends Paginator {
  query?: string;
  userId?: number;
}

export interface StudentsResponse extends ListResponse {
  students: Student[];
}
export interface AddStudentRequest {
  name: string;
  country: string;
  email: string;
  type: number;
}

export type AddStudentResponse = Student;

export interface UpdateStudentRequest extends AddStudentRequest {
  id: number;
}

export type UpdateStudentResponse = Student;

export interface StudentRequest {
  id: number;
}

export type StudentResponse = StudentWithProfile;

export interface StudentWithProfile extends Student<Course>, StudentProfile {}

export interface StudentProfile {
  id: number;
  name: string;
  country: string;
  email: string;
  address: string;
  phone: number;
  gender: number;
  education: string;
  age: number;
  interest: string[];
  avatar: string;
  memberStartAt: string;
  memberEndAt: string;
  description: string;
}

// import { BaseType, ListResponse, Paginator } from './api';
// import { CourseShort } from './course';

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

// export interface Student<T = CourseShort> {
//   id: number;
//   name: string;
//   updatedAt: string;
//   country: string;
//   ctime: string;
//   email: string;
//   courses: T[];
//   type: BaseType | null;
// createdAt: string;
// profileId: number;
// }

// export interface StudentRequest extends Paginator {
//   query?: string;
//   userId?: number;
// }

// export interface StudentResponse extends ListResponse {
//   students: Student[];
// }

// export interface AddStudentRequest {
//   name: string;
//   country: string;
//   email: string;
//   type: number;
// }

// export type AddStudentResponse = Student;
