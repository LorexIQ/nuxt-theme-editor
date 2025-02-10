import useLang from '../useLang';
import { computed, reactive } from '#imports';

type ValidationError = {
  id: number;
  message: (meta: any) => string;
};
type ValidationErrorPrepared = {
  id: number;
  message: string;
};

const validationErrors: ValidationError[] = [
  { id: 0, message: () => useLang('pageCreateEdit.messages.idRequired') },
  { id: 1, message: ({ id }) => useLang('pageCreateEdit.messages.idIncorrect')(id) },
  { id: 2, message: ({ id }) => useLang('pageCreateEdit.messages.idConflict')(id) },
  { id: 3, message: () => useLang('pageCreateEdit.messages.parentRequired') }
];

export default function () {
  const errors = reactive<ValidationErrorPrepared[]>([]);
  const isError = computed(() => errors.length);

  function add(id: number, meta?: any) {
    const error = validationErrors.find(err => err.id === id);
    if (error) errors.push({
      id: error.id,
      message: error.message(meta)
    });
  }
  function remove(...ids: number[]) {
    ids.forEach((id) => {
      const errorIndex = errors.findIndex(err => err.id === id);
      if (errorIndex !== -1) errors.splice(errorIndex, 1);
    });
  }
  function clear() {
    errors.splice(0);
  }

  return {
    errors,
    isError,
    add,
    remove,
    clear
  };
};
