export default function () {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = '';
  };

  const on = () => {
    window.addEventListener('beforeunload', handleBeforeUnload);
  };

  const off = () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };

  return { on, off };
}
