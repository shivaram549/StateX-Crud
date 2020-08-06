import { atom, StateXSetter, StateXGetter } from '@cloudio/statex';

const initialList: any = [];

export const employeeListAtom = atom({
  path: ['employee', 'list'],
  defaultValue: initialList,
});

export const addEmployee = (name: string, set: StateXSetter) => {
  set(['employee', 'list'], (oldEmpList: any) => [
    ...oldEmpList,
    {
      id: oldEmpList.length,
      name,
      _rs: 'I',
    },
  ]);
};

export const getEmployees = (get: StateXGetter) => {
  return get(['employee', 'list']);
};

export const updateEmployee = (
  employee: any,
  newEmployee: any,
  set: StateXSetter,
  get: StateXGetter
) => {
  set(
    ['employee', 'list', ':id'],
    { ...employee, ...newEmployee, _rs: 'U' },
    {
      params: {
        id: employee.id,
      },
    }
  );
};

export const deleteEmployee = (
  employee: any,
  set: StateXSetter,
  get: StateXGetter
) => {
  set(
    ['employee', 'list', ':id'],
    { ...employee, _rs: 'D' },
    {
      params: {
        id: employee.id,
      },
    }
  );
};
