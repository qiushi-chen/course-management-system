// tslint:disable:max-classes-per-file
import { message } from 'antd';
import axios, { AxiosError } from 'axios';
import { AES } from 'crypto-js';
import * as model from '../model';
import {
  BaseType,
  DeleteResponse,
  IResponse,
  QueryParams,
} from '@/lib/model/api';
import { Country, Degree } from '@/lib/model/common';
import {
  AddCourseRequest,
  AddCourseResponse,
  ClassSchedule,
  CourseDetailResponse,
  CourseRequest,
  CourseResponse,
  CourseType,
  Schedule,
  ScheduleRequest,
  UpdateCourseRequest,
  UpdateCourseResponse,
} from '@/lib/model/course';
import { LoginRequest, LoginResponse, SignUpRequest } from '@/lib/model/login';

import {
  MessagesRequest,
  MessagesResponse,
  MessageStatisticResponse,
} from '@/lib/model/message';
import * as statistics from '@/lib/model/statistics';
import { fieldMap } from '@/lib/util/api.field.remap';
import { RootPath, SubPath } from '@/lib/service/api.path';

import storage from './storage';

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API || 'http://localhost:3001/api';
  } else {
    return 'https://cms.chtoma.com/api';
  }
};
// const baseURL = getBaseUrl();
const baseURL = 'http://cms.chtoma.com/api';
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  responseType: 'json',
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes('login')) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: 'Bearer ' + storage?.token(),
      },
    };
  }

  return config;
});

type IPath = (string | number)[] | string | number;

