type Props = {
	name: string;
};

const Input = ({ name }: Props) => {
	return (
		<label htmlFor={name}>
			<p className="font-medium text-[14px]">{name}</p>
			<input
				className="border border-[#aaa] w-full px-4 outline-blue-500 duration-500 rounded-[8px] text-[14px] lg:text-base lg:py-2 py-2"
				placeholder={name}
				type={
					name.includes("email")
						? "email"
						: name.includes("password")
						? "password"
						: "text"
				}
			/>
		</label>
	);
};

export default Input;
