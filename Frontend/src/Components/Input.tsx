type Props = {
	name: string;
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error?: string;
  };
  
  const Input = ({ name, label, value, onChange, error }: Props) => {
	return (
	  <label htmlFor={name} className="block">
		<p className="font-medium text-[14px]">{label}</p>
		<input
		  id={name}
		  name={name}
		  value={value}
		  onChange={onChange}
		  className="border border-[#aaa] w-full px-4 outline-blue-500 duration-500 rounded-[8px] text-[14px] lg:text-base lg:py-2 py-2"
		  placeholder={label}
		  required={true}
		  type={
			name.includes("email")
			  ? "email"
			  : name.includes("password")
			  ? "password"
			  : "text"
		  }
		/>
		{error && <p className="text-red-500 text-[12px] mt-1">{error}</p>}
	  </label>
	);
  };
  
  export default Input;
  