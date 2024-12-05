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
  { id: 0, message: () => 'The ID value is required.' },
  { id: 1, message: () => 'The ID may only contain digits, letters (a-z, A-Z), hyphens (-), and underscores (_).' },
  { id: 2, message: ({ id }) => `The theme with the ID "${id}" already exists.` },
  { id: 3, message: () => 'The parent theme is not set.' }
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
