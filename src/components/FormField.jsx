const FormField = ({ label, id, children }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
};
export default FormField;
