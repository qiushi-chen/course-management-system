export interface User {
  email: string;
  password: string;
  role: string;
}

interface UserType {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  courseId: number;
  name: string;
}

export interface Student {
  createdAt: string;
  updatedAt: string;
  id: number;
  email: string;
  name: string;
  country: string;
  profileId: number;
  type: UserType;
  courses: Course[];
}

export interface IResponse {
  code: number;
  msg: string;
  data: object;
}

export interface LoginResponse extends IResponse {
  data: {
    token: string;
    role: string;
    userId: number;
  };
}

export interface FetchStudentsResponse extends IResponse {
  data: {
    total: number;
    students: Student[];
    paginator: {
      page: number;
      limit: number;
    };
  };
}

export interface AddStudentResponse extends IResponse {
  data: Student;
}
