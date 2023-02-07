import {
  CalendarOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  FileAddOutlined,
  MessageOutlined,
  ReadOutlined,
  ProfileOutlined,
  ProjectOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Role } from '@/lib/model/role';
import { Role as Roles } from '@/constants/role';

export enum RoutePath {
  manager = 'manager',
  teachers = 'teachers',
  students = 'students',
  selectStudents = 'selectStudents',
  courses = 'courses',
  addCourse = 'add-course',
  editCourse = 'edit-course',
  own = 'own',
  schedule = 'schedule',
  profile = 'profile',
  message = 'message',
}

export interface SideNav {
  icon?: JSX.Element;
  label: string;
  path: string[];
  hideLinkInBreadcrumb?: boolean;
  subNav?: SideNav[];
  hide?: boolean;
}

const students: SideNav = {
  path: [RoutePath.students],
  label: 'Student',
  icon: <SolutionOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [{ path: [''], label: 'Student List', icon: <TeamOutlined /> }],
};

const courses: SideNav = {
  path: [RoutePath.courses],
  label: 'Course',
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [
    { path: [''], label: 'All Courses', icon: <ProjectOutlined /> },
    {
      path: [RoutePath.addCourse],
      label: 'Add Course',
      icon: <FileAddOutlined />,
    },
    {
      path: [RoutePath.editCourse],
      label: 'Edit Course',
      icon: <EditOutlined />,
    },
  ],
};

const teachers: SideNav = {
  path: [RoutePath.teachers],
  label: 'Teacher',
  icon: <DeploymentUnitOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [
    {
      path: [''],
      label: 'Teacher List',
      icon: <TeamOutlined />,
    },
  ],
};

const overview: SideNav = {
  path: [],
  label: 'Overview',
  icon: <DashboardOutlined />,
};

const studentCourses: SideNav = {
  path: [RoutePath.courses],
  label: 'Course',
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [
    { path: [''], label: 'All Courses', icon: <ProjectOutlined /> },
    { path: [RoutePath.own], label: 'My Courses', icon: <FileAddOutlined /> },
  ],
};

const classSchedule: SideNav = {
  path: [RoutePath.schedule],
  label: 'Class Schedule',
  icon: <CalendarOutlined />,
};

const profile: SideNav = {
  path: [RoutePath.profile],
  label: 'Profile',
  hide: true,
  icon: <ProfileOutlined />,
};

const messages: SideNav = {
  path: [RoutePath.message],
  label: 'Message',
  icon: <MessageOutlined />,
};

export const routes: Map<Role, SideNav[]> = new Map([
  [Roles.manager, [overview, students, teachers, courses, messages]],
  [
    Roles.teacher,
    [overview, classSchedule, students, courses, profile, messages],
  ],
  [Roles.student, [overview, studentCourses, classSchedule, profile, messages]],
]);
