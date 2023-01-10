import { AES } from 'crypto-js';
import { IResponse, QueryParams } from '../model/api';
import { LoginRequest, LoginResponse, SignUpRequest } from '../model/login';
import {
  AddStudentRequest,
  AddStudentResponse,
  StudentRequest,
  StudentResponse,
} from '../model/student';
import { RootPath } from './api.path';
import BaseApiService from './base.service';

class ApiService extends BaseApiService {
  login({
    password,
    ...rest
  }: LoginRequest): Promise<IResponse<LoginResponse>> {
    console.log('salt', process.env.NEXT_PUBLIC_API_SALT);

    return this.post<IResponse<LoginResponse>>(RootPath.login, {
      ...rest,
      password: AES.encrypt(
        password,
        process.env.NEXT_PUBLIC_API_SALT as string
      ).toString(),
    }).then(this.showMessage());
  }

  logout(): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>(RootPath.logout, {}).then(
      this.showMessage()
    );
  }

  signup(req: SignUpRequest): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>([RootPath.signup], req).then(
      this.showMessage()
    );
  }

  getStudents(req?: StudentRequest): Promise<IResponse<StudentResponse>> {
    return this.get<IResponse<StudentResponse>>(
      RootPath.students,
      req as unknown as QueryParams
    );
  }

  // addStudent = (
  //   req: AddStudentRequest
  // ): Promise<IResponse<AddStudentResponse>> => {
  //   return this.post([RootPath.students], req).then(this.showMessage(true));
  // };

  // addStudent(req: AddStudentRequest): Promise<IResponse<AddStudentResponse>> {
  //   return this.post([RootPath.students], req).then(this.showMessage(true));
  // }
}

const apiService = new ApiService();

export default apiService;
