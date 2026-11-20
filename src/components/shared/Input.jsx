const Input = ({
    id,
    required,
    label,
    placeholder,
    value,
    onHandleChange,
    onHandleBlur,
    error,
    info,
    type = "text",
}) => {
    return (
        <div className="flex flex-col w-1/2">
            <label htmlFor={id} className="label label-text font-medium">
                {label} {required && <span className="text-error">*</span>}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onHandleChange}
                onBlur={onHandleBlur}
                placeholder={placeholder}
                className={`input input-bordered w-full ${
                    error ? "input-error" : ""
                }`}
            />
            {error && <span className="text-error text-xs mt-1">{error}</span>}
            {!error && info && (
                <span className="text-[11px] text-base-content/50 mt-1">
                    {info}
                </span>
            )}
        </div>
    );
};

export default Input;
