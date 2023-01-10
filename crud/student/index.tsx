import { AddStudentResponse } from '@/domain/user.d';
import settings from '@/settings';

interface Student {
  name: string;
  email: string;
  country: string;
  type: number;
}

export const addStudent = async (student: Student, token: string) => {
  console.log('crud add student', student, token);

  const url = `${settings.base_url}/students`;
  const opts = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  };

  try {
    const res = await fetch(url, opts);
    const results = (await res.json()) as AddStudentResponse;

    return results.code === 201;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const updateStudent = async (student: Student, token: string) => {
  console.log('crud update student', student, token);

  const url = `${settings.base_url}/students`;
  const opts = {
    method: 'put',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  };

  try {
    const res = await fetch(url, opts);
    const results = await res.json();
    console.log('update student', results);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const deleteStudent = async (id: number, token: string) => {
  console.log('crud delete student', id, token);

  const url = `${settings.base_url}/students/${id}`;
  const opts = {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await fetch(url, opts);
    const results = await res.json();
    console.log('update student', results);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