class BaseApiService {
  protected async get<T>(path: IPath, params?: QueryParams): Promise<T> {
    path = this.getPath(path);
    path = !!params
      ? `${path}?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : path;

    return axiosInstance
      .get(path)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  protected async post<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .post(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async delete<T>(path: IPath): Promise<T> {
    return axiosInstance
      .delete(this.getPath(path))
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async put<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .put(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  /**
   * ?????? HTTP ?????????????????????????????????
   */
  protected isError(code: number): boolean {
    return !(
      code.toString().startsWith('2') || code.toString().startsWith('3')
    );
  }

  /**
   * ?????? Api ??????????????????
   */
  protected showMessage =
    (isSuccessDisplay = false) =>
    (res: IResponse): IResponse => {
      const { code, msg } = res;
      const isError = this.isError(code);

      if (isError) {
        message.error(msg);
      }

      if (isSuccessDisplay && !isError) {
        message.success(msg);
      }

      return res;
    };

  /**
   * ?????? http ??????????????????
   * ????????????????????????code???HTTP???????????????????????????????????????code
   */
  private errorHandler(err: AxiosError<IResponse>): IResponse {
    const msg = err.response?.data.msg ?? 'unknown error';
    const code = err.response?.status ?? -1;

    if (!err.response) {
      console.error(
        '%c [ err ]-149',
        'font-size:13px; background:pink; color:#bf2c9f;',
        err
      );
    }

    return { msg, code };
  }

  private getPath(path: IPath): string {
    return !Array.isArray(path) ? String(path) : path.join('/');
  }
}

class ApiService extends BaseApiService {
  login({
    password,
    ...rest
  }: LoginRequest): Promise<IResponse<LoginResponse>> {
    return this.post<IResponse<LoginResponse>>(RootPath.login, {
      ...rest,
      password: AES.encrypt(password, 'cms').toString(),
    }).then(this.showMessage());
  }

  logout(): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>(RootPath.logout, {}).then(
      this.showMessage()
    );
  }

  signUp(req: SignUpRequest): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>([RootPath.signUp], req).then(
      this.showMessage(true)
    );
  }

  @fieldMap()
  getStudents(
    req?: model.StudentsRequest
  ): Promise<IResponse<model.StudentsResponse>> {
    return this.get<IResponse<model.StudentsResponse>>(
      RootPath.students,
      req as unknown as QueryParams
    );
  }

  addStudent(
    req: model.AddStudentRequest
  ): Promise<IResponse<model.AddStudentResponse>> {
    return this.post([RootPath.students], req).then(this.showMessage(true));
  }

  @fieldMap()
  updateStudent(
    req: model.UpdateStudentRequest
  ): Promise<IResponse<model.UpdateStudentResponse>> {
    return this.put([RootPath.students], req).then(this.showMessage(true));
  }

  deleteStudent(id: number): Promise<IResponse<DeleteResponse>> {
    return this.delete([RootPath.students, id]).then(this.showMessage(true));
  }

  @fieldMap()
  getStudentById(id: number): Promise<IResponse<model.StudentResponse>> {
    return this.get([RootPath.students, id]).then(this.showMessage());
  }

  @fieldMap()
  getCourses<T = CourseResponse>(
    req: Partial<CourseRequest>
  ): Promise<IResponse<T>> {
    return this.get(RootPath.courses, req).then(this.showMessage());
  }

  getCourseById(id: number): Promise<IResponse<CourseDetailResponse>> {
    return this.get([RootPath.courses, SubPath.detail], { id }).then(
      this.showMessage()
    );
  }

  addCourse(req: AddCourseRequest): Promise<IResponse<AddCourseResponse>> {
    return this.post([RootPath.courses], req).then(this.showMessage(true));
  }

  updateSchedule(req: ScheduleRequest): Promise<IResponse<boolean>> {
    return this.put([RootPath.courses, SubPath.schedule], req).then(
      this.showMessage(true)
    );
  }

  updateCourse(
    req: UpdateCourseRequest
  ): Promise<IResponse<UpdateCourseResponse>> {
    return this.put([RootPath.courses], req).then(this.showMessage(true));
  }

  deleteCourse(id: number): Promise<IResponse<boolean>> {
    return this.delete([RootPath.courses, id]).then(this.showMessage(true));
  }

  getScheduleById({
    courseId,
    scheduleId,
  }: {
    courseId?: number;
    scheduleId?: number;
  }): Promise<IResponse<Schedule>> {
    return this.get<IResponse<Schedule>>([RootPath.courses, SubPath.schedule], {
      courseId,
      scheduleId,
    }).then(this.showMessage());
  }

  createCourseCode(): Promise<IResponse<string>> {
    return this.get([RootPath.courses, SubPath.code]).then(this.showMessage());
  }

  getCourseTypes(): Promise<IResponse<CourseType[]>> {
    return this.get([RootPath.courses, SubPath.type]).then(this.showMessage());
  }

  @fieldMap()
  getTeachers(
    req?: model.TeachersRequest
  ): Promise<IResponse<model.TeachersResponse>> {
    return this.get<IResponse<model.TeachersResponse>>(
      RootPath.teachers,
      req as unknown as QueryParams
    ).then(this.showMessage());
  }

  @fieldMap()
  getTeacherById(id: number): Promise<IResponse<model.TeacherResponse>> {
    return this.get<IResponse<model.TeacherResponse>>([
      RootPath.teachers,
      id,
    ]).then(this.showMessage());
  }

  addTeacher(
    req: model.AddTeacherRequest
  ): Promise<IResponse<model.AddTeacherResponse>> {
    return this.post([RootPath.teachers], req).then(this.showMessage(true));
  }

  updateTeacher(
    req: model.UpdateTeacherRequest
  ): Promise<IResponse<model.UpdateTeacherResponse>> {
    return this.put([RootPath.teachers], req).then(this.showMessage(true));
  }

  deleteTeacher(id: number): Promise<IResponse<DeleteResponse>> {
    return this.delete([RootPath.teachers, id]).then(this.showMessage(true));
  }

  @fieldMap()
  getStatisticsOverview(): Promise<
    IResponse<statistics.StatisticsOverviewResponse>
  > {
    return this.get<IResponse<statistics.StatisticsOverviewResponse>>([
      RootPath.statistics,
      SubPath.overview,
    ]).then(this.showMessage());
  }

  @fieldMap()
  getStatistics<T, U = statistics.Statistic>(
    type: statistics.StatisticsType,
    userId?: number
  ): Promise<IResponse<statistics.StatisticsResponse<T, U>>> {
    return this.get<IResponse<statistics.StatisticsResponse<T, U>>>(
      [RootPath.statistics, type],
      !!userId ? { userId } : null
    ).then(this.showMessage());
  }

  getClassSchedule(userId: number): Promise<IResponse<ClassSchedule[]>> {
    return this.get<IResponse<ClassSchedule[]>>(
      [RootPath.class, SubPath.schedule],
      {
        userId,
      }
    ).then(this.showMessage());
  }

  getProfileByUserId<T>(
    userId: number,
    userRole?: model.Role
  ): Promise<IResponse<T>> {
    return this.get<IResponse<T>>([RootPath.profile], {
      userId,
      role: userRole || storage.role(),
    }).then(this.showMessage());
  }

  getAllInterestLanguages(): Promise<IResponse<BaseType[]>> {
    return this.get([RootPath.courses, SubPath.type]).then(this.showMessage());
  }

  getDegrees(): Promise<IResponse<Degree[]>> {
    return this.get([RootPath.degrees]).then(this.showMessage());
  }

  getCountries(): Promise<IResponse<Country[]>> {
    return this.get([RootPath.countries]).then(this.showMessage());
  }

  updateProfile<T>(req: Partial<T>): Promise<IResponse<T>> {
    return this.put([RootPath.profile, storage.role(), storage.userId()], {
      ...req,
    }).then(this.showMessage(true));
  }

  getMessages(req: MessagesRequest): Promise<IResponse<MessagesResponse>> {
    return this.get<IResponse<MessagesResponse>>([RootPath.message], {
      ...req,
    }).then(this.showMessage());
  }

  getMessageStatistic(
    userId?: number
  ): Promise<IResponse<MessageStatisticResponse>> {
    return this.get(
      [RootPath.message, SubPath.statistics],
      userId ? { userId } : null
    ).then(this.showMessage());
  }

  markAsRead(ids: number[]): Promise<IResponse<boolean>> {
    return this.put([RootPath.message], { status: 1, ids }).then(
      this.showMessage()
    );
  }

  /*
   * Helper Function
   * To get the countries of a specific region
   * */
  getWorld = async () => {
    return await axios.get(
      'https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json'
    );
  };

  messageEvent(): EventSource {
    return new EventSource(
      `${baseURL}/message/subscribe?userId=${storage.userId}`,
      {
        withCredentials: true,
      }
    );
  }
}

export const apiService = new ApiService();

export default apiService;
